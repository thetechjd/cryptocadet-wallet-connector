// ============================================
// src/hooks/useWalletConnector.ts - Main Hook
// ============================================
import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { SUPPORTED_WALLETS, NETWORKS } from '../constants';

export const useWalletConnector = () => {
  const [walletType, setWalletType] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [ethersProvider, setEthersProvider] = useState<BrowserProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Solana-specific methods
  const [sendTransaction, setSendTransaction] = useState<((transaction: any, connection: any, options?: any) => Promise<string>) | null>(null);
  const [signTransaction, setSignTransaction] = useState<((transaction: any) => Promise<any>) | null>(null);
  const [signAllTransactions, setSignAllTransactions] = useState<((transactions: any[]) => Promise<any[]>) | null>(null);

  // Check for existing connection on mount
  useEffect(() => {
    checkExistingConnection();
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!provider) return;

    const wallet = walletType ? SUPPORTED_WALLETS[walletType] : null;
    
    if (wallet?.chain === 'Solana') {
      // Solana event listeners
      const handleAccountChanged = () => {
        if (provider.publicKey) {
          setAddress(provider.publicKey.toString());
        } else {
          disconnect();
        }
      };

      const handleDisconnect = () => {
        disconnect();
      };

      if (provider.on) {
        provider.on('accountChanged', handleAccountChanged);
        provider.on('disconnect', handleDisconnect);
      }

      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountChanged', handleAccountChanged);
          provider.removeListener('disconnect', handleDisconnect);
        }
      };
    } else {
      // EVM event listeners
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAddress(accounts[0]);
        }
      };

      const handleChainChanged = (newChainId: string) => {
        setChainId(parseInt(newChainId, 16));
        setupEthersProvider(provider);
      };

      const handleDisconnect = () => {
        disconnect();
      };

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
      provider.on('disconnect', handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
          provider.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [provider, walletType]);

  // Update connected state
  useEffect(() => {
    setIsConnected(!!address);
  }, [address]);

  const checkExistingConnection = async () => {
    for (const [key, wallet] of Object.entries(SUPPORTED_WALLETS)) {
      if (wallet.check()) {
        try {
          const walletProvider = wallet.getProvider();
          
          if (wallet.chain === 'Solana') {
            // Check Solana connection
            if (walletProvider.isConnected && walletProvider.publicKey) {
              const sendTransactionWrapper = async (transaction: any, connection: any, options?: any) => {
                if (walletProvider.signAndSendTransaction) {
                  const { signature } = await walletProvider.signAndSendTransaction(transaction);
                  return signature;
                }
                const signed = await walletProvider.signTransaction(transaction);
                const signature = await connection.sendRawTransaction(signed.serialize(), options);
                return signature;
              };
              
              setWalletType(key);
              setProvider(walletProvider);
              setAddress(walletProvider.publicKey.toString());
              setChainId(0);
              setupSolanaMethods(walletProvider, sendTransactionWrapper);
              return;
            }
          
          } else {
            // Check EVM connection
            const accounts = await walletProvider.request({ method: 'eth_accounts' });
            
            if (accounts.length > 0) {
              const chainIdHex = await walletProvider.request({ method: 'eth_chainId' });
              setWalletType(key);
              setProvider(walletProvider);
              setAddress(accounts[0]);
              setChainId(parseInt(chainIdHex, 16));
              await setupEthersProvider(walletProvider);
              return;
            }
          }
        } catch (error) {
          console.error(`Error checking ${wallet.name}:`, error);
        }
      }
    }
  };

  const setupSolanaMethods = (walletProvider: any, sendTxWrapper?: any) => {
    console.log('Setting up Solana methods...');
    
    // Use the wrapper if provided, otherwise try to find sendTransaction
    if (sendTxWrapper) {
      console.log('Using sendTransaction wrapper');
      setSendTransaction(() => sendTxWrapper);
    } else if (walletProvider.sendTransaction) {
      const boundSendTx = walletProvider.sendTransaction.bind(walletProvider);
      console.log('Bound sendTransaction:', typeof boundSendTx);
      setSendTransaction(() => boundSendTx);
    } else {
      console.warn('sendTransaction not found on provider!');
      setSendTransaction(null);
    }
    
    if (walletProvider.signTransaction) {
      setSignTransaction(() => walletProvider.signTransaction.bind(walletProvider));
    }
    if (walletProvider.signAllTransactions) {
      setSignAllTransactions(() => walletProvider.signAllTransactions.bind(walletProvider));
    }
  };

  const connect = async (walletKey: string) => {
    const wallet = SUPPORTED_WALLETS[walletKey];
    
    if (!wallet) {
      throw new Error(`Wallet ${walletKey} not supported`);
    }

    if (!wallet.check()) {
      throw new Error(`${wallet.name} is not installed`);
    }

    try {
      const walletProvider = wallet.getProvider();
      
      if (wallet.chain === 'Solana') {
        // Solana connection
        console.log('Connecting to Solana wallet:', wallet.name);
        const response = await walletProvider.connect();
        const publicKey = response.publicKey.toString();
        
        console.log('Solana wallet connected:', publicKey);
        
        setWalletType(walletKey);
        setProvider(walletProvider);
        setAddress(publicKey);
        setChainId(0);
        
        // Create a sendTransaction wrapper for Phantom
        // Phantom doesn't have sendTransaction, but has signAndSendTransaction or we can sign+send manually
        const sendTransactionWrapper = async (transaction: any, connection: any, options?: any) => {
          // If provider has signAndSendTransaction, use it
          if (walletProvider.signAndSendTransaction) {
            const { signature } = await walletProvider.signAndSendTransaction(transaction);
            return signature;
          }
          
          // Otherwise, sign and send manually
          const signed = await walletProvider.signTransaction(transaction);
          const signature = await connection.sendRawTransaction(signed.serialize(), options);
          return signature;
        };
        
        setupSolanaMethods(walletProvider, sendTransactionWrapper);
        
        const returnData = {
          address: publicKey,
          chainId: 0,
          provider: walletProvider,
          ethersProvider: null,
          walletType: walletKey,
          sendTransaction: sendTransactionWrapper,
          signTransaction: walletProvider.signTransaction?.bind(walletProvider),
          signAllTransactions: walletProvider.signAllTransactions?.bind(walletProvider)
        };
        
        console.log('Returning connection data with wrapper');
        
        return returnData;
      
      } else {
        // EVM connection
        console.log('Connecting to EVM wallet:', wallet.name);
        const accounts = await walletProvider.request({ 
          method: 'eth_requestAccounts' 
        });

        if (accounts.length === 0) {
          throw new Error('No accounts found');
        }

        const chainIdHex = await walletProvider.request({ method: 'eth_chainId' });
        
        console.log('EVM wallet connected:', accounts[0]);
        
        setWalletType(walletKey);
        setProvider(walletProvider);
        setAddress(accounts[0]);
        setChainId(parseInt(chainIdHex, 16));
        
        const ethers = await setupEthersProvider(walletProvider);
        
        return {
          address: accounts[0],
          chainId: parseInt(chainIdHex, 16),
          provider: walletProvider,
          ethersProvider: ethers,
          walletType: walletKey
        };
      }
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  };

  const setupEthersProvider = async (walletProvider: any) => {
    try {
      const provider = new BrowserProvider(walletProvider);
      setEthersProvider(provider);
      return provider;
    } catch (error) {
      console.error("Error setting up ethers provider:", error);
      throw error;
    }
  };

  const disconnect = async () => {
    if (provider && walletType) {
      const wallet = SUPPORTED_WALLETS[walletType];
      if (wallet?.chain === 'Solana' && provider.disconnect) {
        try {
          await provider.disconnect();
        } catch (error) {
          console.error('Error disconnecting Solana wallet:', error);
        }
      }
    }
    
    setWalletType(null);
    setAddress(null);
    setChainId(null);
    setProvider(null);
    setEthersProvider(null);
    setSendTransaction(null);
    setSignTransaction(null);
    setSignAllTransactions(null);
  };

  const switchNetwork = async (newChainId: number) => {
    if (!provider) throw new Error('No provider connected');
    
    const wallet = walletType ? SUPPORTED_WALLETS[walletType] : null;
    if (wallet?.chain === 'Solana') {
      throw new Error('Network switching not supported for Solana wallets');
    }

    const network = Object.values(NETWORKS).find(n => n.id === newChainId);
    if (!network) throw new Error('Network not found');

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: network.chainId,
              chainName: network.name,
              rpcUrls: [network.rpcUrl],
              nativeCurrency: {
                name: network.currency,
                symbol: network.currency,
                decimals: 18
              }
            }],
          });
        } catch (addError) {
          throw addError;
        }
      } else {
        throw error;
      }
    }
  };

  return {
    address,
    chainId,
    isConnected,
    walletType,
    provider,
    ethersProvider,
    publicKey: address, // Alias for Solana compatibility
    wallet: walletType ? { adapter: { name: walletType } } : null, // For compatibility
    sendTransaction,
    signTransaction,
    signAllTransactions,
    connect,
    disconnect,
    switchNetwork
  };
};
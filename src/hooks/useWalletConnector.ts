// ============================================
// src/hooks/useWalletConnector.ts - Main Hook
// ============================================
import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { SUPPORTED_WALLETS, NETWORKS } from '../constants';
import { ConnectedWalletData, NetworkConfig } from '../types';

export const useWalletConnector = (targetChainId: number = 1) => {
  const [walletType, setWalletType] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [ethersProvider, setEthersProvider] = useState<BrowserProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Check for existing connection on mount
  useEffect(() => {
    checkExistingConnection();
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!provider) return;

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
  }, [provider]);

  // Update connected state
  useEffect(() => {
    setIsConnected(!!address && !!ethersProvider);
  }, [address, ethersProvider]);

  const checkExistingConnection = async () => {
    for (const [key, wallet] of Object.entries(SUPPORTED_WALLETS)) {
      if (wallet.check()) {
        try {
          const walletProvider = wallet.getProvider();
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
        } catch (error) {
          console.error(`Error checking ${wallet.name}:`, error);
        }
      }
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
      
      const accounts = await walletProvider.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const chainIdHex = await walletProvider.request({ method: 'eth_chainId' });
      
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

  const disconnect = () => {
    setWalletType(null);
    setAddress(null);
    setChainId(null);
    setProvider(null);
    setEthersProvider(null);
  };

  const switchNetwork = async (newChainId: number) => {
    if (!provider) throw new Error('No provider connected');

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
    connect,
    disconnect,
    switchNetwork
  };
};

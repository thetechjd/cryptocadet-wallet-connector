import { WalletInfo, NetworkConfig } from './types';
import metamaskLogo from './assets/MetaMask_Fox.png';
import trustwalletLogo from './assets/trust-wallet-icon.png';
import coinbaseLogo from './assets/coinbase_icon.png';
import phantomLogo from './assets/phantom-logo.png';
import solflareLogo from './assets/solflare-icon.png'

export const SUPPORTED_WALLETS: Record<string, WalletInfo> = {
    // EVM wallets
    METAMASK: {
      name: 'MetaMask',
      chain: 'EVM',
      check: () => typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask === true,
      getProvider: () => window.ethereum,
      icon: metamaskLogo
    },
    PHANTOM: {
      name: 'Phantom',
      chain: 'EVM',
      check: () => typeof window.phantom?.ethereum !== 'undefined',
      getProvider: () => window.phantom?.ethereum!,
      icon: phantomLogo
    },
    TRUSTWALLET: {
      name: 'Trust Wallet',
      chain: 'EVM',
      check: () => typeof window.ethereum !== 'undefined' && window.ethereum.isTrust === true,
      getProvider: () => window.ethereum,
      icon: trustwalletLogo
    },
    COINBASE: {
      name: 'Coinbase Wallet',
      chain: 'EVM',
      check: () => typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet === true,
      getProvider: () => window.ethereum,
      icon: coinbaseLogo
    },
    
    // Solana wallets
    PHANTOM_SOL: {
      name: 'Phantom',
      chain: 'Solana',
      check: () => typeof window.phantom?.solana !== 'undefined' && window.phantom.solana.isPhantom === true,
      getProvider: () => window.phantom?.solana!,
      icon: phantomLogo
    },
    SOLFLARE: {
      name: 'Solflare',
      chain: 'Solana',
      check: () => typeof window.solflare !== 'undefined',
      getProvider: () => window.solflare!,
      icon: solflareLogo
    }
  };
  
  // Filter wallets by chain
  export const getWalletsByChain = (chain: 'EVM' | 'Solana'): Record<string, WalletInfo> => {
    if (chain === 'EVM') {
      return {
        METAMASK: SUPPORTED_WALLETS.METAMASK,
        COINBASE: SUPPORTED_WALLETS.COINBASE,
        TRUSTWALLET: SUPPORTED_WALLETS.TRUSTWALLET,
        PHANTOM: SUPPORTED_WALLETS.PHANTOM
      };
    } else {
      // Solana: Only Phantom and Solflare (no MetaMask)
      return {
        PHANTOM_SOL: SUPPORTED_WALLETS.PHANTOM_SOL,
        SOLFLARE: SUPPORTED_WALLETS.SOLFLARE
      };
    }
  };

export const NETWORKS: Record<string, NetworkConfig> = {
  ETHEREUM: {
    id: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    chainId: '0x1',
    currency: 'ETH'
  },
  SEPOLIA: {
    id: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    chainId: '0xaa36a7',
    currency: 'ETH'
  },
  POLYGON: {
    id: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    chainId: '0x89',
    currency: 'MATIC'
  },
  BSC: {
    id: 56,
    name: 'BNB Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    chainId: '0x38',
    currency: 'BNB'
  }
};
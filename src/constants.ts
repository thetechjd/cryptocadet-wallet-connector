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
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/trNMW5_zO5iGvlX4OZ3SjVF-5hLNVsN5',
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
    rpcUrl: 'https://fabled-snowy-scion.matic.quiknode.pro/990cfac44f7c3e28cb6212001bc7dfb06833100b/',
    chainId: '0x89',
    currency: 'MATIC'
  },
  BSC: {
    id: 56,
    name: 'BNB Smart Chain',
    rpcUrl: 'https://frequent-winter-brook.bsc.quiknode.pro/e4836c2092d64623987e3393338fb92e03512504/',
    chainId: '0x38',
    currency: 'BNB'
  },
  AVALANCHE: {
    id: 43114,
    name: 'Avalanche C-Chain',
    rpcUrl: 'https://avax-mainnet.g.alchemy.com/v2/gOkgumMo6bV2fWBI5ih89uP7KW99oXye',
    chainId: '0xA86A',
    currency: 'AVAX'

  },
  BASE: {
    id: 8453,
    name: 'Base Mainnet',
    rpcUrl: 'https://base-mainnet.g.alchemy.com/v2/gOkgumMo6bV2fWBI5ih89uP7KW99oXye',
    chainId: '0x2105',
    currency: 'ETH'
  }
};
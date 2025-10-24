// src/constants.ts - Wallet & Network Configs
import { WalletInfo, NetworkConfig } from './types';
import metamaskLogo from "./assets/MetaMask_Fox.png"
import coinbaseLogo from "./assets/coinbase_icon.png";
import phantomLogo from "./assets/phantom-logo.png";
import trustwalletLogo from "./assets/trust-wallet-icon.png";


export const SUPPORTED_WALLETS: Record<string, WalletInfo> = {
  // EVM Wallets
  METAMASK: {
    name: 'MetaMask',
    chain: 'EVM',
    check: () => typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask === true,
    getProvider: () => window.ethereum,
    icon: metamaskLogo
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
  PHANTOM: {
    name: 'Phantom',
    chain: 'EVM',
    check: () => typeof window.phantom?.ethereum !== 'undefined' && window.phantom.ethereum.isPhantom === true,
    getProvider: () => window.phantom?.ethereum,
    icon: phantomLogo
  },

  // Solana Wallets
  PHANTOM_SOL: {
    name: 'Phantom',
    chain: 'Solana',
    check: () => {
      const solana = window.phantom?.solana;
      return solana !== undefined && solana.isPhantom === true;
    },
    getProvider: () => window.phantom?.solana,
    icon: phantomLogo
  },
  SOLFLARE: {
    name: 'Solflare',
    chain: 'Solana',
    check: () => {
      const solflare = window.solflare;
      return solflare !== undefined && solflare.isSolflare === true;
    },
    getProvider: () => window.solflare,
    icon: 'https://solflare.com/assets/logo.svg'
  },
  BACKPACK: {
    name: 'Backpack',
    chain: 'Solana',
    check: () => {
      const backpack = window.backpack;
      return backpack !== undefined && backpack.isBackpack === true;
    },
    getProvider: () => window.backpack,
    icon: 'https://backpack.app/icon.png'
  }
};

// Filter wallets by chain
export const getWalletsByChain = (chain: 'EVM' | 'Solana' | 'all' = 'all') => {
  if (chain === 'all') return SUPPORTED_WALLETS;
  return Object.fromEntries(
    Object.entries(SUPPORTED_WALLETS).filter(([_, wallet]) => wallet.chain === chain)
  );
};

export const NETWORKS: Record<string, NetworkConfig> = {
  ethereum: {
    id: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth.llamarpc.com',
    chainId: '0x1',
    currency: 'ETH'
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    chainId: '0x89',
    currency: 'MATIC'
  },
  bsc: {
    id: 56,
    name: 'BNB Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    chainId: '0x38',
    currency: 'BNB'
  },
  bscTestnet: {
    id: 97,
    name: 'BNB Smart Chain Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    chainId: '0x61',
    currency: 'tBNB'
  }
};
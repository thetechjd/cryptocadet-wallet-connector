// src/constants.ts - Wallet & Network Configs
import { WalletInfo, NetworkConfig } from './types';
import metamaskLogo from "./assets/MetaMask_Fox.png"
import coinbaseLogo from "./assets/coinbase_icon.png";
import phantomLogo from "./assets/phantom-logo.png";
import trustwalletLogo from "./assets/trust-wallet-icon.png";


export const SUPPORTED_WALLETS: Record<string, WalletInfo> = {
  METAMASK: {
    name: 'MetaMask',
    check: () => typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask === true,
    getProvider: () => window.ethereum,
    icon: metamaskLogo
  },
  TRUSTWALLET: {
    name: 'Trust Wallet',
    check: () => typeof window.ethereum !== 'undefined' && window.ethereum.isTrust === true,
    getProvider: () => window.ethereum,
    icon: trustwalletLogo
  },
  COINBASE: {
    name: 'Coinbase Wallet',
    check: () => typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet === true,
    getProvider: () => window.ethereum,
    icon: coinbaseLogo
  },
  PHANTOM: {
    name: 'Phantom',
    check: () => typeof window.phantom?.ethereum !== 'undefined' && window.phantom.ethereum.isPhantom === true,
    getProvider: () => window.phantom?.ethereum,
    icon: phantomLogo
  }
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
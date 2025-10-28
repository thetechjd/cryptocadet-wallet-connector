import { BrowserProvider } from 'ethers';
import type { Transaction, VersionedTransaction } from '@solana/web3.js';

export interface WalletInfo {
  name: string;
  check: () => boolean;
  getProvider: () => any;
  icon: string;
  chain: 'EVM' | 'Solana'
}

export interface NetworkConfig {
  id: number;
  name: string;
  rpcUrl: string;
  chainId: string;
  currency: string;
}

export interface ConnectedWalletData {
  address: string;
  chainId: number;
  provider: any;
  ethersProvider: BrowserProvider | null;
  walletType: string;
  // Solana-specific methods
  sendTransaction?: (transaction: Transaction | VersionedTransaction, connection: any) => Promise<string>;
  signTransaction?: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>;
  signAllTransactions?: (transactions: (Transaction | VersionedTransaction)[]) => Promise<(Transaction | VersionedTransaction)[]>;
}

export interface WalletConnectorProps {
  chain: 'EVM' | 'Solana';
  onConnect?: (data: ConnectedWalletData) => void;
  onDisconnect?: () => void;
  targetChainId?: number;
  buttonText?: string;
  buttonStyle?: React.CSSProperties;
  networks?: Record<string, NetworkConfig>;
  autoConnect?: boolean;
}

export interface WalletSelectorProps {
  wallets: Record<string, WalletInfo>;
  onSelect: (walletKey: string) => void;
  onClose: () => void;
}

// Extend the Window interface for wallet providers
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isTrust?: boolean;
      isCoinbaseWallet?: boolean;
      request?: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (event: string, callback: (...args: any[]) => void) => void;
      removeListener?: (event: string, callback: (...args: any[]) => void) => void;
    };
    phantom?: {
      ethereum?: {
        isPhantom?: boolean;
        request?: (args: { method: string; params?: any[] }) => Promise<any>;
        on?: (event: string, callback: (...args: any[]) => void) => void;
      };
      solana?: {
        isPhantom?: boolean;
        connect?: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
        disconnect?: () => Promise<void>;
        on?: (event: string, callback: (...args: any[]) => void) => void;
        request?: (args: { method: string; params?: any }) => Promise<any>;
        sendTransaction?: (transaction: any, connection: any, options?: any) => Promise<string>;
        signTransaction?: (transaction: any) => Promise<any>;
        signAllTransactions?: (transactions: any[]) => Promise<any[]>;
        publicKey?: { toString: () => string };
      };
    };
    solflare?: {
      connect?: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect?: () => Promise<void>;
      on?: (event: string, callback: (...args: any[]) => void) => void;
      publicKey?: { toString: () => string };
      sendTransaction?: (transaction: any, connection: any, options?: any) => Promise<string>;
      signTransaction?: (transaction: any) => Promise<any>;
      signAllTransactions?: (transactions: any[]) => Promise<any[]>;
    };
  }
}

export {};
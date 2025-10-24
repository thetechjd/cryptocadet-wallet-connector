// src/global.d.ts - Global type declarations
export {};

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isTrust?: boolean;
      isCoinbaseWallet?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener?: (event: string, callback: (...args: any[]) => void) => void;
      removeAllListeners?: (event: string) => void;
    };
    phantom?: {
      ethereum?: {
        isPhantom?: boolean;
        request: (args: { method: string; params?: any[] }) => Promise<any>;
        on: (event: string, callback: (...args: any[]) => void) => void;
        removeListener?: (event: string, callback: (...args: any[]) => void) => void;
      };
      solana?: {
        isPhantom: boolean;
        connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
        disconnect: () => Promise<void>;
        signMessage: (message: Uint8Array, encoding?: string) => Promise<{ signature: Uint8Array; publicKey: any }>;
        signTransaction: (transaction: any) => Promise<any>;
        signAllTransactions: (transactions: any[]) => Promise<any[]>;
        on: (event: string, callback: (...args: any[]) => void) => void;
        request: (args: { method: string; params?: any }) => Promise<any>;
      };
    };
    solflare?: {
      isSolflare: boolean;
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      signMessage: (message: Uint8Array, encoding?: string) => Promise<{ signature: Uint8Array; publicKey: any }>;
      signTransaction: (transaction: any) => Promise<any>;
      signAllTransactions: (transactions: any[]) => Promise<any[]>;
      on: (event: string, callback: (...args: any[]) => void) => void;
    };
    backpack?: {
      isBackpack: boolean;
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      signMessage: (message: Uint8Array, encoding?: string) => Promise<{ signature: Uint8Array; publicKey: any }>;
      signTransaction: (transaction: any) => Promise<any>;
      signAllTransactions: (transactions: any[]) => Promise<any[]>;
      on: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}
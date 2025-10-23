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
    };
  }
}
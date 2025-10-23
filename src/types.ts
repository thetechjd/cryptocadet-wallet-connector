import { BrowserProvider } from 'ethers';

export interface WalletInfo {
  name: string;
  check: () => boolean;
  getProvider: () => any;
  icon: string;
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
  ethersProvider: BrowserProvider;
  walletType: string;
}

export interface WalletConnectorProps {
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

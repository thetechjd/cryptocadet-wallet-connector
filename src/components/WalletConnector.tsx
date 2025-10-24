import React, { useState, useEffect } from 'react';
import { WalletSelector } from './WalletSelector';
import { useWalletConnector } from '../hooks/useWalletConnector';
import { SUPPORTED_WALLETS } from '../constants';
import { WalletConnectorProps } from '../types';

export const WalletConnector: React.FC<WalletConnectorProps> = ({
  onConnect,
  onDisconnect,
  targetChainId: _targetChainId = 1,
  buttonText = 'Connect Wallet',
  buttonStyle,
}) => {
  const [showSelector, setShowSelector] = useState(false);

  const {
    address,
    chainId,
    isConnected,
    walletType,
    provider,
    ethersProvider,
    connect,
    disconnect,
  } = useWalletConnector();

  useEffect(() => {
    if (isConnected && address && ethersProvider && onConnect) {
      onConnect({
        address,
        chainId: chainId!,
        provider,
        ethersProvider,
        walletType: walletType!
      });
    }
  }, [isConnected, address, ethersProvider]);

  const handleConnect = async (walletKey: string) => {
    try {
      await connect(walletKey);
      setShowSelector(false);
    } catch (error: any) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    if (onDisconnect) onDisconnect();
  };

  const defaultButtonStyle = {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600' as const,
    cursor: 'pointer',
  };

  if (!isConnected) {
    return (
      <>
        <button
          style={{ ...defaultButtonStyle, ...buttonStyle }}
          onClick={() => setShowSelector(true)}
        >
          {buttonText}
        </button>
        
        {showSelector && (
          <WalletSelector
            wallets={SUPPORTED_WALLETS}
            onSelect={handleConnect}
            onClose={() => setShowSelector(false)}
          />
        )}
      </>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontFamily: 'monospace' }}>
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </span>
      <button
        onClick={handleDisconnect}
        style={{ ...defaultButtonStyle, background: '#404040' }}
      >
        Disconnect
      </button>
    </div>
  );
};
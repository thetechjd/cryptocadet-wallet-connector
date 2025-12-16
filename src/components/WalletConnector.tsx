"use client"
import React, { useState, useEffect, useRef } from 'react';
import { WalletSelector } from './WalletSelector';
import { useWalletConnector } from '../hooks/useWalletConnector';
import { getWalletsByChain} from '../constants';
import { WalletConnectorProps } from '../types';

export const WalletConnector: React.FC<WalletConnectorProps> = ({
  chain,
  onConnect,
  onDisconnect,
  targetChainId: _targetChainId = 1,
  buttonText = 'Connect Wallet',
  buttonStyle,
}) => {
  const [showSelector, setShowSelector] = useState(false);
  const hasNotified = useRef(false);

  const {
    address,
    chainId,
    isConnected,
    walletType,
    provider,
    ethersProvider,
    sendTransaction,
    signTransaction,
    signAllTransactions,
    connect,
    disconnect,
  } = useWalletConnector();

  useEffect(() => {
    console.log('WalletConnector state:', { 
      isConnected, 
      address, 
      walletType, 
      chainId,
      hasSendTransaction: !!sendTransaction 
    });
    
    if (isConnected && address && walletType && onConnect && !hasNotified.current) {
      console.log('Calling onConnect with data');
      onConnect({
        address,
        chainId: chainId ?? 0,
        provider,
        ethersProvider: ethersProvider!,
        walletType,
        sendTransaction: sendTransaction ?? undefined,
        signTransaction: signTransaction ?? undefined,
        signAllTransactions: signAllTransactions ?? undefined
      });
      hasNotified.current = true;
    }
    
    // Reset the flag when disconnected
    if (!isConnected) {
      hasNotified.current = false;
    }
  }, [isConnected, address, walletType, chainId, ethersProvider, sendTransaction, signTransaction, signAllTransactions]);

  const handleConnect = async (walletKey: string) => {
    try {
      console.log('Attempting to connect wallet:', walletKey);
      await connect(walletKey);
      setShowSelector(false);
    } catch (error: any) {
      console.error('Connection error:', error);
      alert(`Connection failed: ${error.message}`);
    }
  };

  const handleDisconnect = () => {
    hasNotified.current = false;
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

  const availableWallets = getWalletsByChain(chain);

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
            wallets={availableWallets}
            onSelect={handleConnect}
            onClose={() => setShowSelector(false)}
          />
        )}
      </>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontFamily: 'monospace', color: '#1a1a1a' }}>
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
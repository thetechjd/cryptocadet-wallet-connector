"use client"
import React from 'react';
import { WalletSelectorProps } from '../types';


export const WalletSelector: React.FC<WalletSelectorProps> = ({ 
  wallets, 
  onSelect, 
  onClose 
}) => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '36px',
          width: '540px',
          maxWidth: '90vw',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
        
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#000',
              margin: 0,
            }}>
              Connect Wallet
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '36px',
              color: '#999',
              cursor: 'pointer',
              lineHeight: '1',
              padding: 0,
              width: '36px',
              height: '36px',
            }}
          >
            ×
          </button>
        </div>

        {/* Wallet List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '28px',
        }}>
          {Object.entries(wallets).map(([key, wallet]) => {
            const isInstalled = wallet.check();
            
            return (
              <button
                key={key}
                onClick={() => onSelect(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px 24px',
                  background: '#F5F5F5',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img 
                    src={wallet.icon} 
                    alt={wallet.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: '#000',
                    marginBottom: '4px',
                  }}>
                    {wallet.name}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    color: '#999',
                  }}>
                    {isInstalled ? 'Detected' : 'Not installed'}
                  </div>
                </div>
                {!isInstalled && (
                  <div style={{
                    fontSize: '28px',
                    color: '#666',
                  }}>
                    →
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer with Terms */}
        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#999',
          paddingTop: '8px',
          marginBottom: '16px',
        }}>
          By connecting a wallet, you agree to the Terms of Service
        </div>

        {/* CryptoCadet Watermark */}
        <div style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#ccc',
          fontWeight: '500',
        }}>
          cryptocadet™
        </div>
      </div>
    </div>
  );
};
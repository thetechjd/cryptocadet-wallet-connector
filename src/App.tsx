"use client"

import { useState } from 'react';
import { WalletConnector } from './components/WalletConnector';
import { ConnectedWalletData } from './types';
import { NETWORKS } from './constants';
import './styles/WalletConnector.css';
import './styles/WalletSelector.css';
import { Connection, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

function App() {
  const [selectedChain, setSelectedChain] = useState<'EVM' | 'Solana'>('EVM');
  const [connectedData, setConnectedData] = useState<ConnectedWalletData | null>(null);
  const [txStatus, setTxStatus] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  const handleConnect = (data: ConnectedWalletData) => {
    console.log('Connected:', data);
    setConnectedData(data);
    setTxStatus('');
  };

  const handleDisconnect = () => {
    console.log('Wallet disconnected');
    setConnectedData(null);
    setTxStatus('');
  };

  const sendTestSolanaTransaction = async () => {
    if (!connectedData || !connectedData.sendTransaction) {
      setTxStatus('❌ No Solana wallet connected or sendTransaction not available');
      return;
    }

    setIsSending(true);
    setTxStatus('🔄 Preparing transaction...');

    try {
      // Connect to Solana mainnet
      const connection = new Connection('https://flashy-virulent-lambo.solana-mainnet.quiknode.pro/7635c87373d498d80766158ef2fc66dbbc9f4c09/', 'confirmed');
      
      // Get the wallet's public key
      const fromPubkey = new PublicKey(connectedData.address);
      
      // Create a test transaction (sending 0.001 SOL to yourself)
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromPubkey,
          toPubkey: fromPubkey, // Sending to yourself
          lamports: 0.001 * LAMPORTS_PER_SOL, // 0.001 SOL
        })
      );

      // Get recent blockhash
      setTxStatus('🔄 Getting recent blockhash...');
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      setTxStatus('🔄 Sending transaction...');
      console.log('Transaction:', transaction);

      // Send transaction using the wallet's sendTransaction method
      const signature = await connectedData.sendTransaction(transaction, connection);
      
      setTxStatus(`✅ Transaction sent! Signature: ${signature}`);
      console.log('Transaction signature:', signature);
      console.log('View on Solscan:', `https://solscan.io/tx/${signature}`);

      // Wait for confirmation
      setTxStatus(`🔄 Waiting for confirmation... Signature: ${signature}`);
      await connection.confirmTransaction(signature, 'confirmed');
      
      setTxStatus(`✅ Transaction confirmed! View on Solscan: https://solscan.io/tx/${signature}`);
    } catch (error: any) {
      console.error('Transaction error:', error);
      setTxStatus(`❌ Transaction failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#ffffff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#1a1a1a' }}>🔗 Multi-Chain Wallet Connector Test</h1>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '40px',
        border: '1px solid #e0e0e0'
      }}>
        <h2 style={{ color: '#1a1a1a' }}>Select Chain</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => {
              setSelectedChain('EVM');
              setConnectedData(null);
              setTxStatus('');
            }}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              border: '2px solid',
              borderRadius: '8px',
              cursor: 'pointer',
              background: selectedChain === 'EVM' ? '#4CAF50' : 'white',
              color: selectedChain === 'EVM' ? 'white' : '#1a1a1a',
              borderColor: '#4CAF50'
            }}
          >
            EVM Chain
          </button>
          <button
            onClick={() => {
              setSelectedChain('Solana');
              setConnectedData(null);
              setTxStatus('');
            }}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              border: '2px solid',
              borderRadius: '8px',
              cursor: 'pointer',
              background: selectedChain === 'Solana' ? '#9945FF' : 'white',
              color: selectedChain === 'Solana' ? 'white' : '#1a1a1a',
              borderColor: '#9945FF'
            }}
          >
            Solana Chain
          </button>
        </div>

        <p style={{ color: '#666', marginBottom: '20px' }}>
          {selectedChain === 'EVM' 
            ? '🔷 EVM wallets: MetaMask, Coinbase, Trust Wallet, Phantom'
            : '⚡ Solana wallets: Phantom, Solflare'
          }
        </p>
        
        <WalletConnector
          chain={selectedChain}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          targetChainId={1}
          buttonText={`Connect ${selectedChain} Wallet`}
          autoConnect={false}
          networks={NETWORKS}
        />

        {connectedData && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            background: 'white',
            borderRadius: '8px',
            border: '2px solid #4CAF50'
          }}>
            <h3 style={{ color: '#2e7d32', marginTop: 0 }}>✅ Connection Details</h3>
            <div style={{ color: '#1a1a1a' }}>
              <p><strong>Wallet Type:</strong> {connectedData.walletType}</p>
              <p style={{ 
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}>
                <strong>Address:</strong> {connectedData.address}
              </p>
              <p><strong>Chain ID:</strong> {connectedData.chainId === 0 ? 'Solana' : connectedData.chainId}</p>
              <p><strong>Provider:</strong> {connectedData.provider ? '✓ Connected' : '✗ No provider'}</p>
              <p><strong>Ethers Provider:</strong> {connectedData.ethersProvider ? '✓ Available' : '✗ N/A (Solana)'}</p>
              <p><strong>Send Transaction:</strong> {connectedData.sendTransaction ? '✓ Available' : '✗ N/A'}</p>
            </div>

            {/* Test Transaction Button for Solana */}
            {selectedChain === 'Solana' && connectedData.sendTransaction && (
              <div style={{ marginTop: '20px' }}>
                <button
                  onClick={sendTestSolanaTransaction}
                  disabled={isSending}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: isSending ? 'not-allowed' : 'pointer',
                    background: isSending ? '#ccc' : '#9945FF',
                    color: 'white',
                    opacity: isSending ? 0.6 : 1
                  }}
                >
                  {isSending ? '⏳ Sending...' : '💸 Send Test Transaction (0.001 SOL)'}
                </button>
                
                {txStatus && (
                  <div style={{
                    marginTop: '15px',
                    padding: '15px',
                    background: txStatus.includes('❌') ? '#ffebee' : txStatus.includes('✅') ? '#e8f5e9' : '#fff3e0',
                    borderRadius: '8px',
                    border: `1px solid ${txStatus.includes('❌') ? '#ef5350' : txStatus.includes('✅') ? '#66bb6a' : '#ffa726'}`,
                    wordBreak: 'break-all'
                  }}>
                    <p style={{ margin: 0, fontSize: '14px' }}>{txStatus}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
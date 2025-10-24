import { WalletConnector } from './components/WalletConnector';
import { useWalletConnector } from './hooks/useWalletConnector';
import './styles/WalletConnector.css';
import './styles/WalletSelector.css';

function App() {
  const handleConnect = (data: any) => {
    console.log('Connected:', data);
    
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1>Wallet Connector Test</h1>
      
      <WalletConnector
        onConnect={handleConnect}
        targetChainId={1}
        buttonText="Connect Wallet"
      />
      
      <hr style={{ margin: '40px 0' }} />
      
      <HookExample />
    </div>
  );
}

function HookExample() {
  const { address, chainId, isConnected, connect, disconnect } = useWalletConnector();

  return (
    <div>
      <h2>Hook Example</h2>
      {!isConnected ? (
        <div>
          <button onClick={() => connect('METAMASK')}>Connect MetaMask</button>
          <button onClick={() => connect('TRUSTWALLET')}>Connect Trust Wallet</button>
        </div>
      ) : (
        <div>
          <p>Address: {address}</p>
          <p>Chain: {chainId}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}

export default App;
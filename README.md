# @cryptocadet/wallet-connector

A lightweight, zero-dependency alternative to Web3Modal for connecting to popular Web3 wallets. Built with React and ethers.js v6.

## Features

- 🦊 **MetaMask** support
- 🛡️ **Trust Wallet** support  
- 🔵 **Coinbase Wallet** support
- 👻 **Phantom** support
- 🎨 Beautiful, customizable UI
- 📦 Tiny bundle size (~15kb gzipped)
- 🔌 Easy integration with ethers.js v6
- 🎯 TypeScript support
- 🚫 No external dependencies (except peer deps)

## Installation

\`\`\`bash
npm install @cryptocadet/wallet-connector ethers
# or
yarn add @cryptocadet/wallet-connector ethers
# or
pnpm add @cryptocadet/wallet-connector ethers
\`\`\`

## Quick Start (Recommended)

Use your own button and the hook:
```tsx
import { useState } from 'react';
import { useWalletConnector, WalletSelector, SUPPORTED_WALLETS } from '@cryptocadet/wallet-connector';

function App() {
  const [showModal, setShowModal] = useState(false);
  const { address, isConnected, connect, disconnect } = useWalletConnector();

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        {isConnected ? address.slice(0, 6) + '...' : 'Connect Wallet'}
      </button>

      {showModal && (
        <WalletSelector
          wallets={SUPPORTED_WALLETS}
          onSelect={async (key) => {
            await connect(key);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
```

## Or Use Our Pre-built Component
```tsx
import { WalletConnector } from '@cryptocadet/wallet-connector';

<WalletConnector onConnect={(data) => console.log(data)} />
```


## Advanced Usage

### Custom Styling

\`\`\`jsx
<WalletConnector
  onConnect={handleConnect}
  buttonText="Connect Your Wallet"
  buttonStyle={{
    background: 'linear-gradient(to right, #667eea, #764ba2)',
    padding: '16px 32px',
  }}
/>
\`\`\`

### Network Configuration

\`\`\`jsx
import { WalletConnector, NETWORKS } from '@cryptocadet/wallet-connector';

<WalletConnector
  onConnect={handleConnect}
  targetChainId={56} // BSC
  networks={NETWORKS} // Optional: customize networks
/>
\`\`\`

### Using the Hook

\`\`\`jsx
import { useWalletConnector } from '@cryptocadet/wallet-connector';

function MyComponent() {
  const {
    address,
    chainId,
    isConnected,
    connect,
    disconnect,
    switchNetwork,
    ethersProvider
  } = useWalletConnector();

  return (
    <div>
      {!isConnected ? (
        <button onClick={() => connect('METAMASK')}>
          Connect MetaMask
        </button>
      ) : (
        <>
          <p>Connected: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </>
      )}
    </div>
  );
}
\`\`\`

## API Reference

### WalletConnector Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`onConnect\` | \`function\` | - | Callback when wallet connects |
| \`onDisconnect\` | \`function\` | - | Callback when wallet disconnects |
| \`targetChainId\` | \`number\` | \`1\` | Target blockchain network |
| \`buttonText\` | \`string\` | \`"Connect Wallet"\` | Button label |
| \`buttonStyle\` | \`object\` | - | Custom button styles |
| \`networks\` | \`object\` | Default networks | Custom network configs |

### useWalletConnector Hook

Returns an object with:

- \`address\`: Connected wallet address
- \`chainId\`: Current chain ID
- \`isConnected\`: Connection status
- \`walletType\`: Type of connected wallet
- \`provider\`: Raw wallet provider
- \`ethersProvider\`: Ethers.js BrowserProvider instance
- \`connect(walletKey)\`: Connect to specific wallet
- \`disconnect()\`: Disconnect wallet
- \`switchNetwork(chainId)\`: Switch to different network

## Supported Wallets

- **MetaMask**: Browser extension and mobile app
- **Trust Wallet**: Mobile app with WalletConnect
- **Coinbase Wallet**: Browser extension and mobile app
- **Phantom**: Browser extension (Ethereum support)

## Network Support

Pre-configured networks:
- Ethereum Mainnet (1)
- Polygon (137)
- BSC (56)
- BSC Testnet (97)

Add custom networks via the \`networks\` prop.

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.
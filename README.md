# 🚀 Web3 Ethereum Transaction Application

A React-based Web3 application for sending Ethereum transactions using MetaMask or Coinbase Wallet.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Prerequisites](#prerequisites)
- [Getting Test ETH](#getting-test-eth)
- [Security Notes](#security-notes)

## Features

✅ **Wallet Connection** - Connect MetaMask or Coinbase Wallet
✅ **Check Balance** - View your ETH balance in real-time
✅ **Send Transactions** - Send ETH to any Ethereum address
✅ **Network Detection** - Automatically detect connected network
✅ **Error Handling** - Comprehensive validation and error messages
✅ **Transaction Tracking** - View transaction hash with Etherscan link
✅ **Responsive Design** - Works on desktop and mobile devices
✅ **Auto-connect** - Automatically reconnect to wallet on page reload

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MetaMask or Coinbase Wallet browser extension

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Heromontage/web3-transaction-app.git
   cd web3-transaction-app
   ```

2. **Install dependencies:**
   ```bash
   npm install ethers
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Usage

### Connect Your Wallet
1. Click the "Connect Wallet" button
2. Select your wallet (MetaMask or Coinbase Wallet)
3. Approve the connection in your wallet extension

### Send a Transaction
1. Enter the recipient's Ethereum address
2. Enter the amount of ETH to send
3. Click "Send Transaction"
4. Confirm the transaction in your wallet
5. Wait for confirmation

### Disconnect Wallet
Click the "Disconnect Wallet" button to disconnect your wallet.

## Prerequisites

- **Node.js**: Download from https://nodejs.org/
- **Browser Extension**: 
  - MetaMask: https://metamask.io
  - Coinbase Wallet: https://www.coinbase.com/wallet
- **Test ETH**: Required for testing on testnets (see below)

## Getting Test ETH

To test this app without spending real money, use a testnet with test ETH:

### Sepolia Testnet (Recommended)
- **Faucet**: https://sepoliafaucet.com
- **Explorer**: https://sepolia.etherscan.io
- **Instructions**:
  1. Switch to Sepolia in MetaMask
  2. Copy your wallet address
  3. Paste it on the faucet website
  4. Claim test ETH

### Goerli Testnet
- **Faucet**: https://goerlifaucet.com
- **Explorer**: https://goerli.etherscan.io

## Supported Networks

- Ethereum Mainnet
- Sepolia Testnet
- Goerli Testnet
- Polygon (Matic)
- Arbitrum
- Optimism
- And any other EVM-compatible network

## Supported Wallets

- MetaMask
- Coinbase Wallet
- Brave Wallet
- Any EIP-1193 compatible wallet

## Project Structure

```
web3-transaction-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Web3Transaction.js
│   │   └── Web3Transaction.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Technologies Used

- **React 18** - UI framework
- **ethers.js 6** - Ethereum library
- **CSS3** - Styling

## Security Considerations

⚠️ **Important Security Notes:**

1. **Never share your private keys** - This app only uses your wallet's signing capability
2. **Always verify addresses** - Double-check recipient addresses before sending
3. **Transactions are irreversible** - Once sent, transactions cannot be undone
4. **Use testnet first** - Test with testnet ETH before using mainnet
5. **Check gas prices** - Be aware of network conditions and gas prices
6. **Only use official wallet extensions** - Install from official sources only

## Troubleshooting

### "Please install MetaMask or Coinbase Wallet"
- Install MetaMask: https://metamask.io
- Install Coinbase Wallet: https://www.coinbase.com/wallet

### "Insufficient balance"
- Get test ETH from a faucet (see "Getting Test ETH" section)
- Make sure you're on the correct network

### "Invalid Ethereum address"
- Check that the address is a valid Ethereum address (starts with 0x)
- Ensure it's 42 characters long (including 0x prefix)

### Transaction fails
- Check your gas price settings
- Ensure the recipient address is valid
- Make sure you have enough ETH for gas fees

## API References

- [ethers.js Documentation](https://docs.ethers.org/v6/)
- [Ethereum JSON-RPC](https://ethereum.org/en/developers/docs/apis/json-rpc/)
- [EIP-1193 MetaMask](https://docs.metamask.io/guide/rpc-api.html)

## License

MIT

## Disclaimer

This is a demonstration application. Use at your own risk. Always verify transactions before confirming.

## Support

For issues or questions, please open an issue in the repository.

---

**Made with ❤️ for the Web3 community**

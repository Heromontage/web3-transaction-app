import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './Web3Transaction.css';

export default function Web3Transaction() {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amountETH, setAmountETH] = useState('');
  const [txHash, setTxHash] = useState(null);
  const [txStatus, setTxStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [chainInfo, setChainInfo] = useState(null);

  // Check if wallet is connected on load
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          getBalance(accounts[0]);
        } else {
          disconnectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Check if wallet is already connected
  async function checkIfWalletIsConnected() {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        });

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          getBalance(accounts[0]);
          getChainInfo();
        }
      }
    } catch (error) {
      console.error('Error checking wallet:', error);
      setError('Failed to check wallet connection');
    }
  }

  // Get chain information
  async function getChainInfo() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setChainInfo({
        name: network.name,
        chainId: Number(network.chainId)
      });
    } catch (error) {
      console.error('Error getting chain info:', error);
    }
  }

  // Connect wallet
  async function connectWallet() {
    try {
      setError(null);

      if (!window.ethereum) {
        setError('❌ Please install MetaMask or Coinbase Wallet extension');
        return;
      }

      // Detect wallet type
      if (window.ethereum.isCoinbaseWallet) {
        setWalletType('Coinbase Wallet');
      } else if (window.ethereum.isMetaMask) {
        setWalletType('MetaMask');
      } else if (window.ethereum.isBraveWallet) {
        setWalletType('Brave Wallet');
      } else {
        setWalletType('Ethereum Provider');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      setAccount(accounts[0]);
      setIsConnected(true);
      getBalance(accounts[0]);
      getChainInfo();
      setError(null);
    } catch (error) {
      setError(`❌ Error connecting wallet: ${error.message}`);
      console.error('Error connecting wallet:', error);
    }
  }

  // Get wallet balance
  async function getBalance(address) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const bal = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(bal);
      setBalance(parseFloat(balanceInEth).toFixed(6));
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError('❌ Error fetching balance');
    }
  }

  // Send transaction
  async function sendTransaction() {
    try {
      setError(null);
      setLoading(true);
      setTxStatus('Validating...');

      // Validation
      if (!recipientAddress.trim()) {
        setError('❌ Please enter a recipient address');
        setLoading(false);
        setTxStatus(null);
        return;
      }

      if (!amountETH.trim()) {
        setError('❌ Please enter an amount');
        setLoading(false);
        setTxStatus(null);
        return;
      }

      // Validate address format
      if (!ethers.isAddress(recipientAddress)) {
        setError('❌ Invalid Ethereum address format');
        setLoading(false);
        setTxStatus(null);
        return;
      }

      // Check if sending to same address
      if (recipientAddress.toLowerCase() === account.toLowerCase()) {
        setError('❌ Cannot send to the same address');
        setLoading(false);
        setTxStatus(null);
        return;
      }

      const amount = parseFloat(amountETH);

      // Validate amount
      if (isNaN(amount) || amount <= 0) {
        setError('❌ Amount must be a positive number');
        setLoading(false);
        setTxStatus(null);
        return;
      }

      // Check sufficient balance
      if (amount > parseFloat(balance)) {
        setError(`❌ Insufficient balance. Your balance: ${balance} ETH`);
        setLoading(false);
        setTxStatus(null);
        return;
      }

      setTxStatus('Connecting to wallet...');

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create transaction object
      const transaction = {
        to: recipientAddress,
        value: ethers.parseEther(amountETH.toString()),
      };

      setTxStatus('Waiting for user confirmation...');

      // Send transaction
      const tx = await signer.sendTransaction(transaction);
      
      console.log('Transaction sent:', tx.hash);
      setTxHash(tx.hash);
      setTxStatus('Transaction sent! Waiting for confirmation...');

      // Wait for confirmation
      const receipt = await tx.wait();
      
      console.log('Transaction confirmed:', receipt);
      setTxStatus('✅ Transaction confirmed!');

      // Reset form
      setRecipientAddress('');
      setAmountETH('');
      
      // Refresh balance
      await getBalance(account);

      // Show success alert
      alert(`✅ Transaction successful!\n\nTx Hash: ${tx.hash}\n\nView on Etherscan: https://etherscan.io/tx/${tx.hash}`);

      // Clear status after 3 seconds
      setTimeout(() => {
        setTxStatus(null);
      }, 3000);

    } catch (error) {
      if (error.code === 'ACTION_REJECTED') {
        setError('❌ Transaction rejected by user');
      } else {
        setError(`❌ Transaction failed: ${error.message}`);
      }
      console.error('Error sending transaction:', error);
      setTxStatus(null);
    } finally {
      setLoading(false);
    }
  }

  // Disconnect wallet
  function disconnectWallet() {
    setAccount(null);
    setIsConnected(false);
    setBalance(null);
    setWalletType(null);
    setRecipientAddress('');
    setAmountETH('');
    setTxHash(null);
    setTxStatus(null);
    setError(null);
    setChainInfo(null);
  }

  // Copy to clipboard function
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert('✅ Copied to clipboard!');
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🚀 Web3 Ethereum Transaction</h1>
        <p className="subtitle">Send ETH with MetaMask or Coinbase Wallet</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
          <button 
            className="alert-close" 
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Success/Info Alert */}
      {txStatus && (
        <div className="alert alert-info">
          <span className="alert-icon">ℹ️</span>
          <span>{txStatus}</span>
        </div>
      )}

      {/* Transaction Hash Alert */}
      {txHash && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          <span>
            Transaction Hash: 
            <a 
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-hash-link"
            >
              {txHash.substring(0, 20)}...
            </a>
          </span>
        </div>
      )}

      {/* Connect Wallet Section */}
      {!isConnected ? (
        <div className="card connect-card">
          <div className="card-content">
            <h2>💼 Connect Your Wallet</h2>
            <p className="card-description">
              Connect your MetaMask or Coinbase Wallet to start sending transactions
            </p>
            <button 
              className="btn btn-primary btn-large"
              onClick={connectWallet}
            >
              🔌 Connect Wallet
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Wallet Info Card */}
          <div className="card wallet-card">
            <div className="card-header">
              <h2>💼 Wallet Connected</h2>
              <span className="wallet-type">{walletType}</span>
            </div>
            
            <div className="wallet-info">
              <div className="info-row">
                <label>Wallet Address:</label>
                <div className="info-value-group">
                  <span className="info-value">{account}</span>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(account)}
                    title="Copy address"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div className="info-row">
                <label>Balance:</label>
                <span className="balance-value">{balance} ETH</span>
              </div>

              {chainInfo && (
                <div className="info-row">
                  <label>Network:</label>
                  <span className="network-value">
                    {chainInfo.name} (Chain ID: {chainInfo.chainId})
                  </span>
                </div>
              )}
            </div>

            <button 
              className="btn btn-danger"
              onClick={disconnectWallet}
            >
              🔓 Disconnect Wallet
            </button>
          </div>

          {/* Transaction Form Card */}
          <div className="card transaction-card">
            <h2>📤 Send ETH Transaction</h2>

            <div className="form-group">
              <label htmlFor="recipientAddress">Recipient Address:</label>
              <input
                id="recipientAddress"
                type="text"
                placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f42e4e"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                disabled={loading}
                className="form-input"
              />
              <small className="input-hint">Enter the Ethereum address to send ETH to</small>
            </div>

            <div className="form-group">
              <label htmlFor="amountETH">Amount (ETH):</label>
              <div className="amount-input-group">
                <input
                  id="amountETH"
                  type="number"
                  placeholder="0.01"
                  step="0.001"
                  min="0"
                  value={amountETH}
                  onChange={(e) => setAmountETH(e.target.value)}
                  disabled={loading}
                  className="form-input"
                />
                <span className="input-suffix">ETH</span>
              </div>
              <small className="input-hint">Available: {balance} ETH</small>
            </div>

            <button
              className={`btn btn-success btn-large ${loading ? 'loading' : ''}`}
              onClick={sendTransaction}
              disabled={loading}
            >
              {loading ? '⏳ Processing...' : '✉️ Send Transaction'}
            </button>

            <div className="form-warning">
              <strong>⚠️ Important:</strong> Always verify the recipient address before sending. Transactions cannot be reversed.
            </div>
          </div>

          {/* Transaction History Card */}
          {txHash && (
            <div className="card history-card">
              <h3>📋 Last Transaction</h3>
              <div className="tx-info">
                <p>
                  <strong>Transaction Hash:</strong>
                </p>
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-link"
                >
                  {txHash}
                </a>
                <small className="link-hint">Click to view on Etherscan</small>
              </div>
            </div>
          )}
        </>
      )}

      <footer className="footer">
        <p>Powered by ethers.js v6 | Built with React</p>
      </footer>
    </div>
  );
}
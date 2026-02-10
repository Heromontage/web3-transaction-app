import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Demo credentials (in real app, validate against backend)
  const DEMO_CREDENTIALS = {
    username: 'demo',
    password: 'demo123'
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (!username.trim()) {
        setError('❌ Please enter username');
        setLoading(false);
        return;
      }

      if (!password.trim()) {
        setError('❌ Please enter password');
        setLoading(false);
        return;
      }

      if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
        // Successful login
        localStorage.setItem('user', JSON.stringify({ username }));
        onLogin(username);
        setError('');
      } else {
        setError('❌ Invalid username or password');
      }

      setLoading(false);
    }, 1500);
  };

  const handleDemoLogin = () => {
    setUsername(DEMO_CREDENTIALS.username);
    setPassword(DEMO_CREDENTIALS.password);
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">🔐</div>
            <h1>Web3 Wallet</h1>
            <p className="login-subtitle">Send Ethereum Transactions Securely</p>
          </div>

          {error && (
            <div className="login-alert">
              <span>{error}</span>
              <button 
                className="alert-close"
                onClick={() => setError('')}
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            {/* Username Input */}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="input-field"
                  autoComplete="username"
                />
              </div>
              <small className="input-help">Demo: use 'demo'</small>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔑</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="input-field"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <small className="input-help">Demo: use 'demo123'</small>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <a href="#!" className="forgot-password">Forgot password?</a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className={`login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  🚀 Login
                </>
              )}
            </button>

            {/* Demo Button */}
            <button
              type="button"
              className="demo-button"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              Try Demo
            </button>
          </form>

          {/* Signup Link */}
          <div className="login-footer">
            <p>Don't have an account? <a href="#!">Sign up</a></p>
            <p className="terms">
              By logging in, you agree to our 
              <a href="#!"> Terms of Service</a> and 
              <a href="#!"> Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2>Why Choose Web3 Wallet?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Easy Transactions</h3>
              <p>Send ETH with just a few clicks</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure</h3>
              <p>Your keys, your coins. Always safe.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast</h3>
              <p>Real-time transaction updates</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Multi-Network</h3>
              <p>Support for all EVM chains</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
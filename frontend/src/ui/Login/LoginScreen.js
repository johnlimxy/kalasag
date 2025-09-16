import React, { useState } from 'react';
import './LoginScreen.css';
import Dashboard from '../Dashboard/Dashboard';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const [profile, setProfile] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();

    // ---- Admin (regular user) ----
    if (username === 'admin' && password === 'admin') {
      setProfile({
        name: 'Ellena Reyes',
        role: 'user',
        carouselItems: [
          { title: 'Money tracker', subtitle: "It's time to track & plan your cash flow today." },
          { title: 'Spending Summary', subtitle: 'Your spending in July was ₱45,000.' },
          { title: 'Goals', subtitle: 'You’re 60% towards your emergency fund.' },
        ],
        accounts: [
          { type: 'Savings Account', number: '0576 9017 82', balance: '₱12,345.67' },
          { type: 'Savings Account', number: '9809 2404 33', balance: '₱8,210.50' },
          { type: 'Savings Account', number: '1234 5678 90', balance: '₱4,980.00' },
        ],
      });
      setIsLoggedIn(true);
      setError(false);
      return;
    }

    // ---- Guardian (will see bell badge + notification modal) ----
    if (username === 'guardian' && password === 'guardian123') {
      setProfile({
        name: 'Marco Reyes',
        role: 'guardian',
        seniorName: 'Elena Reyes',
        carouselItems: [
          { title: 'Guardian mode', subtitle: 'We’ll notify you if we spot anything risky.' },
          { title: 'Family safety', subtitle: 'Your senior’s account is protected by Kalasag.' },
        ],
        accounts: [
          { type: 'Savings Account', number: '3021 9988 10', balance: '₱21,500.00' },
        ],
      });
      setIsLoggedIn(true);
      setError(false);
      return;
    }

    setError(true);
  };

  if (isLoggedIn) {
    return <Dashboard profile={profile} />;
  }

  return (
    <div className="login-container">
      {error && <div className="error-banner">Invalid credentials. Please try again.</div>}

      <div className="logo-container">
        <h2>BPI</h2>
      </div>

      <form className="form-container" onSubmit={handleLogin}>
        <input
          type="text"
          className="input-field"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit" className="login-button">
          Log in
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;

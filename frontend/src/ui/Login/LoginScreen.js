import React, { useState } from 'react';
import './LoginScreen.css';
import Dashboard from '../Dashboard/Dashboard';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // hardcoded credentials
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return (
    <div className="login-container">
      {error && (
        <div className="error-banner">
          Invalid credentials. Please try again.
        </div>
      )}

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
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="login-button">
          Log in
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
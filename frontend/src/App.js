// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import LoginScreen from './ui/Login/LoginScreen';
import Dashboard from './ui/Dashboard/Dashboard';

function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('authed') === '1');

  // Allow LoginScreen to signal success via a window event if it doesn't use props
  useEffect(() => {
    const onLoginSuccess = () => {
      setAuthed(true);
      localStorage.setItem('authed', '1');
    };
    window.addEventListener('login-success', onLoginSuccess);
    return () => window.removeEventListener('login-success', onLoginSuccess);
  }, []);

  const handleLogin = () => {
    setAuthed(true);
    localStorage.setItem('authed', '1');
  };

  const handleLogout = () => {
    setAuthed(false);
    localStorage.removeItem('authed');
  };

  // If not authenticated, show Login; otherwise, show Dashboard
  if (!authed) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Dashboard already has its own logout button/flow, but we still expose a prop if you want to use it later
  return <Dashboard onLogout={handleLogout} />;
}

export default App;

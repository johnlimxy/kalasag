// src/screens/login/loginScreen.js
import React from 'react';
// CORRECTED PATH: Go up two directories to find App.css
import '../../App.css';

const LoginScreen = ({ onLogin }) => {
  return (
    <div className="screen-container">
      <h1 className="title">BPI Replica</h1>
      <input className="input" type="text" placeholder="Username" />
      <input className="input" type="password" placeholder="Password" />
      <button className="button primary-button" onClick={onLogin}>
        Login
      </button>
    </div>
  );
};

export default LoginScreen;

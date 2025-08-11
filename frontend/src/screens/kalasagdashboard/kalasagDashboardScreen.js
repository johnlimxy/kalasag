// src/screens/KalasagDashboardScreen.js
import React from 'react';
import '../../App.css';

const KalasagDashboardScreen = () => {
  return (
    <div className="screen-container kalasag-bg">
      <h1 className="title kalasag-title">Kalasag Dashboard</h1>
      <div className="balance-container">
        <p className="balance-label">Your Money:</p>
        <p className="balance-amount">₱15,500.00</p>
      </div>
      <div className="tile-grid">
        <div className="tile">Check Balance</div>
        <div className="tile">Pay with QR</div>
        <div className="tile">Send Money</div>
        <div className="tile">Pay Bills</div>
        <div className="tile">Guardians</div>
        <div className="tile">Help / Tulong</div>
      </div>
    </div>
  );
};

export default KalasagDashboardScreen;

// src/screens/BpiDashboardScreen.js
import React, { useState } from 'react';
import '../../App.css';

const BpiDashboardScreen = ({ onActivateKalasag }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleActivateClick = () => {
    setModalVisible(false);
    onActivateKalasag();
  };

  return (
    <div className="screen-container">
      {/* This is the modal for Kalasag Activation */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Activate BPI Kalasag?</h2>
            <p className="modal-body">
              Experience a simpler and safer way to bank, designed for your
              peace of mind.
            </p>
            <button
              className="button primary-button"
              onClick={handleActivateClick}
            >
              Activate Now
            </button>
            <button
              className="button secondary-button"
              onClick={() => setModalVisible(false)}
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      <h1 className="title">BPI Dashboard</h1>
      <p className="body-text">[Your accounts would be listed here]</p>

      {/* This is the banner to trigger the modal */}
      <div className="banner" onClick={() => setModalVisible(true)}>
        <h3 className="banner-title">Activate Kalasag Mode</h3>
        <p className="banner-text">
          A simpler, safer way to bank. Tap to learn more.
        </p>
      </div>
    </div>
  );
};

export default BpiDashboardScreen;

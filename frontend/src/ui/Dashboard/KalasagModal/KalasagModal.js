// src/ui/Dashboard/KalasagModal/KalasagModal.js
import React from 'react';
import './KalasagModal.css';

const KalasagModal = ({ isOpen, onActivate, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-icon">🛡️</div>
        <h2>Activate BPI Kalasag?</h2>
        <p>Experience a simpler and safer way to bank, designed for your peace of mind.</p>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onActivate}>
            Activate Now
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default KalasagModal;
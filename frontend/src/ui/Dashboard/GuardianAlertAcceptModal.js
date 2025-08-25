import React from 'react';
import './GuardianAlertAcceptModal.css';

const GuardianAlertAcceptModal = ({ senior = 'Elena Reyes', onClose = () => {} }) => {
  return (
    <div className="gaa-backdrop" role="dialog" aria-modal="true">
      <div className="gaa-modal card">
        <div className="gaa-icon" aria-hidden>🛡️✅</div>
        <h2 className="gaa-title">Thanks for Responding</h2>
        <p className="gaa-text">
          Please call <strong>{senior}</strong> now to confirm. We’ll keep monitoring her account
          for unusual activity.
        </p>
        <button className="gaa-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default GuardianAlertAcceptModal;

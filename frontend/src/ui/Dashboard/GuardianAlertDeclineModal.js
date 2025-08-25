import React from 'react';
import './GuardianAlertDeclineModal.css';

const GuardianAlertDeclineModal = ({ senior = 'Elena Reyes', onClose = () => {} }) => {
  return (
    <div className="gad-backdrop" role="dialog" aria-modal="true">
      <div className="gad-modal card">
        <div className="gad-icon" aria-hidden>ℹ️</div>
        <h2 className="gad-title">Alert Dismissed</h2>
        <p className="gad-text">
          We’ll keep this alert in your inbox. If you change your mind, you can always contact
          <strong> {senior}</strong> or review the alert again later.
        </p>
        <button className="gad-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default GuardianAlertDeclineModal;

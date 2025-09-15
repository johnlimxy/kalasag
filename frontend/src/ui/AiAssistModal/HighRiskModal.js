import React, { useEffect, useCallback } from 'react';
import './HighRiskModal.css';

/**
 * Screen 4.3 – High Risk Modal
 *
 * Props:
 *  - onCancel: () => void   // Navigate back to Kalasag Dashboard
 *  - onProceed: () => void  // Proceed with the transaction
 */
const HighRiskModal = ({ onCancel = () => {}, onProceed = () => {} }) => {
  // Close with ESC
  const onKey = useCallback((e) => {
    if (e.key === 'Escape') onCancel();
  }, [onCancel]);

  useEffect(() => {
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onKey]);

  return (
    <div className="hrm-backdrop" role="dialog" aria-modal="true" aria-labelledby="hrm-title">
      <div className="hrm-container">
        <div className="hrm-icon" aria-hidden>⚠️</div>
        <h2 id="hrm-title" className="hrm-title">For Your Safety</h2>
        <p className="hrm-text">
          This is a suspicious activity flagged by our system. 
          Your Guardian has already been alerted. Would you like to proceed with the transaction?
        </p>

        <div className="hrm-btn-group">
          <button className="hrm-btn-cancel" onClick={onCancel}>
            Cancel Transaction
          </button>
          <button className="hrm-btn-proceed" onClick={onCancel}>
            Proceed with Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighRiskModal;

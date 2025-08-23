import React, { useEffect, useCallback } from 'react';
import './HighRiskModal.css';

/**
 * Screen 4.3 – High Risk Modal
 *
 * Props:
 *  - onCancel: () => void   // Navigate back to Kalasag Dashboard
 */
const HighRiskModal = ({ onCancel = () => {} }) => {
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
          This transaction seems unusual. We have paused it and alerted your Guardian.
          Please talk to them before proceeding.
        </p>

        <button className="hrm-btn-cancel" onClick={onCancel}>
          Cancel Transaction
        </button>
      </div>
    </div>
  );
};

export default HighRiskModal;

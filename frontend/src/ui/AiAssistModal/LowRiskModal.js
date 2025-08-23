import React, { useEffect, useCallback } from 'react';
import './LowRiskModal.css';

/**
 * Screen 4.4 – Low Risk / Success Modal
 *
 * Props:
 *  - onDone: () => void     // Navigate back to Kalasag Dashboard
 */
const LowRiskModal = ({ onDone = () => {} }) => {
  // Close with ESC
  const onKey = useCallback((e) => {
    if (e.key === 'Escape') onDone();
  }, [onDone]);

  useEffect(() => {
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onKey]);

  return (
    <div className="lrm-backdrop" role="dialog" aria-modal="true" aria-labelledby="lrm-title">
      <div className="lrm-container">
        <div className="lrm-icon" aria-hidden>✅</div>
        <h2 id="lrm-title" className="lrm-title">Payment Successful!</h2>
        <p className="lrm-text">
          Your transaction was completed successfully.
        </p>

        <button className="lrm-btn-done" onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  );
};

export default LowRiskModal;

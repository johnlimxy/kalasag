import React, { useEffect, useCallback } from 'react';
import './InviteModal.css';

/**
 * Screen 5.2 – Invitation Sent (Modal)
 *
 * Props:
 *  - name: string
 *  - mobile: string
 *  - onDone: () => void
 */
const InviteModal = ({ name, mobile, onDone = () => {} }) => {
  // Close on ESC key
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onDone();
  }, [onDone]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <div
      className="im-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={onDone}                 // click outside closes
    >
      <div
        className="im-modal card"
        onClick={(e) => e.stopPropagation()} // prevent backdrop close when clicking inside
      >
        <div className="im-icon" aria-hidden>✅</div>
        <h2 className="im-title">Invitation Sent!</h2>

        <div className="im-body">
          <p>
            We sent an invite to <strong>{name}</strong> ({mobile}).
          </p>
          <p className="im-note">
            Please visit any <strong>BPI branch</strong> with your nominated guardian
            to complete the secure verification process.
          </p>
        </div>

        <button className="btn-primary im-btn" onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  );
};

export default InviteModal;

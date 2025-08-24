import React from 'react';
import './GuardianInvitationAccepted.css';

/**
 * Screen 6.2 — Invitation Accepted Screen
 *
 * Props:
 *  - seniorName: string
 *  - onDone: () => void       // back to guardian dashboard
 */
const GuardianInvitationAccepted = ({ seniorName = 'Elena Reyes', onDone }) => {
  return (
    <div className="g2-page">
      <div className="g2-wrap">
        <section className="g2-card card">
          <div className="g2-icon" aria-hidden>🛡️✅</div>
          <h1 className="g2-title">You’ve Accepted!</h1>

          <p className="g2-body">
            Thank you for helping to protect your loved one. The final step is to complete the
            secure verification. Please visit any <strong>BPI branch</strong> with
            {' '}<strong>{seniorName}</strong> and present your valid IDs to a bank officer to
            activate the Kalasag link.
          </p>

          <button className="btn-green g2-btn" onClick={onDone}>Done</button>
        </section>
      </div>
    </div>
  );
};

export default GuardianInvitationAccepted;

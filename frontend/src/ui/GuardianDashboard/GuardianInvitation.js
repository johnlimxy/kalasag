import React from 'react';
import './GuardianInvitation.css';

/**
 * Screen 6.1 — Guardian Invitation Screen (guardian's view)
 *
 * Props:
 *  - seniorName: string
 *  - onAccept: () => void          // -> 6.2
 *  - onDecline: () => void         // backend call + return to guardian dashboard
 *  - onBack?: () => void
 */
const GuardianInvitation = ({
  seniorName = 'Elena Reyes',
  onAccept,
  onDecline,
  onBack
}) => {
  return (
    <div className="g1-page">
      <div className="g1-wrap">

        <header className="g1-header card">
          <div className="g1-header-left">
            {onBack && (
              <button className="g1-back" onClick={onBack} aria-label="Back">←</button>
            )}
            <h1>Trusted Guardian Invitation</h1>
          </div>
        </header>

        <section className="g1-card card">
          <div className="g1-row">
            <div className="g1-avatar" aria-hidden>🛡️</div>
            <div className="g1-text">
              <div className="g1-title">
                {seniorName} has invited you to be their Trusted Guardian.
              </div>
              <div className="g1-sub">
                Please review your role before accepting.
              </div>
            </div>
          </div>

          <div className="g1-split">
            <div className="g1-col">
              <div className="g1-h2">What you <span className="can">CAN</span> do</div>
              <ul className="g1-list">
                <li>Receive alerts for unusual transactions.</li>
                <li>Help them recover their account securely at a branch.</li>
              </ul>
            </div>
            <div className="g1-col">
              <div className="g1-h2">What you <span className="cant">CAN'T</span> do</div>
              <ul className="g1-list">
                <li>Access or view their account balance.</li>
                <li>Make transactions on their behalf.</li>
                <li>See their spending history.</li>
              </ul>
            </div>
          </div>

          <div className="g1-actions">
            <button className="btn-gray" onClick={onDecline}>Decline</button>
            <button className="btn-green" onClick={onAccept}>Accept</button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default GuardianInvitation;

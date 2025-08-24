import React from 'react';
import './GuardianInviteNotice.css';

/**
 * Screen 6.0 — Guardian Receives Invitation (in-app notification mock)
 *
 * Props:
 *  - seniorName: string                      // e.g., "Elena Reyes"
 *  - onReview: () => void                    // go to Screen 6.1
 *  - onClose?: () => void                    // close this notice (optional)
 *
 * Usage: show as a small modal/center card or inline in a notifications panel.
 */
const GuardianInviteNotice = ({ seniorName = 'Elena Reyes', onReview, onClose }) => {
  return (
    <div className="g0-backdrop" role="dialog" aria-modal="true">
      <div className="g0-card card">
        <header className="g0-header">
          <h2>Notifications</h2>
          {onClose && (
            <button className="g0-close" onClick={onClose} aria-label="Close">✕</button>
          )}
        </header>

        <section className="g0-item">
          <div className="g0-dot" aria-hidden />
          <div className="g0-body">
            <div className="g0-title">
              {seniorName} has invited you to be their Trusted Guardian. Tap to review.
            </div>
            <button className="btn-primary g0-action" onClick={onReview}>
              Review Invitation
            </button>
          </div>
        </section>

        <section className="g0-sms">
          <div className="g0-sms-title">SMS copy (for reference):</div>
          <p className="g0-sms-text">
            <strong>BPI Alert:</strong> {seniorName} has invited you to be their BPI Kalasag
            Trusted Guardian. Please log in to your BPI app to review and accept the request.
          </p>
        </section>
      </div>
    </div>
  );
};

export default GuardianInviteNotice;

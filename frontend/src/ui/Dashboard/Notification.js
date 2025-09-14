import React, { useState } from 'react';
import './Notification.css';
import GuardianAlertAcceptModal from './GuardianAlertAcceptModal';
import GuardianAlertDeclineModal from './GuardianAlertDeclineModal';

/**
 * Guardian Alert (Screen 6.3) – in-app modal version
 * Props:
 *  - onClose:   () => void
 *  - onAccept?: () => void
 *  - onDecline?: () => void
 *  - alert: { senior: string, amount: string, reason: string }
 */
const Notification = ({
  onClose = () => {},
  onAccept = () => {},
  onDecline = () => {},
  alert,
}) => {
  const senior = alert?.senior || 'Elena Reyes';
  const amount = alert?.amount || '₱6,000.00';
  const reason = alert?.reason || 'to a new recipient';

  // null | 'accept' | 'decline'
  const [followup, setFollowup] = useState(null);

  const openAccept = () => {
    setFollowup('accept');
    onAccept?.();
  };

  const openDecline = () => {
    setFollowup('decline');
    onDecline?.();
  };

  return (
    <>
      <div className="notif-backdrop" role="dialog" aria-modal="true">
        <div className="notif-modal card">
          <div className="notif-header">
            <div className="notif-title">
              <span className="notif-badge">Kalasag</span> Alert
            </div>
            <button className="notif-close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>

          <div className="notif-icon" aria-hidden>📣</div>

          <div className="notif-body">
            <p className="notif-lead">
              <strong>BPI Kalasag Alert for {senior}:</strong>
            </p>
            <p>
              A transaction of <strong>{amount}</strong> {reason} was just attempted.
            </p>
            <p className="notif-cta">
              Please call them now to confirm if this is legitimate. If you believe this is fraud,
              advise them to cancel the transaction in the app immediately.
            </p>
          </div>

          <div className="notif-actions">
            <button className="btn-decline" id="declineguardian" onClick={openDecline}>Decline</button>
            <button className="btn-accept" id="acceptguardian" onClick={openAccept}>Accept</button>
          </div>
        </div>
      </div>

      {/* Follow-up modals */}
      {followup === 'accept' && (
        <GuardianAlertAcceptModal
          senior={senior}
          onClose={() => setFollowup(null)}
        />
      )}
      {followup === 'decline' && (
        <GuardianAlertDeclineModal
          senior={senior}
          onClose={() => setFollowup(null)}
        />
      )}
    </>
  );
};

export default Notification;

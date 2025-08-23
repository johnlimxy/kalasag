import React, { useState } from 'react';
import './GuardianDashboard.css';
import GuardianInvite from './GuardianInvite';

/**
 * Guardian Management (Screen 5.0)
 * Local router: mode = 'home' | 'invite'
 */
const GuardianDashboard = ({
  initialGuardian = null,
  onBack, // optional, to return to Kalasag Mode
}) => {
  const [mode, setMode] = useState('home'); // 'home' | 'invite'
  const [guardian, setGuardian] = useState(initialGuardian);

  const openInvite = () => setMode('invite');
  const closeInvite = () => setMode('home');

  const removeGuardian = () => {
    if (window.confirm('Remove this guardian?')) setGuardian(null);
  };

  // Called by GuardianInvite after "Invitation Sent" → Done
  const handleInviteSent = ({ name, mobile }) => {
    setGuardian({ name, mobile, status: 'Invited' });
    setMode('home');
  };

  if (mode === 'invite') {
    return (
      <GuardianInvite
        onBack={closeInvite}
        onSent={handleInviteSent}
      />
    );
  }

  // mode === 'home'
  return (
    <div className="gd-page">
      <div className="gd-wrap">
        {/* Header */}
        <header className="gd-header card">
          <div className="gd-header-left">
            {onBack && (
              <button
                className="gd-back"
                aria-label="Back"
                onClick={onBack}
                title="Back"
              >
                ←
              </button>
            )}
            <h1>Your Trusted Guardians</h1>
          </div>
          <div className="gd-header-right" />
        </header>

        {/* Status card */}
        <section className="gd-card card" aria-label="Guardian status">
          {guardian ? (
            <>
              <div className="gd-row">
                <div className="gd-avatar" aria-hidden>🛡️</div>
                <div className="gd-info">
                  <div className="gd-name">{guardian.name}</div>
                  <div className={`gd-badge ${guardian.status === 'Active' ? 'active' : ''}`}>
                    {guardian.status || 'Active'}
                  </div>
                </div>
              </div>

              <div className="gd-note">
                Your guardian can help verify transactions and keep your account safe.
              </div>

              <div className="gd-actions">
                <button className="btn-danger-outline" onClick={removeGuardian}>
                  Remove Guardian
                </button>
              </div>
            </>
          ) : (
            <div className="gd-empty">
              <div className="gd-empty-icon">🛡️</div>
              <div className="gd-empty-title">You have not added a guardian yet.</div>
              <div className="gd-empty-text">
                Invite someone you trust to help secure your account and assist with
                high‑risk actions.
              </div>
              <button className="btn-primary" onClick={openInvite}>
                Invite a New Guardian
              </button>
            </div>
          )}
        </section>

        {/* Extra CTA if a guardian already exists */}
        {guardian && (
          <section className="gd-cta card">
            <div className="gd-cta-text">Need another trusted contact?</div>
            <button className="btn-primary" onClick={openInvite}>
              Invite a New Guardian
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default GuardianDashboard;

// src/ui/GuardianDashboard/GuardianDashboard.js
import React, { useState } from 'react';
import './GuardianDashboard.css';
import GuardianInvite from './GuardianInvite';

// ===== Guardian Experience – Flow 6 (Guardian side) =====
// 6.0: GuardianInviteNotice
// 6.1: GuardianInvitation
// 6.2: GuardianInvitationAccepted
import GuardianInviteNotice from './GuardianInviteNotice';
import GuardianInvitation from './GuardianInvitation';
import GuardianInvitationAccepted from './GuardianInvitationAccepted';

/**
 * Guardian Management (Screen 5.0)
 * Local router:
 *   - mode: 'home' | 'invite' (existing 5.x functionality)
 *   - flow: null | 'notice' | 'invitation' | 'accepted'  (6.0 → 6.1 → 6.2)
 *
 * NOTE: Other, existing functionality remains unchanged.
 */
const GuardianDashboard = ({
  initialGuardian = null,
  onBack,                  // optional, return to previous screen (e.g., Kalasag Mode)
  seniorName = 'Elena Reyes', // who invited the guardian (demo default)
}) => {
  // --------- Existing 5.x state ---------
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

  // --------- NEW: Flow 6 local router & bell indicator ---------
  const [flow, setFlow] = useState(null);           // 'notice' | 'invitation' | 'accepted'
  const [hasInviteNotice, setHasInviteNotice] = useState(true); // red dot on bell

  // ======================= FLOW 6 ROUTES =======================
  // Screen 6.0 — Guardian Receives Invitation (in-app notice)
  if (flow === 'notice') {
    return (
      <GuardianInviteNotice
        seniorName={seniorName}
        onReview={() => setFlow('invitation')} // -> Screen 6.1
        onClose={() => setFlow(null)}          // back to dashboard
      />
    );
  }

  // Screen 6.1 — Guardian Invitation Screen (review Accept/Decline)
  if (flow === 'invitation') {
    return (
      <GuardianInvitation
        seniorName={seniorName}
        onAccept={() => {
          setFlow('accepted');       // -> Screen 6.2
          setHasInviteNotice(false); // clear bell dot
        }}
        onDecline={() => {
          // In real app, call decline API
          setHasInviteNotice(false); // clear bell dot
          setFlow(null);             // back to dashboard
        }}
        onBack={() => setFlow('notice')} // back to 6.0
      />
    );
  }

  // Screen 6.2 — Invitation Accepted Screen (instructions)
  if (flow === 'accepted') {
    return (
      <GuardianInvitationAccepted
        seniorName={seniorName}
        onDone={() => setFlow(null)} // back to Guardian Dashboard
      />
    );
  }
  // ===================== END FLOW 6 ROUTES =====================

  // --------- Existing 5.x routes ---------
  if (mode === 'invite') {
    return (
      <GuardianInvite
        onBack={closeInvite}
        onSent={handleInviteSent}
      />
    );
  }

  // --------- Screen 5.0 (home) ---------
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

          {/* NEW: Notification bell for Flow 6 (shows 6.0 when tapped) */}
          <div className="gd-header-right">
            <button
              className="gd-bell"
              aria-label="Notifications"
              title="Notifications"
              onClick={() => setFlow('notice')}
            >
              🔔
              {hasInviteNotice && <span className="gd-badge-dot" />}
            </button>
          </div>
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
                high-risk actions.
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

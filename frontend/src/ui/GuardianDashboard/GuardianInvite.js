import React, { useState } from 'react';
import './GuardianInvite.css';
import InviteModal from './InviteModal';

/**
 * Screen 5.1 – Guardian Invitation
 *
 * Props:
 *  - onBack?: () => void
 *  - onSent?: ({ name, mobile }) => void
 */
const GuardianInvite = ({ onBack, onSent = () => {} }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState({ name: '', mobile: '' });

  // Show confirmation modal after a valid submit
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const e = { name: '', mobile: '' };

    if (!name.trim() || name.trim().length < 2) {
      e.name = 'Please enter the guardian’s full name.';
    }

    const ok = /^09\d{9}$/.test(mobile.trim());
    if (!ok) e.mobile = 'Enter a valid PH mobile number (e.g., 09XXXXXXXXX).';

    setErrors(e);
    return !e.name && !e.mobile;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    // Show 5.2 modal first; only after "Done" we notify parent & navigate back.
    setShowConfirm(true);
  };

  const canSend = name.trim().length >= 2 && /^09\d{9}$/.test(mobile.trim());

  return (
    <div className="gi-page">
      <div className="gi-wrap">
        {/* Header */}
        <header className="gi-header card">
          <div className="gi-header-left">
            {onBack && (
              <button className="gi-back" aria-label="Back" onClick={onBack}>
                ←
              </button>
            )}
            <h1>Invite a Guardian</h1>
          </div>
          <div />
        </header>

        {/* Form Card */}
        <section className="gi-card card">
          <form className="gi-form" onSubmit={handleSubmit} noValidate>
            <label className="gi-label" htmlFor="gi-name">
              Guardian’s Full Name
            </label>
            <input
              id="gi-name"
              className={`gi-input ${errors.name ? 'has-error' : ''}`}
              type="text"
              placeholder="e.g., Maria Santos"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <div className="gi-error">{errors.name}</div>}

            <label className="gi-label" htmlFor="gi-mobile">
              Guardian’s Mobile Number
            </label>
            <input
              id="gi-mobile"
              className={`gi-input ${errors.mobile ? 'has-error' : ''}`}
              type="tel"
              inputMode="numeric"
              placeholder="09XXXXXXXXX"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <div className="gi-hint">
              We’ll send an SMS invite to this number to become your Trusted Guardian.
            </div>
            {errors.mobile && <div className="gi-error">{errors.mobile}</div>}

            <div className="gi-actions">
              {onBack && (
                <button type="button" className="btn-secondary" onClick={onBack}>
                  Cancel
                </button>
              )}
              <button type="submit" className="btn-primary" disabled={!canSend}>
                Send Invite
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Screen 5.2 – Invitation Sent (Modal) */}
      {showConfirm && (
        <InviteModal
          name={name.trim()}
          mobile={mobile.trim()}
          onDone={() => {
            // 1) Close modal now
            setShowConfirm(false);
            // 2) Navigate back first so UI updates immediately
            onBack?.();
            // 3) Notify parent on next tick (so alerts/toasts won't block close)
            const payload = { name: name.trim(), mobile: mobile.trim() };
            setTimeout(() => onSent(payload), 0);
          }}
        />
      )}
    </div>
  );
};

export default GuardianInvite;

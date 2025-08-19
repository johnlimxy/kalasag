import React from 'react';
import './TransConfirm.css';

// Simple peso formatter
const peso = (v) =>
  Number(v || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * Transaction Confirmation (Screen 4.2)
 *
 * Props:
 *  - tx?: { to: string, amount: number, from?: string }
 *  - to?: string
 *  - amount?: number
 *  - from?: string
 *  - onCancel: () => void
 *  - onConfirm: (payload: { to, amount, from }) => Promise<void> | void
 */
const TransConfirm = ({
  tx,
  to,
  amount,
  from = 'Savings Account ••9017',
  onCancel,
  onConfirm,
}) => {
  // allow either tx or individual props
  const payload = tx || { to, amount, from };

  return (
    <div className="tc-page">
      <div className="tc-wrap">
        {/* Header */}
        <header className="tc-header card">
          <h1>Confirm Payment</h1>
          <button
            className="tc-close"
            onClick={onCancel}
            aria-label="Cancel and go back"
          >
            ✕
          </button>
        </header>

        {/* Summary Card */}
        <section className="tc-card card" aria-label="Transaction summary">
          <div className="tc-row">
            <div className="tc-label">To</div>
            <div className="tc-value">{payload.to || '—'}</div>
          </div>

          <div className="tc-row">
            <div className="tc-label">From</div>
            <div className="tc-value">{payload.from || from}</div>
          </div>

          <div className="tc-row amount">
            <div className="tc-label">Amount</div>
            <div className="tc-value tc-amount">₱{peso(payload.amount)}</div>
          </div>

          <div className="tc-note">
            Please review the details before continuing. You won’t be able to
            cancel once submitted.
          </div>

          <div className="tc-actions">
            <button className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button
              className="btn-success"
              onClick={() =>
                onConfirm?.({
                  to: payload.to,
                  amount: payload.amount,
                  from: payload.from || from,
                })
              }
            >
              Confirm and Pay
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TransConfirm;

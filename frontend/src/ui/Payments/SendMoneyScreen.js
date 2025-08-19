import React, { useState } from 'react';
import './SendMoneyScreen.css';

const pesoFmt = (v) =>
  Number(v || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

const SendMoneyScreen = ({ onNext, onCancel }) => {
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({ mobile: '', amount: '' });

  const validate = () => {
    const e = { mobile: '', amount: '' };

    // Basic PH mobile validation: 09XXXXXXXXX
    const mobileOk = /^09\d{9}$/.test(mobile.trim());
    if (!mobileOk) e.mobile = 'Enter a valid PH mobile number (e.g., 09XXXXXXXXX).';

    const n = Number(amount);
    if (!amount || isNaN(n) || n <= 0) e.amount = 'Enter a valid amount greater than ₱0.00.';

    setErrors(e);
    return !e.mobile && !e.amount;
  };

  const handleNext = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onNext?.({ mobile: mobile.trim(), amount: Number(amount) });
  };

  const handleAmountBlur = () => {
    const n = Number(amount);
    if (!isNaN(n) && n > 0) setAmount(n.toFixed(2));
  };

  const addQuickAmount = (v) => {
    const n = Number(amount || 0) + v;
    setAmount(String(n));
  };

  const formValid = () => {
    const n = Number(amount);
    return /^09\d{9}$/.test(mobile.trim()) && !isNaN(n) && n > 0;
  };

  return (
    <div className="sm-page">
      <div className="sm-wrap">
        {/* Header */}
        <header className="sm-header card">
          <h1>Send Money</h1>
          {onCancel && (
            <button className="sm-cancel" onClick={onCancel} aria-label="Close">
              ✕
            </button>
          )}
        </header>

        {/* Form */}
        <section className="sm-card card">
          <form className="sm-form" onSubmit={handleNext} noValidate>
            <label className="sm-label" htmlFor="sm-mobile">
              Recipient’s Mobile Number
            </label>
            <input
              id="sm-mobile"
              className={`sm-input ${errors.mobile ? 'has-error' : ''}`}
              type="tel"
              inputMode="numeric"
              placeholder="09XXXXXXXXX"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <div className="sm-hint">We’ll send money to this number via InstaPay.</div>
            {errors.mobile && <div className="sm-error">{errors.mobile}</div>}

            <div className="sm-row">
              <label className="sm-label" htmlFor="sm-amount">
                Amount (PHP)
              </label>
              <div className="sm-amount-group">
                <span className="peso">₱</span>
                <input
                  id="sm-amount"
                  className={`sm-input amount ${errors.amount ? 'has-error' : ''}`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onBlur={handleAmountBlur}
                />
              </div>
            </div>

            {/* Quick amount chips */}
            <div className="sm-chips">
              {QUICK_AMOUNTS.map((v) => (
                <button
                  type="button"
                  key={v}
                  className="sm-chip"
                  onClick={() => addQuickAmount(v)}
                  aria-label={`Add ₱${v}`}
                >
                  + {pesoFmt(v)}
                </button>
              ))}
            </div>

            <div className="sm-hint">No fees for mock flow.</div>
            {errors.amount && <div className="sm-error">{errors.amount}</div>}

            <button className="btn-primary sm-submit" type="submit" disabled={!formValid()}>
              Next
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default SendMoneyScreen;

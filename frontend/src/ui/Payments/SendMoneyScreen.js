// src/ui/Payments/SendMoneyScreen.js
import React, { useState } from 'react';
import './SendMoneyScreen.css';
import HighRiskModal from '../AiAssistModal/HighRiskModal';
import LowRiskModal from '../AiAssistModal/LowRiskModal';

const pesoFmt = (v) =>
  Number(v || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

const SendMoneyScreen = ({ onNext, onCancel }) => {
  const [accName, setAccName] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({
    accName: '',
    accNumber: '',
    mobile: '',
    amount: '',
  });

  // null | 'high' | 'low'
  const [risk, setRisk] = useState(null);

  const validate = () => {
    const e = { accName: '', accNumber: '', mobile: '', amount: '' };

    // Account name: basic sanity (at least 2 non-space chars)
    if (!accName.trim() || accName.trim().length < 2) {
      e.accName = 'Please enter a valid account name.';
    }

    // Account number: allow digits with dashes/spaces, validate 10–16 digits
    const digitsOnly = accNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 16) {
      e.accNumber =
        'Enter a valid account number (10–16 digits; dashes/spaces allowed).';
    }

    // PH mobile: 09XXXXXXXXX
    const mobileOk = /^09\d{9}$/.test(mobile.trim());
    if (!mobileOk) e.mobile = 'Enter a valid PH mobile number (e.g., 09XXXXXXXXX).';

    // Amount > 0
    const n = Number(amount);
    if (!amount || isNaN(n) || n <= 0) e.amount = 'Enter a valid amount greater than ₱0.00.';

    setErrors(e);
    return !e.accName && !e.accNumber && !e.mobile && !e.amount;
  };

  const handleNext = (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const n = Number(amount);
    // Decide which modal to show
    if (n >= 5000) {
      setRisk('high');
    } else {
      setRisk('low');
    }

    // Bubble up payload if parent wants it (logging, etc.)
    onNext?.({
      accName: accName.trim(),
      accNumber: accNumber.replace(/\D/g, ''),
      mobile: mobile.trim(),
      amount: n,
    });
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
    const digitsOnly = accNumber.replace(/\D/g, '');
    const n = Number(amount);
    return (
      accName.trim().length >= 2 &&
      digitsOnly.length >= 10 &&
      digitsOnly.length <= 16 &&
      /^09\d{9}$/.test(mobile.trim()) &&
      !isNaN(n) &&
      n > 0
    );
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
            {/* Account Name */}
            <label className="sm-label" htmlFor="sm-acc-name">
              Account Name
            </label>
            <input
              id="sm-acc-name"
              className={`sm-input ${errors.accName ? 'has-error' : ''}`}
              type="text"
              placeholder="e.g., Juan Dela Cruz"
              value={accName}
              onChange={(e) => setAccName(e.target.value)}
            />
            {errors.accName && <div className="sm-error">{errors.accName}</div>}

            {/* Account Number */}
            <label className="sm-label" htmlFor="sm-acc-number">
              Account Number
            </label>
            <input
              id="sm-acc-number"
              className={`sm-input ${errors.accNumber ? 'has-error' : ''}`}
              type="text"
              inputMode="numeric"
              placeholder="Enter 10–16 digit account number"
              value={accNumber}
              onChange={(e) => setAccNumber(e.target.value)}
            />
            {errors.accNumber && <div className="sm-error">{errors.accNumber}</div>}

            {/* Recipient Mobile */}
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
           
            {errors.mobile && <div className="sm-error">{errors.mobile}</div>}

            {/* Amount */}
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

            
            {errors.amount && <div className="sm-error">{errors.amount}</div>}

            <button className="btn-primary sm-submit" type="submit" disabled={!formValid()}>
              Next
            </button>
          </form>
        </section>
      </div>

      {/* Risk Modals */}
      {risk === 'high' && (
        <HighRiskModal
          onCancel={() => {
            setRisk(null);
            onCancel?.(); // Back to Kalasag Dashboard (Screen 3.0)
          }}
        />
      )}

      {risk === 'low' && (
        <LowRiskModal
          onDone={() => {
            setRisk(null);
            onCancel?.(); // Back to Kalasag Dashboard (Screen 3.0)
          }}
        />
      )}
    </div>
  );
};

export default SendMoneyScreen;

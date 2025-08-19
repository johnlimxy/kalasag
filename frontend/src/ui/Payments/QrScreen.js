import React from 'react';
import './QrScreen.css';

/**
 * QrScreen (Mock)
 * Props:
 *  - onCancel:   () => void              // back to Kalasag Dashboard
 *  - onScanned:  (data?: any) => void    // go to Transaction Confirmation (4.2)
 */
const QrScreen = ({ onCancel = () => {}, onScanned = () => {} }) => {
  const handleMockScan = () => {
    // Return a fake payload to the parent
    onScanned({ type: 'QR', payload: 'BPI-DEMO-QR-123456' });
  };

  return (
    <div className="qr-page">
      <div className="qr-wrap">
        {/* Header */}
        <header className="qr-header card">
          <h1>Pay with QR</h1>
        </header>

        {/* Mock camera card with centered square frame */}
        <section className="qr-card card" aria-label="Camera mock">
          <div className="qr-frame">
            <button className="qr-scan-btn" onClick={handleMockScan}>
              Tap to Scan (Mock)
            </button>
          </div>
        </section>

        {/* Actions */}
        <div className="qr-actions">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrScreen;

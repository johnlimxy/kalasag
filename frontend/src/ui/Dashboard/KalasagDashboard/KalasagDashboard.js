// import React from 'react';
// import './KalasagDashboard.css';

// const tiles = [
//   { key: 'check-balance', icon: '👁️', label: 'Check Balance' },
//   { key: 'qr',            icon: '🔳', label: 'Pay with QR' },
//   { key: 'send',          icon: '💸', label: 'Send Money' },
//   { key: 'bills',         icon: '🧾', label: 'Pay Bills' },
//   { key: 'guardians',     icon: '🛡️', label: 'Guardians' },
//   { key: 'help',          icon: '❓', label: 'Help / Tulong' },
// ];

// const KalasagDashboard = ({
//   balance = '₱15,500.00',
//   onNavigate = (key) => alert(`Navigate: ${key}`),
//   onSettings = () => alert('Open Settings'),
// }) => {
//   return (
//     <div className="k-container">
//       <div className="k-inner">
//         <header className="k-header card">
//           <h1>Kalasag Mode</h1>
//           <button className="k-settings" aria-label="Settings" onClick={onSettings}>⚙️</button>
//         </header>

//         <section className="k-balance card">
//           <div className="k-balance-label">Your Money</div>
//           <div className="k-balance-amount">{balance}</div>
//         </section>

//         <section className="k-grid">
//           {tiles.map((t) => (
//             <button
//               key={t.key}
//               className="k-tile card"
//               onClick={() => onNavigate(t.key)}
//               aria-label={t.label}
//             >
//               <div className="k-tile-icon">{t.icon}</div>
//               <div className="k-tile-label">{t.label}</div>
//             </button>
//           ))}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default KalasagDashboard;

// src/ui/Dashboard/KalasagDashboard/KalasagDashboard.js
// src/ui/Dashboard/KalasagDashboard/KalasagDashboard.js
import React, { useState } from 'react';
import './KalasagDashboard.css';
import QrScreen from '../../Payments/QrScreen';
import SendMoneyScreen from '../../Payments/SendMoneyScreen';

const tiles = [
  { key: 'check-balance', icon: '👁️', label: 'Check Balance' },
  { key: 'qr',            icon: '🔳', label: 'Pay with QR' },
  { key: 'send',          icon: '💸', label: 'Send Money' },
  { key: 'bills',         icon: '🧾', label: 'Pay Bills' },
  { key: 'guardians',     icon: '🛡️', label: 'Guardians' },
  { key: 'help',          icon: '❓', label: 'Help / Tulong' },
];

const KalasagDashboard = ({
  balance = '₱15,500.00',
  onNavigate = (key) => alert(`Navigate: ${key}`),
  onSettings = () => alert('Open Settings'),
}) => {
  // local “router”
  const [screen, setScreen] = useState('home'); // 'home' | 'qr' | 'send'

  const handleTile = (key) => {
    if (key === 'qr') {
      setScreen('qr');
    } else if (key === 'send') {
      setScreen('send');
    } else {
      onNavigate(key);
    }
  };

  // Screen 4.0 – Pay with QR (mock)
  if (screen === 'qr') {
    return (
      <QrScreen
        onCancel={() => setScreen('home')}
        onScanned={() => onNavigate('confirm')} // Screen 4.2 later
      />
    );
  }

  // Screen 4.1 – Send Money (mock form)
  if (screen === 'send') {
    return (
      <SendMoneyScreen
        onCancel={() => setScreen('home')}
        onNext={(payload) => {
          // You can pass payload up if you like: onNavigate('confirm', payload)
          console.log('Send Money payload:', payload);
          onNavigate('confirm'); // Screen 4.2 later
        }}
      />
    );
  }

  // Default Kalasag home
  return (
    <div className="k-container">
      <div className="k-inner">
        <header className="k-header card">
          <h1>Kalasag Mode</h1>
          <button className="k-settings" aria-label="Settings" onClick={onSettings}>⚙️</button>
        </header>

        <section className="k-balance card">
          <div className="k-balance-label">Your Money</div>
          <div className="k-balance-amount">{balance}</div>
        </section>

        <section className="k-grid">
          {tiles.map((t) => (
            <button
              key={t.key}
              className="k-tile card"
              onClick={() => handleTile(t.key)}
              aria-label={t.label}
            >
              <div className="k-tile-icon">{t.icon}</div>
              <div className="k-tile-label">{t.label}</div>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
};

export default KalasagDashboard;

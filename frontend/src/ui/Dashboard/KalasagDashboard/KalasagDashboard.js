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
import HighRiskModal from '../../AiAssistModal/HighRiskModal'; // Ensure the path is correct

// ✅ NEW: import the Guardian screen
import GuardianDashboard from '../../GuardianDashboard/GuardianDashboard';

// ✅ NEW: import ChatBot component
import ChatBot from '../../AiAssistModal/ChatBot'; // Assuming ChatBot.js is in src/ui

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
  onNavigate = (key) => alert(`Navigate: ${key}`),  // Use appropriate routing method
  onSettings = () => alert('Open Settings'),
}) => {
  // local “router”
  const [screen, setScreen] = useState('home'); // 'home' | 'qr' | 'send' | 'guardians'
  const [showModal, setShowModal] = useState(false); // Modal state for HighRiskModal

  // ✅ NEW: demo guardian data (replace with real data when ready)
  const [guardian] = useState({ name: 'Maria Santos', status: 'Active' });

  const handleTile = (key) => {
    if (key === 'qr') {
      setScreen('qr');
    } else if (key === 'send') {
      setScreen('send');
    } else if (key === 'guardians') {
      // ✅ NEW: open Guardian Management
      setScreen('guardians');
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
        onCancel={() => setScreen('home')}   // go back after modal closes or X
      />
    );
  }

  // ✅ NEW: Screen 5.0 – Guardian Management
  if (screen === 'guardians') {
    return (
      <GuardianDashboard
        initialGuardian={guardian}                 // pass existing guardian or null
        onBack={() => setScreen('home')}           // back to Kalasag home
        onInvite={() => onNavigate('invite-guardian')} // -> Screen 5.1 later
      />
    );
  }

  // Handle "Proceed" action from HighRiskModal
  const handleProceed = () => {
    setShowModal(false); // Close the HighRiskModal
    onNavigate('home');  // Navigate to Kalasag Dashboard (make sure this triggers a route change)
  };

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

      {/* High Risk Modal */}
      {showModal && (
        <HighRiskModal
          onCancel={() => setShowModal(false)}  // Close the modal
          onProceed={handleProceed}  // Proceed to Kalasag Dashboard
        />
      )}

      {/* Floating Chatbot */}
      <ChatBot />
    </div>
  );
};

export default KalasagDashboard;

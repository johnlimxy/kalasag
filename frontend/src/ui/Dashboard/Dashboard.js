// // src/ui/Dashboard/Dashboard.js
// import React, { useState, useRef, useEffect } from 'react';
// import './Dashboard.css';

// const Dashboard = () => {
//   const userName = 'Julia Anna Denise';
//   const carouselItems = [
//     { title: 'Money tracker', subtitle: "It's time to track & plan your cash flow today." },
//     { title: 'Spending Summary', subtitle: "Your spending in July was ₱45,000." },
//     { title: 'Goals', subtitle: "You’re 60% towards your emergency fund." }
//   ];
//   const accounts = [
//     { type: 'Savings Account', number: '0576 9017 82', balance: '₱12,345.67' },
//     { type: 'Savings Account', number: '9809 2404 33', balance: '₱8,210.50' },
//     { type: 'Savings Account', number: '1234 5678 90', balance: '₱4,980.00' }
//   ];

//   // Carousel state and ref
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const trackRef = useRef(null);
//   const goTo = idx => setCurrentIndex((idx + carouselItems.length) % carouselItems.length);
//   useEffect(() => {
//     if (trackRef.current) {
//       trackRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
//     }
//   }, [currentIndex]);

//   // Accounts dropdown
//   const [accountsOpen, setAccountsOpen] = useState(true);
//   const toggleAccounts = () => setAccountsOpen(open => !open);

//   // Balance visibility state (one per account)
//   const [visible, setVisible] = useState(accounts.map(() => false));
//   const toggleVisible = index => {
//     setVisible(v => v.map((vis, i) => i === index ? !vis : vis));
//   };

//   // Logout handler
//   const handleLogout = () => {
//     if (window.confirm('Are you sure you want to logout?')) {
//       window.location.reload();
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-inner">

//         {/* Header */}
//         <header className="dashboard-header">
//           <h1>
//             Good evening, <span className="user-name">{userName}</span>
//           </h1>
//           <button className="notification-icon" aria-label="Notifications">
//             🔔
//           </button>
//         </header>

//         {/* Carousel Section */}
//         <div className="carousel-section">
//           <div className="carousel-wrapper">
//             <button
//               className="carousel-nav left"
//               onClick={() => goTo(currentIndex - 1)}
//             >
//               &lt;
//             </button>
//             <div className="carousel-track-wrapper">
//               <div className="carousel-track" ref={trackRef}>
//                 {carouselItems.map((item, idx) => (
//                   <div key={idx} className="carousel-slide">
//                     <h2>{item.title}</h2>
//                     <p>{item.subtitle}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <button
//               className="carousel-nav right"
//               onClick={() => goTo(currentIndex + 1)}
//             >
//               &gt;
//             </button>
//           </div>
//           <div className="carousel-dots">
//             {carouselItems.map((_, idx) => (
//               <button
//                 key={idx}
//                 className={`dot ${idx === currentIndex ? 'active' : ''}`}
//                 onClick={() => goTo(idx)}
//                 aria-label={`Slide ${idx + 1}`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Accounts Section */}
//         <section className="accounts-section">
//           <div className="accounts-header" onClick={toggleAccounts}>
//             <div className="accounts-title">
//               <span>Deposit accounts</span>
//               <span className="accounts-count">{accounts.length}</span>
//             </div>
//             <div className={`accounts-toggle ${accountsOpen ? 'open' : ''}`}>▾</div>
//           </div>
//           {accountsOpen && (
//             <div className="accounts-list">
//               {accounts.map((acct, idx) => (
//                 <div key={idx} className="account-card">
//                   <div className="account-info">
//                     <div className="account-type">{acct.type}</div>
//                     <div className="account-number">{acct.number}</div>
//                   </div>
//                   <div className="account-balance-section">
//                     <span className="account-balance">
//                       {visible[idx] ? acct.balance : '•••••••'}
//                     </span>
//                     <button
//                       className="balance-toggle"
//                       onClick={() => toggleVisible(idx)}
//                       aria-label="Show balance"
//                     >
//                       {visible[idx] ? 'Hide' : 'Show'}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Kalasag Banner */}
//         <button className="kalasag-banner">
//           A simpler, safer way to bank. Activate Kalasag Mode.
//         </button>

//         {/* Logout Button */}
//         <button className="logout-button" onClick={handleLogout}>
//           Logout
//         </button>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useRef, useEffect } from 'react';
import './Dashboard.css';
import KalasagModal from './KalasagModal/KalasagModal';
import KalasagDashboard from './KalasagDashboard/KalasagDashboard';

const Dashboard = () => {
  const userName = 'Julia Anna Denise';
  const carouselItems = [
    { title: 'Money tracker', subtitle: "It's time to track & plan your cash flow today." },
    { title: 'Spending Summary', subtitle: "Your spending in July was ₱45,000." },
    { title: 'Goals', subtitle: "You’re 60% towards your emergency fund." }
  ];
  const accounts = [
    { type: 'Savings Account', number: '0576 9017 82', balance: '₱12,345.67' },
    { type: 'Savings Account', number: '9809 2404 33', balance: '₱8,210.50' },
    { type: 'Savings Account', number: '1234 5678 90', balance: '₱4,980.00' }
  ];

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);
  const goTo = idx => setCurrentIndex((idx + carouselItems.length) % carouselItems.length);
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  // Accounts dropdown
  const [accountsOpen, setAccountsOpen] = useState(true);
  const toggleAccounts = () => setAccountsOpen(o => !o);

  // Balance visibility
  const [visible, setVisible] = useState(accounts.map(() => false));
  const toggleVisible = idx => setVisible(v => v.map((vis, i) => i === idx ? !vis : vis));

  // Kalasag modal
  const [showModal, setShowModal] = useState(false);
  //KalasagActive
  const [kalasagActive, setKalasagActive] = useState(false);

  const activate = () => {
  setShowModal(false);
  setKalasagActive(true);
  };

  

  // When Kalasag Mode is active, show that dashboard instead
  if (kalasagActive) {
  return (
    <KalasagDashboard
        balance={accounts[0]?.balance || '₱0.00'}
        onSettings={() => alert('Open Settings')}
        onNavigate={(key) => alert(`Navigate to: ${key}`)}
      />
    );
}

  // Logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      window.location.reload();
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-inner">

        {/* Header */}
        <header className="dashboard-header">
          <h1>Good evening, <span className="user-name">{userName}</span></h1>
          <button className="notification-icon" aria-label="Notifications">🔔</button>
        </header>

        {/* Carousel */}
        <div className="carousel-section">
          <div className="carousel-wrapper">
            <button className="carousel-nav left" onClick={() => goTo(currentIndex - 1)}>&lt;</button>
            <div className="carousel-track-wrapper">
              <div className="carousel-track" ref={trackRef}>
                {carouselItems.map((item, idx) => (
                  <div key={idx} className="carousel-slide">
                    <h2>{item.title}</h2>
                    <p>{item.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
            <button className="carousel-nav right" onClick={() => goTo(currentIndex + 1)}>&gt;</button>
          </div>
          <div className="carousel-dots">
            {carouselItems.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => goTo(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Accounts */}
        <section className="accounts-section">
          <div className="accounts-header" onClick={toggleAccounts}>
            <div className="accounts-title">
              <span>Deposit accounts</span>
              <span className="accounts-count">{accounts.length}</span>
            </div>
            <div className={`accounts-toggle ${accountsOpen ? 'open' : ''}`}>▾</div>
          </div>
          {accountsOpen && (
            <div className="accounts-list">
              {accounts.map((acct, idx) => (
                <div key={idx} className="account-card">
                  <div className="account-info">
                    <div className="account-type">{acct.type}</div>
                    <div className="account-number">{acct.number}</div>
                    <div className="balance-label">Available balance</div>
                  </div>
                  <div className="account-balance-section">
                    <span className="account-balance">
                      {visible[idx] ? acct.balance : '•••••••'}
                    </span>
                    <button className="balance-toggle" onClick={() => toggleVisible(idx)}>
                      {visible[idx] ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Kalasag Banner */}
        <button className="kalasag-banner" onClick={() => setShowModal(true)}>
          A simpler, safer way to bank. Activate Kalasag Mode.
        </button>

        {/* Logout */}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>

        {/* Modal */}
        <KalasagModal
          isOpen={showModal}
          onActivate={activate}
          onClose={() => setShowModal(false)}
        />

      </div>
    </div>
  );
};

export default Dashboard;
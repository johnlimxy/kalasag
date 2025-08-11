// src/App.js
// This is the main controller for our application.

import React, { useState } from 'react';
import './App.css';

// --- DEBUGGING CHECKPOINT ---
// The lines below are the most likely source of the error.
// Please check the following for EACH of the three import lines:

// 1. EXACT FOLDER NAME: Is the folder inside 'src' named EXACTLY 'screens' (all lowercase)?
// 2. EXACT SUBFOLDER NAME: Inside 'screens', are the folders named EXACTLY 'login', 'bpidashboard', and 'kalasagdashboard'?
// 3. EXACT FILE NAME: Inside each subfolder, is the file name EXACTLY 'loginScreen.js', 'bpiDashboardScreen.js', etc.?
//
// **Case sensitivity is critical!** 'LoginScreen.js' is NOT the same as 'loginScreen.js'.

import LoginScreen from './screens/login/loginScreen';
import BpiDashboardScreen from './screens/bpidashboard/bpiDashboardScreen';
import KalasagDashboardScreen from './screens/kalasagdashboard/kalasagDashboardScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('LOGIN');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'BPI_DASHBOARD':
        return <BpiDashboardScreen onActivateKalasag={() => setCurrentScreen('KALASAG_DASHBOARD')} />;
      case 'KALASAG_DASHBOARD':
        return <KalasagDashboardScreen />;
      case 'LOGIN':
      default:
        return <LoginScreen onLogin={() => setCurrentScreen('BPI_DASHBOARD')} />;
    }
  };

  return (
    <div className="App">
      {renderScreen()}
    </div>
  );
}

export default App;
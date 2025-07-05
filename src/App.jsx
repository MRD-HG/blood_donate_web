import React, { useState } from 'react';
import './App.css';

// Import your existing registration form component
// Adjust the import path based on your file structure
import DonorRegistrationForm from './Blood_Donation';
import DonorList from './DonorList';

function App() {
  // State to control which view to show
  const [currentView, setCurrentView] = useState('registration'); // 'registration' or 'list'
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Handle successful registration - refresh the donor list
  const handleRegistrationSuccess = (newDonor) => {
    console.log('New donor registered:', newDonor);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh of donor list
    // Optionally switch to list view after successful registration
    // setCurrentView('list');
  };

  // Navigation functions
  const showRegistrationForm = () => {
    setCurrentView('registration');
  };

  const showDonorList = () => {
    setCurrentView('list');
  };

  return (
    <div className="App">
      {/* Navigation Header */}
      <nav className="app-navigation">
        <div className="nav-container">
          <h1 className="app-title">نظام إدارة المتبرعين بالدم</h1>
          <div className="nav-buttons">
            <button
              onClick={showRegistrationForm}
              className={`nav-btn ${currentView === 'registration' ? 'active' : ''}`}
            >
              تسجيل متبرع جديد
            </button>
            <button
              onClick={showDonorList}
              className={`nav-btn ${currentView === 'list' ? 'active' : ''}`}
            >
              قائمة المتبرعين
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {currentView === 'registration' ? (
          <DonorRegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
        ) : (
          <DonorList refreshTrigger={refreshTrigger} />
        )}
      </main>
    </div>
  );
}

export default App;


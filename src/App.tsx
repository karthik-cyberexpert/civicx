import React, { useState } from 'react';
import './App.css';
import HomeScreen from './components/HomeScreen';
import ReportIssueScreen from './components/ReportIssueScreen';
import MyReportsScreen from './components/MyReportsScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import ProfileScreen from './components/ProfileScreen';
import CommunityScreen from './components/CommunityScreen';
import { useAuth } from './contexts/AuthContext';

export type Screen = 'home' | 'report' | 'myReports' | 'leaderboard' | 'profile' | 'community';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [userPoints, setUserPoints] = useState(125);
  const [userName] = useState('Alex');
  const { logout } = useAuth();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen 
          userName={userName} 
          userPoints={userPoints} 
          onNavigate={setCurrentScreen} 
        />;
      case 'report':
        return <ReportIssueScreen 
          onNavigate={setCurrentScreen}
          onSubmitReport={(points: number) => setUserPoints(prev => prev + points)}
        />;
      case 'myReports':
        return <MyReportsScreen onNavigate={setCurrentScreen} />;
      case 'leaderboard':
        return <LeaderboardScreen onNavigate={setCurrentScreen} />;
      case 'community':
        return <CommunityScreen onNavigate={setCurrentScreen} />;
      case 'profile':
        return <ProfileScreen 
          userName={userName}
          userPoints={userPoints}
          onNavigate={setCurrentScreen} 
        />;
      default:
        return <HomeScreen 
          userName={userName} 
          userPoints={userPoints} 
          onNavigate={setCurrentScreen} 
        />;
    }
  };

  return (
    <div className="App">
      {/* Side/Bottom Navigation Panel */}
      <nav className="bottom-nav">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span role="img" aria-label="logo">🛡️</span>
            Civix
          </div>
        </div>
        
        <div className="nav-items-container">
          <button 
            className={`nav-item ${currentScreen === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('home')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Home</span>
          </button>
          
          <button 
            className={`nav-item ${currentScreen === 'report' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('report')}
          >
            <span className="nav-icon">📸</span>
            <span className="nav-label">Report Issue</span>
          </button>
          
          <button 
            className={`nav-item ${currentScreen === 'myReports' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('myReports')}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-label">My Reports</span>
          </button>
          
          <button 
            className={`nav-item ${currentScreen === 'community' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('community')}
          >
            <span className="nav-icon">🤝</span>
            <span className="nav-label">Community</span>
          </button>
          
          <button 
            className={`nav-item ${currentScreen === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('leaderboard')}
          >
            <span className="nav-icon">🏆</span>
            <span className="nav-label">Leaderboard</span>
          </button>
          
          <button 
            className={`nav-item ${currentScreen === 'profile' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('profile')}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <div className="sidebar-avatar">
              {userName.charAt(0)}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-username">{userName}</span>
              <span className="sidebar-user-points">{userPoints} points</span>
            </div>
          </div>
          <button className="sidebar-logout-button" onClick={logout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </nav>
      
      {/* Top bar with logout button for mobile */}
      <div className="top-bar">
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
      
      {/* Main content area */}
      <div className="app-content">
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;
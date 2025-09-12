import React, { useState } from 'react';
import './App.css';
import HomeScreen from './components/HomeScreen';
import ReportIssueScreen from './components/ReportIssueScreen';
import MyReportsScreen from './components/MyReportsScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import ProfileScreen from './components/ProfileScreen';

export type Screen = 'home' | 'report' | 'myReports' | 'leaderboard' | 'profile';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [userPoints, setUserPoints] = useState(125);
  const [userName] = useState('Alex');

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
      <div className="app-content">
        {renderScreen()}
      </div>
      
      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${currentScreen === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('home')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </button>
        
        <button 
          className={`nav-item ${currentScreen === 'myReports' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('myReports')}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-label">Reports</span>
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
      </nav>
    </div>
  );
}

export default App;

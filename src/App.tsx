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
      {renderScreen()}
    </div>
  );
}

export default App;

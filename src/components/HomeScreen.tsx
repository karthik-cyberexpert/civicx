import React from 'react';
import { Screen } from '../App';

interface HomeScreenProps {
  userName: string;
  userPoints: number;
  onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ userName, userPoints, onNavigate }) => {
  return (
    <div className="screen with-bottom-nav fade-in">
      <div className="header main-screens">
        <h1>Civix</h1>
        <p>Making your city better, together</p>
        <div className="points-display">
          ⭐ {userPoints} points
        </div>
      </div>
      
      <div className="content">
        <div className="greeting">
          <h2>Hello, {userName}!</h2>
          <p>Let's make your city better!</p>
        </div>
        
        <div className="button-grid">
          <button 
            className="primary-button"
            onClick={() => onNavigate('report')}
          >
            📸 Report an Issue
          </button>
        </div>
        
        <div className="next-reward">
          🎯 Next Reward: {150 - userPoints} points to go!
        </div>
        
        <div className="badges-section">
          <h3 style={{textAlign: 'center', marginBottom: '20px', color: '#2c3e50'}}>
            Your Achievements
          </h3>
          <div className="badges-grid">
            <div className={`badge ${userPoints >= 50 ? 'earned' : ''}`}>
              <span className="badge-icon">🏅</span>
              <div className="badge-name">Reporter</div>
            </div>
            <div className={`badge ${userPoints >= 100 ? 'earned' : ''}`}>
              <span className="badge-icon">⭐</span>
              <div className="badge-name">Hero</div>
            </div>
            <div className={`badge ${userPoints >= 200 ? 'earned' : ''}`}>
              <span className="badge-icon">👑</span>
              <div className="badge-name">Champion</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
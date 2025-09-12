import React from 'react';
import { Screen } from '../App';

interface LeaderboardUser {
  id: number;
  name: string;
  points: number;
  avatar: string;
  isCurrentUser?: boolean;
}

interface LeaderboardScreenProps {
  onNavigate: (screen: Screen) => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onNavigate }) => {
  // Mock leaderboard data
  const leaderboardUsers: LeaderboardUser[] = [
    { id: 1, name: 'Sarah Chen', points: 456, avatar: 'SC' },
    { id: 2, name: 'Mike Johnson', points: 389, avatar: 'MJ' },
    { id: 3, name: 'Priya Patel', points: 321, avatar: 'PP' },
    { id: 4, name: 'David Kim', points: 298, avatar: 'DK' },
    { id: 5, name: 'Alex Smith', points: 125, avatar: 'AS', isCurrentUser: true }, // Current user
    { id: 6, name: 'Emma Wilson', points: 98, avatar: 'EW' },
    { id: 7, name: 'James Brown', points: 87, avatar: 'JB' },
    { id: 8, name: 'Lisa Garcia', points: 76, avatar: 'LG' },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const currentUserRank = leaderboardUsers.findIndex(user => user.isCurrentUser) + 1;

  return (
    <div className="screen fade-in">
      <div className="header">
        <button className="back-button" onClick={() => onNavigate('home')}>
          ←
        </button>
        <h1>Leaderboard</h1>
        <p>Top community heroes</p>
      </div>
      
      <div className="content">
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          padding: '20px',
          borderRadius: '16px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h3 style={{marginBottom: '10px'}}>Your Rank</h3>
          <div style={{fontSize: '32px', fontWeight: '700', marginBottom: '5px'}}>
            #{currentUserRank}
          </div>
          <p style={{opacity: 0.9}}>
            Keep reporting to climb higher!
          </p>
        </div>

        <div style={{marginBottom: '20px'}}>
          <h3 style={{textAlign: 'center', color: '#2c3e50', marginBottom: '20px'}}>
            🏆 Top Contributors
          </h3>
          
          {leaderboardUsers.map((user, index) => (
            <div 
              key={user.id} 
              className={`leaderboard-item ${user.isCurrentUser ? 'slide-up' : ''}`}
              style={{
                border: user.isCurrentUser ? '2px solid #667eea' : '1px solid #ecf0f1',
                background: user.isCurrentUser ? '#f8f9ff' : 'white'
              }}
            >
              <div className="leaderboard-rank">
                {getRankIcon(index + 1)}
              </div>
              
              <div className="leaderboard-avatar">
                {user.avatar}
              </div>
              
              <div className="leaderboard-info">
                <div className="leaderboard-name">
                  {user.name} {user.isCurrentUser && '(You)'}
                </div>
                <div className="leaderboard-points">
                  {user.points} points
                </div>
              </div>
              
              {index < 3 && (
                <div style={{
                  background: index === 0 ? '#f39c12' : index === 1 ? '#95a5a6' : '#cd7f32',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {index === 0 ? 'GOLD' : index === 1 ? 'SILVER' : 'BRONZE'}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          marginTop: '30px'
        }}>
          <h4 style={{color: '#2c3e50', marginBottom: '15px'}}>
            🎯 How to Earn Points
          </h4>
          <div style={{textAlign: 'left', color: '#5a6c7d'}}>
            <p style={{marginBottom: '8px'}}>📸 Report an issue: <strong>25 points</strong></p>
            <p style={{marginBottom: '8px'}}>✅ Verified report: <strong>+15 points</strong></p>
            <p style={{marginBottom: '8px'}}>🎉 Issue resolved: <strong>+10 points</strong></p>
            <p style={{marginBottom: '8px'}}>📱 Complete verification: <strong>+50 points</strong></p>
          </div>
        </div>

        <button 
          className="primary-button"
          onClick={() => onNavigate('report')}
          style={{marginTop: '20px', width: '100%'}}
        >
          📸 Report Issue & Earn Points
        </button>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
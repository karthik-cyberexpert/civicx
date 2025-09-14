import React, { useState } from 'react';
import { Screen } from '../App';

interface ProfileScreenProps {
  userName: string;
  userPoints: number;
  onNavigate: (screen: Screen) => void;
}

interface UserProfile {
  name: string;
  email: string;
  bio: string;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userName, userPoints, onNavigate }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: userName,
    email: 'user@example.com',
    bio: 'Making my city better, one report at a time! 🏙️'
  });

  const handleSaveProfile = () => {
    setIsEditMode(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="screen with-bottom-nav fade-in">
      <div className="header main-screens">
        <h1>Profile</h1>
        <p>Manage your account</p>
      </div>
      
      <div className="content">
        {/* Profile Header */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '25px',
          textAlign: 'center',
          marginBottom: '25px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '36px',
            fontWeight: '600',
            margin: '0 auto 20px'
          }}>
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginTop: '15px'
          }}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontWeight: '700', fontSize: '24px', color: '#667eea'}}>
                {userPoints}
              </div>
              <div style={{fontSize: '12px', color: '#7f8c8d'}}>Total Points</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontWeight: '700', fontSize: '24px', color: '#27ae60'}}>
                12
              </div>
              <div style={{fontSize: '12px', color: '#7f8c8d'}}>Reports</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontWeight: '700', fontSize: '24px', color: '#f39c12'}}>
                8
              </div>
              <div style={{fontSize: '12px', color: '#7f8c8d'}}>Resolved</div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '25px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{color: '#2c3e50', margin: 0}}>Profile Information</h3>
            <button 
              className="secondary-button"
              onClick={() => setIsEditMode(!isEditMode)}
              style={{padding: '8px 16px', fontSize: '14px'}}
            >
              {isEditMode ? 'Cancel' : '✏️ Edit'}
            </button>
          </div>
          
          {isEditMode ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <div>
                <label>Name</label>
                <input 
                  className="form-input"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile(prev => ({...prev, name: e.target.value}))}
                />
              </div>
              <div>
                <label>Email</label>
                <input 
                  className="form-input"
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile(prev => ({...prev, email: e.target.value}))}
                />
              </div>
              <div>
                <label>Bio</label>
                <textarea 
                  className="form-input form-textarea"
                  value={userProfile.bio}
                  onChange={(e) => setUserProfile(prev => ({...prev, bio: e.target.value}))}
                  style={{minHeight: '60px'}}
                />
              </div>
              <button 
                className="primary-button"
                onClick={handleSaveProfile}
              >
                💾 Save Changes
              </button>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #ecf0f1'}}>
                <span style={{fontWeight: '600', color: '#2c3e50'}}>Name</span>
                <span style={{color: '#7f8c8d'}}>{userProfile.name}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #ecf0f1'}}>
                <span style={{fontWeight: '600', color: '#2c3e50'}}>Email</span>
                <span style={{color: '#7f8c8d'}}>{userProfile.email}</span>
              </div>
              <div style={{padding: '10px 0'}}>
                <span style={{fontWeight: '600', color: '#2c3e50', display: 'block', marginBottom: '5px'}}>Bio</span>
                <span style={{color: '#7f8c8d', fontSize: '14px'}}>{userProfile.bio}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Logout Button */}
        <button 
          className="secondary-button"
          style={{
            background: '#e74c3c',
            color: 'white',
            border: '2px solid #e74c3c',
            width: '100%'
          }}
          onClick={() => alert('Logout functionality coming soon!')}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;
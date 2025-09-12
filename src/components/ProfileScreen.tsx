import React, { useState } from 'react';
import { Screen } from '../App';

interface ProfileScreenProps {
  userName: string;
  userPoints: number;
  onNavigate: (screen: Screen) => void;
}

interface VerificationStatus {
  phone: boolean;
  selfie: boolean;
  kyc: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  dateJoined: string;
}

interface NotificationSettings {
  reportUpdates: boolean;
  newFeatures: boolean;
  leaderboard: boolean;
  marketing: boolean;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userName, userPoints, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'verification' | 'stats'>('profile');
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [verification, setVerification] = useState<VerificationStatus>({
    phone: true,  // Assume phone is verified
    selfie: false,
    kyc: false
  });

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: userName,
    email: 'user@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Making my city better, one report at a time! 🏙️',
    location: 'Downtown, Your City',
    dateJoined: '2024-01-15'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    reportUpdates: true,
    newFeatures: true,
    leaderboard: false,
    marketing: false
  });

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleVerifyPhone = () => {
    alert('Phone verification coming soon! You\'ll receive an SMS with a verification code.');
  };

  const handleSaveProfile = () => {
    setIsEditMode(false);
    alert('Profile updated successfully!');
  };

  const handleVerifySelfie = () => {
    if (verification.phone) {
      setVerification(prev => ({ ...prev, selfie: true }));
      alert('Selfie verification completed! You earned 25 points.');
    } else {
      alert('Please verify your phone number first.');
    }
  };

  const handleVerifyKYC = () => {
    if (verification.phone && verification.selfie) {
      setVerification(prev => ({ ...prev, kyc: true }));
      alert('KYC verification completed! You earned 25 points.');
    } else {
      alert('Please complete phone and selfie verification first.');
    }
  };

  const getVerificationLevel = () => {
    const completedSteps = Object.values(verification).filter(Boolean).length;
    switch (completedSteps) {
      case 1: return { level: 'Basic', color: '#27ae60', description: 'Phone verified' };
      case 2: return { level: 'Trusted', color: '#3498db', description: 'Identity confirmed' };
      case 3: return { level: 'Premium', color: '#f39c12', description: 'Fully verified' };
      default: return { level: 'Unverified', color: '#95a5a6', description: 'Start verification' };
    }
  };

  const verificationLevel = getVerificationLevel();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
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
                margin: '0 auto 20px',
                position: 'relative',
                cursor: 'pointer'
              }}>
                {userProfile.name.charAt(0).toUpperCase()}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: '#27ae60',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  border: '3px solid white'
                }}>
                  📷
                </div>
              </div>
              
              <div style={{
                display: 'inline-block',
                background: verificationLevel.color,
                color: 'white',
                padding: '6px 16px',
                borderRadius: '15px',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '15px'
              }}>
                {verificationLevel.level}
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
                    <label style={{display: 'block', fontWeight: '600', marginBottom: '5px', color: '#2c3e50'}}>Name</label>
                    <input 
                      className="form-input"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile(prev => ({...prev, name: e.target.value}))}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', fontWeight: '600', marginBottom: '5px', color: '#2c3e50'}}>Email</label>
                    <input 
                      className="form-input"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile(prev => ({...prev, email: e.target.value}))}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', fontWeight: '600', marginBottom: '5px', color: '#2c3e50'}}>Bio</label>
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
                    style={{marginTop: '10px'}}
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
                  <div style={{padding: '10px 0', borderBottom: '1px solid #ecf0f1'}}>
                    <span style={{fontWeight: '600', color: '#2c3e50', display: 'block', marginBottom: '5px'}}>Bio</span>
                    <span style={{color: '#7f8c8d', fontSize: '14px'}}>{userProfile.bio}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0'}}>
                    <span style={{fontWeight: '600', color: '#2c3e50'}}>Member Since</span>
                    <span style={{color: '#7f8c8d'}}>{new Date(userProfile.dateJoined).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '25px',
              marginBottom: '25px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{color: '#2c3e50', marginBottom: '20px'}}>🔔 Notifications</h3>
              
              {Object.entries(notifications).map(([key, value]) => {
                const labels: Record<string, string> = {
                  reportUpdates: 'Report Updates',
                  newFeatures: 'New Features',
                  leaderboard: 'Leaderboard Changes',
                  marketing: 'Marketing & Promotions'
                };
                
                return (
                  <div key={key} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px 0',
                    borderBottom: '1px solid #ecf0f1'
                  }}>
                    <div>
                      <div style={{fontWeight: '600', color: '#2c3e50'}}>
                        {labels[key]}
                      </div>
                      <div style={{fontSize: '14px', color: '#7f8c8d'}}>Get updates</div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={value}
                      onChange={() => handleNotificationChange(key as keyof NotificationSettings)}
                      style={{transform: 'scale(1.5)'}}
                    />
                  </div>
                );
              })}
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '25px',
              marginBottom: '25px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{color: '#2c3e50', marginBottom: '20px'}}>⚙️ App Settings</h3>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <button className="secondary-button" onClick={() => alert('Language settings coming soon!')}>
                  🌍 Language & Region
                </button>
                <button className="secondary-button" onClick={() => alert('Theme settings coming soon!')}>
                  🎨 Theme & Appearance
                </button>
                <button className="secondary-button" onClick={() => alert('Help center coming soon!')}>
                  ❓ Help & Support
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'verification':
        return (
          <div>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '25px',
              marginBottom: '25px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
                🔐 Account Verification
              </h3>
              
              <div className="verification-badges">
                <div className={`verification-badge phone ${verification.phone ? '' : 'incomplete'}`}>
                  📱
                </div>
                <div className={`verification-badge selfie ${verification.selfie ? '' : 'incomplete'}`}>
                  🤳
                </div>
                <div className={`verification-badge kyc ${verification.kyc ? '' : 'incomplete'}`}>
                  🆔
                </div>
              </div>
              
              <div style={{marginTop: '20px'}}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '15px 0',
                  borderBottom: '1px solid #ecf0f1'
                }}>
                  <div>
                    <div style={{fontWeight: '600', color: '#2c3e50'}}>Phone Verification</div>
                    <div style={{fontSize: '14px', color: '#7f8c8d'}}>Verify your phone number</div>
                  </div>
                  {verification.phone ? (
                    <span style={{color: '#27ae60', fontWeight: '600'}}>✓ Verified</span>
                  ) : (
                    <button 
                      className="secondary-button"
                      onClick={handleVerifyPhone}
                      style={{padding: '8px 16px', fontSize: '14px'}}
                    >
                      Verify
                    </button>
                  )}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '15px 0',
                  borderBottom: '1px solid #ecf0f1'
                }}>
                  <div>
                    <div style={{fontWeight: '600', color: '#2c3e50'}}>Selfie Verification</div>
                    <div style={{fontSize: '14px', color: '#7f8c8d'}}>Take a selfie for identity verification</div>
                  </div>
                  {verification.selfie ? (
                    <span style={{color: '#3498db', fontWeight: '600'}}>✓ Verified</span>
                  ) : (
                    <button 
                      className="secondary-button"
                      onClick={handleVerifySelfie}
                      style={{
                        padding: '8px 16px', 
                        fontSize: '14px',
                        opacity: verification.phone ? 1 : 0.5
                      }}
                      disabled={!verification.phone}
                    >
                      Verify
                    </button>
                  )}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '15px 0'
                }}>
                  <div>
                    <div style={{fontWeight: '600', color: '#2c3e50'}}>KYC Verification</div>
                    <div style={{fontSize: '14px', color: '#7f8c8d'}}>Complete identity documents verification</div>
                  </div>
                  {verification.kyc ? (
                    <span style={{color: '#f39c12', fontWeight: '600'}}>✓ Verified</span>
                  ) : (
                    <button 
                      className="secondary-button"
                      onClick={handleVerifyKYC}
                      style={{
                        padding: '8px 16px', 
                        fontSize: '14px',
                        opacity: verification.phone && verification.selfie ? 1 : 0.5
                      }}
                      disabled={!(verification.phone && verification.selfie)}
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #ffeaa7, #fab1a0)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h4 style={{color: '#2d3436', marginBottom: '10px'}}>
                🎁 Verification Benefits
              </h4>
              <p style={{color: '#2d3436', fontSize: '14px', marginBottom: '15px'}}>
                Complete verification to unlock premium features!
              </p>
              <div style={{fontSize: '12px', color: '#2d3436', textAlign: 'left'}}>
                <p>✓ Higher priority for your reports</p>
                <p>✓ Extra points for submissions (+25 bonus points)</p>
                <p>✓ Exclusive community features</p>
                <p>✓ Direct contact with authorities</p>
              </div>
            </div>
          </div>
        );
        
      case 'stats':
        return (
          <div>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '25px',
              marginBottom: '25px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
                📊 Your Statistics
              </h3>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px'}}>
                <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '12px', textAlign: 'center'}}>
                  <div style={{fontSize: '28px', fontWeight: '700', color: '#667eea'}}>{userPoints}</div>
                  <div style={{fontSize: '14px', color: '#7f8c8d'}}>Total Points</div>
                </div>
                <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '12px', textAlign: 'center'}}>
                  <div style={{fontSize: '28px', fontWeight: '700', color: '#27ae60'}}>12</div>
                  <div style={{fontSize: '14px', color: '#7f8c8d'}}>Reports Submitted</div>
                </div>
                <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '12px', textAlign: 'center'}}>
                  <div style={{fontSize: '28px', fontWeight: '700', color: '#f39c12'}}>8</div>
                  <div style={{fontSize: '14px', color: '#7f8c8d'}}>Issues Resolved</div>
                </div>
                <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '12px', textAlign: 'center'}}>
                  <div style={{fontSize: '28px', fontWeight: '700', color: '#e74c3c'}}>67%</div>
                  <div style={{fontSize: '14px', color: '#7f8c8d'}}>Success Rate</div>
                </div>
              </div>
              
              <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '12px'}}>
                <h4 style={{color: '#2c3e50', marginBottom: '15px'}}>Recent Activity</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontSize: '14px', color: '#2c3e50'}}>Pothole Report - Main St</span>
                    <span style={{fontSize: '12px', color: '#27ae60', fontWeight: '600'}}>+25 pts</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontSize: '14px', color: '#2c3e50'}}>Streetlight Issue Resolved</span>
                    <span style={{fontSize: '12px', color: '#27ae60', fontWeight: '600'}}>+10 pts</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontSize: '14px', color: '#2c3e50'}}>Park Cleanup Request</span>
                    <span style={{fontSize: '12px', color: '#f39c12', fontWeight: '600'}}>Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="screen with-bottom-nav fade-in">
      <div className="header main-screens">
        <h1>Profile</h1>
        <p>Manage your account</p>
      </div>
      
      <div className="content">
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          background: 'white',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '20px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
        }}>
          {(['profile', 'settings', 'verification', 'stats'] as const).map((tab) => {
            const labels = {
              profile: '👤 Profile',
              settings: '⚙️ Settings', 
              verification: '🔐 Verify',
              stats: '📊 Stats'
            };
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: activeTab === tab ? '#667eea' : 'transparent',
                  color: activeTab === tab ? 'white' : '#7f8c8d'
                }}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {renderTabContent()}
        
        {/* Logout Button */}
        <button 
          className="secondary-button"
          style={{
            background: '#e74c3c',
            color: 'white',
            border: '2px solid #e74c3c',
            width: '100%',
            marginTop: '20px'
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
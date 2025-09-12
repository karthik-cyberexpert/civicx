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

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userName, userPoints, onNavigate }) => {
  const [verification, setVerification] = useState<VerificationStatus>({
    phone: true,  // Assume phone is verified
    selfie: false,
    kyc: false
  });

  const handleVerifyPhone = () => {
    alert('Phone verification coming soon! You\'ll receive an SMS with a verification code.');
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

  return (
    <div className="screen fade-in">
      <div className="header">
        <button className="back-button" onClick={() => onNavigate('home')}>
          ←
        </button>
        <h1>Profile</h1>
        <p>Manage your account</p>
      </div>
      
      <div className="content">
        {/* User Info Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '25px',
          textAlign: 'center',
          marginBottom: '25px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px',
            fontWeight: '600',
            margin: '0 auto 15px'
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          
          <h2 style={{color: '#2c3e50', marginBottom: '5px'}}>
            {userName}
          </h2>
          
          <div style={{
            display: 'inline-block',
            background: verificationLevel.color,
            color: 'white',
            padding: '5px 15px',
            borderRadius: '15px',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '10px'
          }}>
            {verificationLevel.level}
          </div>
          
          <p style={{color: '#7f8c8d', fontSize: '14px', marginBottom: '15px'}}>
            {verificationLevel.description}
          </p>
          
          <div style={{
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-around'
          }}>
            <div>
              <div style={{fontWeight: '700', fontSize: '24px', color: '#667eea'}}>
                {userPoints}
              </div>
              <div style={{fontSize: '12px', color: '#7f8c8d'}}>Total Points</div>
            </div>
            <div>
              <div style={{fontWeight: '700', fontSize: '24px', color: '#27ae60'}}>
                3
              </div>
              <div style={{fontSize: '12px', color: '#7f8c8d'}}>Reports</div>
            </div>
            <div>
              <div style={{fontWeight: '700', fontSize: '24px', color: '#f39c12'}}>
                2
              </div>
              <div style={{fontSize: '12px', color: '#7f8c8d'}}>Resolved</div>
            </div>
          </div>
        </div>

        {/* Verification Section */}
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
                <span style={{color: '#27ae60', fontWeight: '600'}}>✓ Done</span>
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
                <div style={{fontSize: '14px', color: '#7f8c8d'}}>Take a selfie for identity</div>
              </div>
              {verification.selfie ? (
                <span style={{color: '#3498db', fontWeight: '600'}}>✓ Done</span>
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
                <div style={{fontSize: '14px', color: '#7f8c8d'}}>Complete identity documents</div>
              </div>
              {verification.kyc ? (
                <span style={{color: '#f39c12', fontWeight: '600'}}>✓ Done</span>
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

        {/* Benefits Section */}
        <div style={{
          background: 'linear-gradient(135deg, #ffeaa7, #fab1a0)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '25px'
        }}>
          <h4 style={{color: '#2d3436', marginBottom: '10px'}}>
            🎁 Verification Benefits
          </h4>
          <p style={{color: '#2d3436', fontSize: '14px', marginBottom: '15px'}}>
            Complete verification to unlock premium features!
          </p>
          <div style={{fontSize: '12px', color: '#2d3436', textAlign: 'left'}}>
            <p>✓ Higher priority for your reports</p>
            <p>✓ Extra points for submissions</p>
            <p>✓ Exclusive community features</p>
            <p>✓ Direct contact with authorities</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <button 
            className="secondary-button"
            onClick={() => onNavigate('myReports')}
          >
            📋 View My Reports
          </button>
          
          <button 
            className="secondary-button"
            onClick={() => onNavigate('leaderboard')}
          >
            🏆 Check Leaderboard
          </button>
          
          <button 
            className="secondary-button"
            style={{
              background: '#e74c3c',
              color: 'white',
              border: '2px solid #e74c3c'
            }}
            onClick={() => alert('Logout functionality coming soon!')}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
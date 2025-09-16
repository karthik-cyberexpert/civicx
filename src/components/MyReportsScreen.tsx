import React, { useState } from 'react';
import { Screen } from '../App';

interface ReportItem {
  id: number;
  image: string;
  title: string;
  status: 'pending' | 'approved' | 'resolved';
  date: string;
  progress: number;
  description: string;
}

interface MyReportsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const MyReportsScreen: React.FC<MyReportsScreenProps> = ({ onNavigate }) => {
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  // Mock data for demonstration
  const reports: ReportItem[] = [
    {
      id: 1,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzMzNyIvPjx0ZXh0IHg9IjEwIiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIj5Qb3Rob2xlIG9uIE1haW4gU3Q8L3RleHQ+PC9zdmc+',
      title: 'Pothole on Main Street',
      status: 'approved',
      date: '2024-01-15',
      progress: 75,
      description: 'Large pothole causing traffic issues'
    },
    {
      id: 2,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzMzNyIvPjx0ZXh0IHg9IjEwIiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIj5Ccm9rZW4gU3RyZWV0bGlnaHQ8L3RleHQ+PC9zdmc+',
      title: 'Broken Streetlight',
      status: 'pending',
      date: '2024-01-10',
      progress: 25,
      description: 'Streetlight not working in residential area'
    },
    {
      id: 3,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzMzNyIvPjx0ZXh0IHg9IjEwIiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIj5QYXJrIENsZWFudXA8L3RleHQ+PC9zdmc+',
      title: 'Park Cleanup Needed',
      status: 'resolved',
      date: '2023-12-20',
      progress: 100,
      description: 'Litter and maintenance needed in central park'
    }
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'resolved': return 'status-resolved';
      default: return 'status-pending';
    }
  };

  const getProgressSteps = (progress: number) => {
    const steps = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];
    const currentStep = Math.floor((progress / 100) * (steps.length - 1));
    return { steps, currentStep };
  };

  const handleRemind = (reportId: number) => {
    alert('Reminder sent to the department! You\'ll get an update soon.');
  };

  const handleEscalate = (reportId: number) => {
    alert('Issue escalated to higher authorities. This may help speed up the resolution.');
  };

  if (selectedReport) {
    const { steps, currentStep } = getProgressSteps(selectedReport.progress);
    
    return (
      <div className="screen fade-in">
        <div className="header">
          <button className="back-button" onClick={() => setSelectedReport(null)}>
            ←
          </button>
          <h1>Report Details</h1>
          <p>Track your issue progress</p>
        </div>
        
        <div className="content">
          <div className="report-card">
            <img 
              src={selectedReport.image} 
              alt={selectedReport.title}
              className="report-image"
            />
            
            <div className={`report-status ${getStatusClass(selectedReport.status)}`}>
              {selectedReport.status}
            </div>
            
            <h3 style={{marginBottom: '10px', color: '#2c3e50'}}>
              {selectedReport.title}
            </h3>
            
            <p style={{color: '#7f8c8d', marginBottom: '15px'}}>
              {selectedReport.description}
            </p>
            
            <p style={{fontSize: '14px', color: '#95a5a6', marginBottom: '20px'}}>
              Reported on {new Date(selectedReport.date).toLocaleDateString()}
            </p>

            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${selectedReport.progress}%`}}
                ></div>
              </div>
              <div className="progress-labels">
                {steps.map((step, index) => (
                  <span 
                    key={step} 
                    style={{
                      color: index <= currentStep ? '#667eea' : '#95a5a6',
                      fontWeight: index <= currentStep ? '600' : '400'
                    }}
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>

            {selectedReport.status !== 'resolved' && (
              <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                <button 
                  className="secondary-button"
                  onClick={() => handleRemind(selectedReport.id)}
                  style={{flex: 1}}
                >
                  🔔 Remind Department
                </button>
                <button 
                  className="secondary-button"
                  onClick={() => handleEscalate(selectedReport.id)}
                  style={{flex: 1}}
                >
                  ⚡ Escalate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen with-bottom-nav fade-in">
      <div className="header main-screens">
        <h1>My Reports</h1>
        <p>Track your submissions</p>
      </div>
      
      <div className="content">
        {reports.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px 20px'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📝</div>
            <h3 style={{color: '#2c3e50', marginBottom: '10px'}}>No Reports Yet</h3>
            <p style={{color: '#7f8c8d', marginBottom: '30px'}}>
              Start making a difference by reporting your first issue!
            </p>
            <button 
              className="primary-button"
              onClick={() => onNavigate('report')}
            >
              📸 Report an Issue
            </button>
          </div>
        ) : (
          <div className="reports-grid">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className="report-card"
                onClick={() => setSelectedReport(report)}
                style={{cursor: 'pointer'}}
              >
                <img 
                  src={report.image} 
                  alt={report.title}
                  className="report-image"
                />
                
                <div className={`report-status ${getStatusClass(report.status)}`}>
                  {report.status}
                </div>
                
                <h4 style={{marginBottom: '8px', color: '#2c3e50'}}>
                  {report.title}
                </h4>
                
                <p style={{fontSize: '14px', color: '#7f8c8d', marginBottom: '10px'}}>
                  {report.description}
                </p>
                
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${report.progress}%`}}
                    ></div>
                  </div>
                </div>
                
                <p style={{fontSize: '12px', color: '#95a5a6', marginTop: '10px'}}>
                  {new Date(report.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
        
        <button 
          className="primary-button"
          onClick={() => onNavigate('report')}
          style={{marginTop: '30px', width: '100%'}}
        >
          ➕ Report New Issue
        </button>
      </div>
    </div>
  );
};

export default MyReportsScreen;
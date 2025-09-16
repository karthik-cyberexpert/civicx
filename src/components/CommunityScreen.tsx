import React, { useState, useEffect } from 'react';

type Screen = 'home' | 'report' | 'myReports' | 'leaderboard' | 'profile' | 'community';

interface CommunityScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface CommunityReport {
  id: string;
  title: string;
  description: string;
  location: string;
  submittedBy: string;
  submitDate: string;
  category: string;
  urgencyVotes: number;
  hasVoted: boolean;
  imageUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const CommunityScreen: React.FC<CommunityScreenProps> = ({ onNavigate }) => {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [filter, setFilter] = useState<'all' | 'high' | 'recent'>('all');
  const [sortBy, setSortBy] = useState<'votes' | 'date'>('votes');

  // Mock community reports data
  useEffect(() => {
    const mockReports: CommunityReport[] = [
      {
        id: '1',
        title: 'Broken Streetlight on Main Road',
        description: 'Streetlight has been out for 3 days, creating safety concerns for evening commuters.',
        location: 'Main Road, Kothur',
        submittedBy: 'Rajesh Kumar',
        submitDate: '2024-01-10',
        category: 'Infrastructure',
        urgencyVotes: 15,
        hasVoted: false,
        priority: 'high',
        imageUrl: 'https://via.placeholder.com/100x60/444/fff?text=Street'
      },
      {
        id: '2',
        title: 'Pothole Near School Zone',
        description: 'Large pothole is causing traffic congestion and is dangerous for school children.',
        location: 'School Road, Hosur',
        submittedBy: 'Priya Sharma',
        submitDate: '2024-01-09',
        category: 'Road Safety',
        urgencyVotes: 23,
        hasVoted: true,
        priority: 'critical',
        imageUrl: 'https://via.placeholder.com/100x60/666/fff?text=Pothole'
      },
      {
        id: '3',
        title: 'Garbage Collection Missed',
        description: 'Garbage has not been collected for 4 days in residential area.',
        location: 'Green Valley, Kothur',
        submittedBy: 'Amit Patel',
        submitDate: '2024-01-08',
        category: 'Sanitation',
        urgencyVotes: 8,
        hasVoted: false,
        priority: 'medium',
        imageUrl: 'https://via.placeholder.com/100x60/888/fff?text=Garbage'
      },
      {
        id: '4',
        title: 'Water Supply Disruption',
        description: 'No water supply in the area for the past 2 days.',
        location: 'Park Avenue, Hosur',
        submittedBy: 'Meera Nair',
        submitDate: '2024-01-11',
        category: 'Utilities',
        urgencyVotes: 31,
        hasVoted: false,
        priority: 'critical',
        imageUrl: 'https://via.placeholder.com/100x60/36a/fff?text=Water'
      },
      {
        id: '5',
        title: 'Park Bench Vandalism',
        description: 'Public benches in community park have been damaged.',
        location: 'Community Park, Kothur',
        submittedBy: 'Suresh Reddy',
        submitDate: '2024-01-07',
        category: 'Public Property',
        urgencyVotes: 5,
        hasVoted: false,
        priority: 'low',
        imageUrl: 'https://via.placeholder.com/100x60/4a4/fff?text=Park'
      }
    ];
    setReports(mockReports);
  }, []);

  const handleVote = (reportId: string) => {
    setReports(prev => prev.map(report => {
      if (report.id === reportId && !report.hasVoted) {
        return {
          ...report,
          urgencyVotes: report.urgencyVotes + 1,
          hasVoted: true
        };
      }
      return report;
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return '📝';
      default: return '📋';
    }
  };

  const filteredReports = reports
    .filter(report => {
      if (filter === 'high') return report.priority === 'critical' || report.priority === 'high';
      if (filter === 'recent') return new Date(report.submitDate) >= new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'votes') return b.urgencyVotes - a.urgencyVotes;
      return new Date(b.submitDate).getTime() - new Date(a.submitDate).getTime();
    });

  return (
    <div className="screen">
      <header className="header">
        <button 
          className="back-button"
          onClick={() => onNavigate('home')}
        >
          ←
        </button>
        <h1>Community Reports</h1>
        <p>Vote to prioritize urgent issues in your area</p>
      </header>

      <div className="content">
        {/* Filter and Sort Controls */}
        <div className="community-controls">
          <div className="filter-section">
            <h3>Filter Reports</h3>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Reports
              </button>
              <button 
                className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
                onClick={() => setFilter('high')}
              >
                High Priority
              </button>
              <button 
                className={`filter-btn ${filter === 'recent' ? 'active' : ''}`}
                onClick={() => setFilter('recent')}
              >
                Recent
              </button>
            </div>
          </div>

          <div className="sort-section">
            <h3>Sort By</h3>
            <div className="sort-buttons">
              <button 
                className={`sort-btn ${sortBy === 'votes' ? 'active' : ''}`}
                onClick={() => setSortBy('votes')}
              >
                Most Votes
              </button>
              <button 
                className={`sort-btn ${sortBy === 'date' ? 'active' : ''}`}
                onClick={() => setSortBy('date')}
              >
                Latest
              </button>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="community-stats">
          <div className="stat-card">
            <span className="stat-number">{reports.length}</span>
            <span className="stat-label">Active Reports</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{reports.reduce((sum, r) => sum + r.urgencyVotes, 0)}</span>
            <span className="stat-label">Total Votes</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{reports.filter(r => r.priority === 'critical' || r.priority === 'high').length}</span>
            <span className="stat-label">High Priority</span>
          </div>
        </div>

        {/* Reports List */}
        <div className="reports-list">
          <h3>
            Community Reports 
            <span className="reports-count">({filteredReports.length})</span>
          </h3>
          
          {filteredReports.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p>No reports match your filters</p>
              <button 
                className="primary-button"
                onClick={() => onNavigate('report')}
              >
                Report an Issue
              </button>
            </div>
          ) : (
            <div className="reports-grid">
              {filteredReports.map((report) => (
                <div key={report.id} className="report-card">
                  <div className="report-header">
                    <div className="report-priority">
                      <span className="priority-icon">{getPriorityIcon(report.priority)}</span>
                      <span 
                        className="priority-label"
                        style={{ color: getPriorityColor(report.priority) }}
                      >
                        {report.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="report-category">{report.category}</div>
                  </div>

                  {report.imageUrl && (
                    <div className="report-image">
                      <img src={report.imageUrl} alt={report.title} />
                    </div>
                  )}

                  <div className="report-content">
                    <h4 className="report-title">{report.title}</h4>
                    <p className="report-description">{report.description}</p>
                    
                    <div className="report-meta">
                      <div className="report-location">
                        <span className="meta-icon">📍</span>
                        {report.location}
                      </div>
                      <div className="report-date">
                        <span className="meta-icon">📅</span>
                        {new Date(report.submitDate).toLocaleDateString()}
                      </div>
                      <div className="report-author">
                        <span className="meta-icon">👤</span>
                        {report.submittedBy}
                      </div>
                    </div>
                  </div>

                  <div className="report-actions">
                    <div className="vote-section">
                      <button 
                        className={`vote-button ${report.hasVoted ? 'voted' : ''}`}
                        onClick={() => handleVote(report.id)}
                        disabled={report.hasVoted}
                      >
                        <span className="vote-icon">
                          {report.hasVoted ? '✅' : '👍'}
                        </span>
                        <span className="vote-text">
                          {report.hasVoted ? 'Voted' : 'Vote for Urgency'}
                        </span>
                      </button>
                      <div className="vote-count">
                        <span className="votes-number">{report.urgencyVotes}</span>
                        <span className="votes-label">votes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="community-cta">
          <h3>Don't see your issue?</h3>
          <p>Report a new issue in your community and help others stay informed</p>
          <button 
            className="primary-button"
            onClick={() => onNavigate('report')}
          >
            <span>📝</span>
            Report New Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityScreen;
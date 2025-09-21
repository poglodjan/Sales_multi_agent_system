import React from 'react';
import './AgentStyles.css';

import { useNavigate } from 'react-router-dom';
import ag_blue from './assets/ag_blue.png';
import logo from './assets/logo.png';

const SalesAgent = () => {
  const navigate = useNavigate();
  return (
    <div className="dashboard">
    <div className="sidebar">
            <div className="logo-img">
              <img src={logo} width={200} height={50} alt="OmniAgent Logo" />
            </div>
            
            <ul className="main-menu">
              <li onClick={() => navigate('/sales-agent')} className="active">OmniAgent</li>
              <li onClick={() => navigate('/') }>Dashboard</li>
              <li>Products</li>
              <li>Videos</li>
              <li>Stores</li>
              <li>Marketing</li>
              <li>Tasks</li>
              <li>Reports QA</li>
              <li>Analytics</li>
              <li>Settings</li>
              <li>Users</li>
              <li>Clients</li>
            </ul>
          </div>
    
    <div className="dashboard-container">
      {/* Header */}
      <div class="header">
          <div class="header-text">
              <div class="greeting">Hello, John</div>
              <div class="main-title">How can I help you today?</div>
          </div>
          <img 
              src={ag_blue} 
              alt="User" 
              className="avatar-img"
          />
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Buttons */}
        <div className="top-buttons">
          <button onClick={() => navigate('/chat')} className="top-button">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="2" y="3" width="12" height="2" rx="1"/>
              <rect x="2" y="7" width="12" height="2" rx="1"/>
              <rect x="2" y="11" width="12" height="2" rx="1"/>
            </svg>
            Daily brief
          </button>
          <button className="top-button">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 3h12v1H2V3zm0 3h12v1H2V6zm0 3h12v1H2V9zm0 3h12v1H2v-1z"/>
              <path d="M1 2h14v12H1V2z" fill="none" stroke="currentColor"/>
            </svg>
            Main KPIs
          </button>
          <button className="top-button">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1L9.2 5.4L14 6L9.2 6.6L8 11L6.8 6.6L2 6L6.8 5.4L8 1Z"/>
            </svg>
            Challenges
          </button>
          <button className="top-button">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1L10 6L15 8L10 10L8 15L6 10L1 8L6 6L8 1Z"/>
            </svg>
            Highlights
          </button>
        </div>

        {/* Explore More Section */}
        <div className="section-header">
          <h3 className="section-title">- Explore more prompt suggestions -</h3>
        </div>

        {/* Grid Cards */}
        <div className="cards-grid">
          <div className="card">
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z"/>
              </svg>
            </div>
            <h4 className="card-title">
              Performance overview by area managers & district manager
            </h4>
            <p className="card-description">Show summary page</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z"/>
              </svg>
            </div>
            <h4 className="card-title">Category KPIs for all stores</h4>
            <p className="card-description">Show the KPIs</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z"/>
              </svg>
            </div>
            <h4 className="card-title">Trends & highlights for store performance</h4>
            <p className="card-description">Show store performance</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z"/>
              </svg>
            </div>
            <h4 className="card-title">Suggestions for task schedule & prioritization</h4>
            <p className="card-description">Show tasks</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z"/>
              </svg>
            </div>
            <h4 className="card-title">Sales & profit impact trends</h4>
            <p className="card-description">Show impact trends</p>
          </div>
        </div>

        <div class="search-container">
        <input type="text" class="search-input" placeholder="Ask Sales Al Agent..."></input>
        <button class="send-button">
            <span class="send-icon">➤</span>
        </button>
      </div>

      </div>

    </div>
  </div>
  );
};

export default SalesAgent;
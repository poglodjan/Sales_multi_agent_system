import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

import ag_yellow from './assets/ag_yellow.png';
import ag_blue from './assets/ag_blue.png';
import ag_green from './assets/ag_green.png';
import ag_red from './assets/ag_red.png';
import ag_purple from './assets/ag_purple.png';
import ag_orange from './assets/ag_orange.png';
import ag_gray from './assets/ag_grey.png';
import ag_turc from './assets/ag_turc.png';
import logo from './assets/logo.png';

const Dashboard = () => {
  const navigate = useNavigate();

  const agents = [
    { id: 1, name: 'Sales', color: '#4e73df', image: ag_blue },
    { id: 2, name: 'Merchandise', color: '#1cc88a', image: ag_green },
    { id: 3, name: 'Operations', color: '#36b9cc', image: ag_turc },
    { id: 4, name: 'Area Manager', color: '#f6c23e', image: ag_yellow },
    { id: 5, name: 'Marketing', color: '#e74a3b', image: ag_red },
    { id: 6, name: 'IT', color: '#6f42c1', image: ag_purple },
    { id: 7, name: 'CFO', color: '#fd7e14', image: ag_orange },
    { id: 8, name: 'CEO', color: '#5a5c69', image: ag_gray }
  ];

  const handleAgentClick = (agentName) => {
    if (agentName === 'Sales') {
      navigate('/sales-agent');
    }
    if (agentName === 'Merchandise') {
      navigate('/marketing-agent');
    }
    // Tutaj można dodać przekierowania dla innych agentów
  };

  return (
    <div className="dashboard">
      {/* Pasek nawigacyjny po lewej */}
      <div className="sidebar">
        <div className="logo-img">
          <img src={logo} width={200} height={50} alt="OmniAgent Logo" />
        </div>
        
        <ul className="main-menu">
          <li onClick={() => navigate('/sales-agent')} >OmniAgent</li>
          <li onClick={() => navigate('/') } className="active">Dashboard</li>
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
      
      {/* Główna zawartość z kafelkami agentów */}
      <div className="main-content">
        <div className="content-header">
          <h2>Choose your OmniAgent</h2>
        </div>
        
        <div className="agents-grid">
          {agents.map(agent => (
            <div 
              key={agent.id} 
              className="agent-card"
              style={{ borderTop: `4px solid ${agent.color}` }}
              onClick={() => handleAgentClick(agent.name)}
            >
              <div className="agent-image">
                <img src={agent.image} alt={agent.name} />
              </div>
              <div className="agent-name">{agent.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
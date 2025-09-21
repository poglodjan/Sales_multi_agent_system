import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import SalesAgent from './SalesAgent';
import MarketAgent from './MarketAgent';
import ChatDetail from './ChatDetail';
import Chat from './Chat';
import './index.css'; // jeśli używasz Tailwinda lub własnych styli

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat-detail" element={<ChatDetail />} />
          <Route path="/sales-agent" element={<SalesAgent />} />
          <Route path="/marketing-agent" element={<MarketAgent />} />
        </Routes>
      </div>
    </Router>
  );
}

const root = document.getElementById('root');
createRoot(root).render(<App />);
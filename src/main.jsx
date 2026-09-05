import React from 'react';
import { createRoot } from 'react-dom/client';
import FriendlyDashboard from './FriendlyDashboard.jsx';
import './styles.css';
import './friendly.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FriendlyDashboard />
  </React.StrictMode>,
);

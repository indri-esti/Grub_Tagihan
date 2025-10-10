import React from 'react';
import { Link } from 'react-router-dom';
import './sidnav.css'; 

const Sidnav = () => {
  return (
    <div className="sidnav">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link">
            📊 Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/tagihan" className="nav-link">
            💰 Tagihan
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/jenis-tagihan" className="nav-link">
            📋 Jenis Tagihan
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/team" className="nav-link">
            👥 Team
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidnav;
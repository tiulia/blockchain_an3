import React from 'react';
import '../styles/Info.css';

const Info = ({ message, onClose }) => {
  return (
    <div className="info">
      <div className="info-content">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default Info;
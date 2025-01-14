import React from 'react';

export const Info = ({ type, message, onClose }) => {
  const MAX_LENGTH = 150;

  return (
    <div className={`info-container ${type === "error" ? "error" : ""}`} >
      <div >
        {message.length > MAX_LENGTH
          ? `${message.substring(0, MAX_LENGTH)}...`
          : message}

      </div>
      <div>
        <button style={{
          width: '100px',
          textAlign: 'center',
        }} onClick={onClose}>OK</button>
      </div>
    </div>
  );
};


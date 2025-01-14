import React, { useState } from 'react';

const Signup = ({ onClose, signup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signup(username, password);
    onClose();
  };

  return (
    <div className="login-container">
      <div className="input-container">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          <button onClick={handleLogin}>Create wallet</button>
          <button onClick={onClose}>Back to login</button>
        </div>
      </div>


    </div>
  );
};

export default Signup;

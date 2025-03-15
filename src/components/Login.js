import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    const success = handleLogin(username, password);
    
    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password');
      setPassword(''); // Clear password on failure
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login to EZTech Store</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          
          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="login-button"
          >
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>
        </form>        
      </div>
    </div>
  );
};

export default Login;

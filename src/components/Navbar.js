import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Custom hook for login form logic
const useLoginForm = (handleLogin) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const resetForm = useCallback(() => {
    setUsername('');
    setPassword('');
    setLoginError('');
    setIsLoggingIn(false);
  }, []);
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    
    const success = handleLogin(username, password);
    
    if (success) {
      resetForm();
      return true;
    } else {
      setLoginError('Invalid username or password');
      setPassword(''); // Clear password on failure for security
      setIsLoggingIn(false);
      return false;
    }
  }, [handleLogin, username, password, resetForm]);
  
  return {
    username, setUsername,
    password, setPassword,
    isLoggingIn,
    loginError,
    handleSubmit,
    resetForm
  };
};

const Navbar = ({ cartCount, user, handleLogin, handleLogout }) => {
  const [showLogin, setShowLogin] = useState(false);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const loginButtonRef = useRef(null);
  
  const {
    username, setUsername,
    password, setPassword,
    isLoggingIn,
    loginError,
    handleSubmit,
    resetForm
  } = useLoginForm(handleLogin);

  const closeModal = useCallback(() => {
    setShowLogin(false);
    resetForm();
  }, [resetForm]);

  const openModal = useCallback(() => {
    setShowLogin(true);
  }, []);

  // Handle modal keyboard events (Escape key)
  useEffect(() => {
    if (showLogin) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showLogin, closeModal]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };
    
    if (showLogin) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLogin, closeModal]);

  // Focus management
  useEffect(() => {
    if (showLogin && firstInputRef.current) {
      firstInputRef.current.focus();
    } else if (!showLogin && loginButtonRef.current) {
      loginButtonRef.current.focus();
    }
  }, [showLogin]);

  const handleLoginSubmit = useCallback((e) => {
    const success = handleSubmit(e);
    if (success) {
      closeModal();
    }
  }, [handleSubmit, closeModal]);

  return (
    <nav className="navbar">
      <h1>EZTech Store</h1>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
        {user ? (
          <>
            <Link to="/saved-cards" className="nav-link">Payment Info</Link>
            <button 
              onClick={handleLogout} 
              className="nav-button" 
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={openModal} 
            className="nav-button" 
            aria-label="Login"
            ref={loginButtonRef}
          >
            Login
          </button>
        )}
      </div>

      {showLogin && (
        <div 
          className="login-modal-overlay" 
          role="dialog" 
          aria-modal="true"
          aria-labelledby="login-modal-title"
        >
          <div 
            className="login-content" 
            ref={modalRef}
            tabIndex={-1}
          >
            <h2 id="login-modal-title">Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input 
                  id="username"
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  ref={firstInputRef}
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
              
              {loginError && (
                <p 
                  className="error-message" 
                  role="alert" 
                  aria-live="assertive"
                >
                  {loginError}
                </p>
              )}
              
              <div className="button-group">
                <button 
                  type="submit" 
                  disabled={isLoggingIn}
                  className="primary-button"
                >
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </button>
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="secondary-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

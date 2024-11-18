// src/components/Login.js
import React, { useState } from 'react';
import { signInWithGoogle } from '../hooks/useAuth';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [stack, setStack] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleLogin = async () => {
    setIsLoading(true); // Set loading state to true
    const user = await signInWithGoogle();
    setIsLoading(false); // Set loading state to false after the login process

    if (user && stack) onLogin(stack);  // Pass stack to parent component
  };

  return (
    <div className="moving-gradient-background" style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-container">
        <div className="login-card">
          <h2 className="title">AI-Powered Roadmap Generator</h2>
          <input
            type="text"
            placeholder="Enter your stack (e.g., frontend)"
            value={stack}
            onChange={(e) => setStack(e.target.value)}
            className="stack-input"
          />
          <button
            onClick={handleLogin}
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading} // Disable the button while loading
          >
            {isLoading ? <div className="spinner"></div> : "Enter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import Login from './components/Login';
import Roadmap from './components/Roadmap';
import './App.css'; // Import the global styles

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedStack, setSelectedStack] = useState('');

  const handleLogin = (stack) => {
    setSelectedStack(stack);
    setIsLoggedIn(true);
  };

  return (
    <div className="app-background">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="roadmap-container">
          <Roadmap stack={selectedStack} />
        </div>
      )}
    </div>
  );
};

export default App;

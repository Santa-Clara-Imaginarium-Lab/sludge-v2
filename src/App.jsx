import "./App.css";
import { useNavigate } from 'react-router-dom';
import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [companionContent, setCompanionContent] = useState(false);
  const [subtitles, setSubtitles] = useState(false);

  return (
    <AppContext.Provider value={{ companionContent, setCompanionContent, subtitles, setSubtitles }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

function App() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = e.target.value;
    setUserId(value);
    localStorage.setItem('userId', value); 
  };

  const handleNavigate = () => {
    if (!userId) {
      alert("Please enter your participant ID.");
      return;
    }
    navigate('/setup');
  };

  return (
      <div className="container">
        <h1>Sludge V2</h1>
        <form onSubmit={handleSubmit} className="login-form">
            <input
              className="userid-input"
              type="text"
              placeholder="Enter your participant ID"
              value={userId}
              onChange={handleSubmit}
            />
          </form>
        <button className="submit-button" onClick={handleNavigate}>Login</button>
      </div>
  );
}

export default App;

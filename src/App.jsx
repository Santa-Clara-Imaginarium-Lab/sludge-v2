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

  const handleNavigate = () => {
    navigate('/setup');
  };

  return (
      <div className="App">
        <h1>Sludge V2</h1>
        <button className="button" onClick={handleNavigate}>Setup Page - for researcher</button>
      </div>
  );
}

export default App;

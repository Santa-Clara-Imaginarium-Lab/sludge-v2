import React from 'react';
import { useNavigate } from 'react-router-dom';

const PreTestSurvey = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/studypart');
  };

  return (
    <div>
      <h1>Pre Test Survey</h1>
      <button className="button" onClick={handleNavigate}>Study</button>
    </div>
  );
};

export default PreTestSurvey;
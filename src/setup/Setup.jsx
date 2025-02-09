import React from 'react';
import { useNavigate } from 'react-router-dom';

const Setup = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/pretestsurvey');
  };

  return (
    <div>
      <h1>Setup Page</h1>
      <button className="button" onClick={handleNavigate}>PreTest Survey</button>
    </div>
  );
};

export default Setup;
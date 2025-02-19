import React from 'react';
import '../postTestSurvey/PostTestSurvey.css'; 
import { useNavigate } from 'react-router-dom';

function Exit() {
    const navigate = useNavigate();
  
    const handleNavigate = () => {
      navigate('/');
    };
    
    return (
        <div className="container">
            <button className="submit-button" onClick={handleNavigate}>Exit</button>
        </div>
    );
}

export default Exit;
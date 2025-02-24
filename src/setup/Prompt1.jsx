import React from 'react';
import '../postTestSurvey/PostTestSurvey.css'; 
import { useNavigate } from 'react-router-dom';

function Prompt1() {
    const navigate = useNavigate();
  
    const handleNavigate = () => {
      navigate('/socialmedia1');
    };
    
    return (
        <div className="container">
            <h1>Take the Pre-Test Survey</h1>
            <button className="submit-button" onClick={handleNavigate}>Proceed</button>
        </div>
    );
}

export default Prompt1;
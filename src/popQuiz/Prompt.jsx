import React from 'react';
import '../postTestSurvey/PostTestSurvey.css'; 
import { useNavigate } from 'react-router-dom';

function Prompt() {
    const navigate = useNavigate();
  
    const handleNavigate = () => {
      navigate('/quiznav');
    };
    
    return (
        <div className="container">
            <h1>Please call the researcher for further instructions before proceeding</h1>
            <button className="submit-button" onClick={handleNavigate}>Proceed</button>
        </div>
    );
}

export default Prompt;
import React from 'react';
import '../postTestSurvey/PostTestSurvey.css'; 
import { useNavigate } from 'react-router-dom';

function QuizNav() {
    const navigate = useNavigate();
  
    const handleNavigate = () => {
      navigate('/popquiz');
    };
    
    return (
        <div className="container">
            {/* <h1>Pop Quiz</h1> */}
            <button className="submit-button" onClick={handleNavigate}>Let's Begin</button>
        </div>
    );
}

export default QuizNav;
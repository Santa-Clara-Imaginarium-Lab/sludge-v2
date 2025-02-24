import React from 'react';
import '../postTestSurvey/PostTestSurvey.css'; 
import { useNavigate } from 'react-router-dom';
import stopSign from '../image/STOP.jpg';

function Prompt3() {
    const navigate = useNavigate();
  
    const handleNavigate = () => {
      navigate('/quiznav');
    };
    
    return (
        <div className="container">
            <h1 style={{ color: "red", fontSize: "2rem" }}>STOP</h1>
            <img 
                src={stopSign} 
                alt="Stop Sign" 
                style={{ width: "150px", height: "150px", marginBottom: "20px" }} 
            />
            <h1>Please call the researcher for further instructions before proceeding</h1>
            <button className="submit-button" onClick={handleNavigate}>Proceed</button>
        </div>
    );
}

export default Prompt3;
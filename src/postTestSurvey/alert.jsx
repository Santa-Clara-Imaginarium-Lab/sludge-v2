import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../preTestSurvey/PreTestSurvey.css';
import stopImage from '../image/STOP.jpg'; // Update with the correct path

const StopPage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/videoengagement");
  };

  return (
    <div className="stop-container">
      <h1 style={{ color: "red", fontSize: "2rem" }}>STOP</h1>
            <img 
                src={stopImage} 
                alt="Stop Sign" 
                style={{ width: "150px", height: "150px", marginBottom: "20px" }} 
            />
        <h1>Please call the researcher for further instructions before proceeding</h1>
        <button className="submit-button1" onClick={handleNavigate}>
            Done
        </button>
      
    </div>
  );
};

export default StopPage;
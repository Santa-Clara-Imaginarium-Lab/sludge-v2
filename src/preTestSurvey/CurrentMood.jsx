import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import './PreTestSurvey.css';

const CurrentMood = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState('');
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');
  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!mood.trim()) {
        setError('Please enter your answer.');
        return; 
    }

    setError('');

    try {
      const response = await fetch('https://sludge-v2.onrender.com/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId, mood }),
      });

      if (response.ok) {
        navigate('/prompt2');
      } else {
        setError('Failed to record mood');
      }
    } catch (error) {
      setError('Error submitting mood. Please try again later.');
    }
  };


  return (
      <div className="container">
        <h1 className='title'>How would you describe your current mood?</h1>
            <input
              className="text-input"
              type="text"
              placeholder="Enter your answer here"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            />
        {error && <div className="error-message">{error}</div>}
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
  );
};

export default CurrentMood;

import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import './PreTestSurvey.css';

const CurrentMood = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState('');
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(false);

  const options = [
    "Very unwell",
    "Somewhat unwell",
    "Neutral",
    "Somewhat well",
    "Very well"
  ]

  const handleSubmitOption = (mood) => {
    setMood(mood);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mood.trim()) {
        setError('Please enter your answer.');
        return; 
    }

    setError('');
    setLoading(true);
    try {
      const response = await fetch('https://sludge-v2.up.railway.app/mood', {
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
    setLoading(false);
  };


  return (                 
    <div className="container">
      <div className="social-qualtrix-container">
        <h1 className="social-title">How would you describe your current mood?</h1>
        <div className="mood-grid">
          <div className="qualtrix-grid-header">
            <div className="header-empty"></div>
            {options.map((option, index) => (
              <div key={index} className="option-header">
                {option}
              </div>
            ))}
          </div>
          {
            <div className="qualtrix-row">
              <div></div>
              {options.map((option, optionIndex) => (
                <label key={optionIndex} className="circle-container">
                  <input
                    type="radio"
                    name={"mood"}
                    value={option}
                    checked={mood === option}
                    onChange={() => handleSubmitOption(option)}
                  />
                  <span className="circle"></span>
                </label>
              ))}
            </div>
          }
        </div>
        {error && <div className="error-message">{error}</div>}
        <button className="submit-button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default CurrentMood;

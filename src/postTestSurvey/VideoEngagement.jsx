import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../preTestSurvey/PreTestSurvey.css';

const survey = [
  {
    statement: "To what degree did you find this video engaging or not engaging?",
    options: [
      "Not at all engaging",
      "Slightly not engaging",
      "Somewhat not engaging",
      "Neutral",
      "Somewhat engaging",
      "Quite engaging",
      "Extremely engaging"
    ]
  },
  {
    statement: "To what degree did you find this video satisfying or not satisfying?",
    options: [
      "Very unsatisfying",
      "Unsatisfying",
      "Slightly unsatisfying",
      "Neutral",
      "Slightly satisfying",
      "Satisfying",
      "Very satisfying"
    ]
  },
  {
    statement: "How easy or difficult is it to understand the content in the video?",
    options: [
      "Extremely Difficult",
      "Very Difficult",
      "Moderately Difficult",
      "Neutral",
      "Moderately Easy",
      "Very Easy",
      "Extremely Easy"
    ]
  },
];

const VideoEngagement = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleOptionChange = (selectedOption) => {
    const updatedResponses = [...responses];
    updatedResponses[currentIndex] = selectedOption;
    setResponses(updatedResponses);
  };

  const handleSubmit = async () => {
    if (!responses[currentIndex]) {
      setError("Please select an option before proceeding.");
      return;
    }
    setError('');
    setLoading(true);
    if (currentIndex < survey.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Send the collected responses to the API
      const userId = localStorage.getItem("userId");
      try {
        const response = await fetch("https://sludge-v2.up.railway.app/videoengagement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, responses }),
        });

        const data = await response.json();
        if (data.success) {
          console.log("Video Engagement survey submitted successfully!");
          navigate('/demographicques1');
        } else {
          setError("Error submitting survey. Please try again.");
        }
      } catch (error) {
        console.error("Network Error:", error);
        setError("Network error. Try again later.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="qualtrix-container">
        <h1 className="title">Video Engagement and Satisfaction</h1>
        <p className="description">Regarding the video you just watched,</p>
        <div className="videoengagement-grid">
          <div className="qualtrix-grid-header">
            <div className="header-empty"></div>
            {survey[currentIndex].options.map((option, index) => (
              <div key={index} className="option-header">
                {option}
              </div>
            ))}
          </div>
          <div className="qualtrix-row">
            <div className="statement">{survey[currentIndex].statement}</div>
            {survey[currentIndex].options.map((option, optionIndex) => (
              <label key={optionIndex} className="circle-container">
                <input
                  type="radio"
                  name={`statement-${currentIndex}`}
                  value={option}
                  checked={responses[currentIndex] === option}
                  onChange={() => handleOptionChange(option)}
                />
                <span className="circle"></span>
              </label>
            ))}
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <button className="submit-button" onClick={handleSubmit} disabled={loading}>
         {loading ? "Submitting..." : (currentIndex < survey.length - 1 ? "Next" : "Submit")}
        </button>
      </div>
    </div>
  );
};

export default VideoEngagement;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../preTestSurvey/PreTestSurvey.css';

const statements = [
  "Question 1",
  "Question 2",
  "Question 3",
  "Question 4",
];

const options = [
  "Strongly Disagree",
  "Disagree",
  "Somewhat Disagree",
  "Neutral",
  "Somewhat Agree",
  "Agree",
  "Strongly Agree"
];

const PostTestSurvey = () => {
  const [responses, setResponses] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (statementIndex, selectedOption) => {
    setResponses({
      ...responses,
      [statementIndex]: selectedOption,
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(responses).length < statements.length) {
      setError("Please select an option for each statement.");
      return;
    }
    setError('');
    setLoading(true);

    const userId = localStorage.getItem("userId");
  
    const formattedResponses = statements.map((_, index) => responses[index] || "N/A");
  
  
    try {
      const response = await fetch("https://sludge-v2.onrender.com/submit-post-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, responses: formattedResponses }),
      });
  
      const data = await response.json();
      if (data.success) {
        console.log("Post-Test Survey submitted successfully!");
        navigate('/exit');
      } else {
        setError("Error submitting survey. Please try again.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      setError("Network error. Try again later.");
    }
  
    setLoading(false);
  };

  return (
      <div className="container">
      <div className="qualtrix-container">
        <h1 className="title">Post Test Survey</h1>
        <p className="description">
          Please indicate the extent to which you agree or disagree with the following statements.
        </p>
        <div className="qualtrix-grid">
          <div className="qualtrix-grid-header">
            <div className="header-empty"></div>
            {options.map((option, index) => (
              <div key={index} className="option-header">
                {option}
              </div>
            ))}
          </div>
          {statements.map((statement, statementIndex) => (
            <div key={statementIndex} className="qualtrix-row">
              <div className="statement">{statement}</div>
              {options.map((option, optionIndex) => (
                <label key={optionIndex} className="circle-container">
                  <input
                    type="radio"
                    name={`statement-${statementIndex}`}
                    value={option}
                    checked={responses[statementIndex] === option}
                    onChange={() => handleOptionChange(statementIndex, option)}
                  />
                  <span className="circle"></span>
                </label>
              ))}
            </div>
          ))}
        </div>
        {error && <div className="error-message">{error}</div>}
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
);
};

export default PostTestSurvey;
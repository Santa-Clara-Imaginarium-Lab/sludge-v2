import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../PreTestSurvey.css';

const statements = [
  "I have difficulty slowing my thoughts down and focusing on one thing at a time.",
  "I find it difficult to think clearly, as if my mind is in a fog.",
  "I find myself flitting back and forth between different thoughts.",
  "I use alcohol or other drugs to slow down my thoughts and stop constant 'mental chatter'.",
  "I can only focus my thoughts on one thing at a time with considerable effort."
];

const options = [
    "Not at all or rarely",
    "Some of the time",
    "Most of the time",
    "Nearly all of the time or constantly"
  ];

const MEWS3 = () => {
  const [responses, setResponses] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");

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

    try {
      const response = await fetch("https://sludge-v2.up.railway.app/mews3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, responses: Object.values(responses) }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Survey submitted successfully!");
        navigate('/mood');
      } else {
        setError("Error submitting survey. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Network error. Try again later.");
    }

    setLoading(false);
  };

  return (
      <div className="container">
      <div className="qualtrix-container">
        <h1 className="title">MEWS: Mind Excessively Wandering Scale</h1>
        <p className="description">
          Please select the option that best reflects your experience for each statement.
        </p>
        <div className="mews-grid">
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
        <button className="submit-button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
);
};

export default MEWS3;
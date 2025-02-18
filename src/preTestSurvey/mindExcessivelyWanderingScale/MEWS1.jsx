import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../PreTestSurvey.css';

const statements = [
  "I have difficulty controlling my thoughts.",
  "I find it hard to switch my thoughts off.",
  "I have two or more different thoughts going on at the same time.",
  "My thoughts are disorganised and 'all over the place'.",
  "My thoughts are 'on the go' all the time."
];

const options = [
  "Not at all or rarely",
  "Some of the time",
  "Most of the time",
  "Nearly all of the time or constantly"
];

const MEWS1 = () => {
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
    console.log("Sending Data:", { userId, responses: formattedResponses });

    try {
      const response = await fetch("https://sludge-v2.onrender.com/mews1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, formattedResponses }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Survey submitted successfully!");
        navigate('/mews2');
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

export default MEWS1;
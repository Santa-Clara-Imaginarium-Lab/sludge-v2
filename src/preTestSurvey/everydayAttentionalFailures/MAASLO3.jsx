import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../PreTestSurvey.css';

const statements = [
    "I find myself listening to someone with one ear, doing something else at the same time.",
    "I drive places on “automatic pilot” and then wonder why I went there.",
    "I find myself preoccupied with the future or the past.",
    "I find myself doing things without paying attention.",
    "I snack without being aware that I’m eating."
];

const options = [
  "Almost Always",
  "Very Frequently",
  "Somewhat Frequently",
  "Somewhat Infrequently",
  "Very Infrequently",
  "Almost Never"
];

const MAASLO3 = () => {
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
      const response = await fetch("https://sludge-v2.up.railway.app/maaslo3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, responses: Object.values(responses) }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Survey submitted successfully!");
        navigate('/mews1');
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
        <p className="description">
          Please select the option that best reflects your experience for each statement.
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
        <button className="submit-button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default MAASLO3;
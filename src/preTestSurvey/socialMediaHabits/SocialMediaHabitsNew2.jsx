import React, {useState} from 'react';
import './SocialMediaHabits.css'; 
import { useNavigate } from 'react-router-dom';

const statements = [
  "Social interaction",
  "Information seeking",
  "Passing time",
  "Entertainment",
  "Relaxation",
  "Expression of opinions",
  "Information sharing",
  "Knowledge of others",
  "Multitasking"
];

const options = [
  "1",
  "2",
  "3",
  "4",
  "5",
];

function SocialMediaHabitsNew2() {
    const navigate = useNavigate();

    const [responses, setResponses] = useState({});
    const [error, setError] = useState('');
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
        const response = await fetch("https://sludge-v2.onrender.com/socialmedia2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, formattedResponses }),
        });
  
        const data = await response.json();
        if (data.success) {
          console.log("Survey submitted successfully!");
          navigate('/maaslo1');
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
          <h1 className="social-title">To what degree do you spend doing these actions on social media?</h1>
          <div className="social-grid">
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
                <div className="social-statement">{statement}</div>
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
          <button className="social-submit-button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    );
}

export default SocialMediaHabitsNew2;
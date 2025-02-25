import React, {useState} from 'react';
import './PostTestSurvey.css'; 
import { useNavigate } from 'react-router-dom';

function DemographicQuestion1() {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('');
    const [showError, setShowError] = useState(false);
    const [showError2, setShowError2] = useState(false);
    const userId = localStorage.getItem('userId'); 
    const [loading, setLoading] = useState(false);
    
    const handleOptionChange = (event) => {
      const value = event.target.value;
      setSelectedOption(value);
      setShowError(false); 

      if (value !== "Other") {
        document.querySelector('.gender-input').value = ''; // Clear the textbox
      }
    };

    const handleClick = async () => {
      if (!selectedOption) {
        setShowError(true);
        return;
      }
      if (selectedOption === "Other" && !document.querySelector('.gender-input').value) {
        setShowError2(true); 
        return;
      }
      setLoading(true);
      const gender = selectedOption === "Other" ? document.querySelector('.gender-input').value : selectedOption;

      const dataToSend = {
        userId,
        gender
      };
      console.log("Data to send:", dataToSend); 

      try {
        const response = await fetch(`https://sludge-v2.up.railway.app/demographicques1`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          throw new Error('Failed to save demographic data');
        }

        console.log("Demographic data saved successfully");
        navigate('/demographicques2'); // Navigate after successful submission
      } catch (error) {
        console.error('Error saving demographic data:', error);
        setShowError(true); // Optionally show an error message
      }
      setLoading(false);
    };

    return (
        <div className="container">
          <div className='demographic-container'>
          <h2 className="brief-subtitle">Which of the following best describes your gender identity?</h2>
          <div className="demographic-options">
          <label className="demographic-option">
              <input
                type="radio"
                value="Man"
                checked={selectedOption === "Man"}
                onChange={handleOptionChange}
              />
              <span className="demographic-circle"></span>
              <p>Man</p>
            </label>

            <label className="demographic-option">
              <input
                type="radio"
                value="Woman"
                checked={selectedOption === "Woman"}
                onChange={handleOptionChange}
              />
              <span className="demographic-circle"></span>
              <p>Woman</p>
            </label>

            <label className="demographic-option">
              <input
                type="radio"
                value="Genderfluid"
                checked={selectedOption === "Genderfluid"}
                onChange={handleOptionChange}
              />
              <span className="demographic-circle"></span>
              <p>Non-binary, genderfluid, or gender non-conforming</p>
            </label>

            <label className="demographic-option">
              <input
                type="radio"
                value="Transgender"
                checked={selectedOption === "Transgender"}
                onChange={handleOptionChange}
              />
              <span className="demographic-circle"></span>
              <p>Transgender</p>
            </label>

            <label className="demographic-option">
              <input
                type="radio"
                value="Other"
                checked={selectedOption === "Other"}
                onChange={handleOptionChange}
              />
              <span className="demographic-circle"></span>
              <p>Other (Please specify)</p>
              <input
                type="text"
                className="gender-input"
                onChange={(e) => {
                  handleOptionChange({ target: { value: "Other" } }); // Keep "Other" selected
                }}
              />
            </label>
          </div>
          {showError && <p className="error-message">Please select an option before proceeding.</p>}
          {showError2 && <p className="error-message">Please specify an answer before proceeding.</p>}
          <button className="submit-button" onClick={handleClick} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          </div>
        </div>
      );
}

export default DemographicQuestion1;
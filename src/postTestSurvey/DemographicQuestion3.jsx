import React, {useState} from 'react';
import './PostTestSurvey.css'; 
import { useNavigate } from 'react-router-dom';

function DemographicQuestion3() {
    const navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [showError, setShowError] = useState(false);
    const [showError2, setShowError2] = useState(false);
    const [otherText, setOtherText] = useState('');
    const userId = localStorage.getItem('userId'); 

    const handleOptionChange = (event) => {
      const value = event.target.value;
      setShowError(false); 

      setSelectedOptions(prev => 
        prev.includes(value) ? prev.filter(option => option !== value) : [...prev, value]
      );

      if (value === "Other") {
        setOtherText('');
      }
    };

    const handleClick = async () => {
      if (selectedOptions.length === 0) { 
        setShowError(true);
        return;
      }

      if (selectedOptions.includes("Other") && !otherText) {
        setShowError2(true); 
        return;
      }

      const finalEthnicity = selectedOptions.includes("Other") 
        ? [...selectedOptions.filter(option => option !== "Other"), otherText] 
        : selectedOptions;

      const dataToSend = {
        userId,
        ethnicity: finalEthnicity
      };
      try {
        const response = await fetch(`https://sludge-v2.onrender.com/demographicques3`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          throw new Error('Failed to update demographic data');
        }

        console.log("Demographic data updated successfully");
        navigate('/demographicques4'); 
      } catch (error) {
        console.error('Error updating demographic data:', error);
        setShowError(true); 
      }
    };

    return (
        <div className="container tutorial-container">
          <div className='demographic-container'>
          <h2 className="brief-subtitle">Choose one or more races you consider yourself to be</h2>
          <div className="demographic-options">
            <label className="demographic-option">
              <input
                type="checkbox"
                value="White or Caucasian"
                checked={selectedOptions.includes("White or Caucasian")}
                onChange={handleOptionChange}
              />
              <p>White or Caucasian</p>
            </label>

            <label className="demographic-option">
              <input
                type="checkbox"
                value="Black or African American"
                checked={selectedOptions.includes("Black or African American")}
                onChange={handleOptionChange}
              />
              <p>Black or African American</p>
            </label>

            <label className="demographic-option">
              <input
                type="checkbox"
                value="Native American or Alaskan Native"
                checked={selectedOptions.includes("Native American or Alaskan Native")}
                onChange={handleOptionChange}
              />
              <p>Native American or Alaskan Native</p>
            </label>

            <label className="demographic-option">
              <input
                type="checkbox"
                value="Asian"
                checked={selectedOptions.includes("Asian")}
                onChange={handleOptionChange}
              />
              <p>Asian</p>
            </label>

            <label className="demographic-option">
              <input
                type="checkbox"
                value="Native Hawaiian or Other Pacific Islander"
                checked={selectedOptions.includes("Native Hawaiian or Other Pacific Islander")}
                onChange={handleOptionChange}
              />
              <p>Native Hawaiian or Other Pacific Islander</p>
            </label>

            <label className="demographic-option">
              <input
                type="checkbox"
                value="Middle Eastern or North African (MENA)"
                checked={selectedOptions.includes("Middle Eastern or North African (MENA)")}
                onChange={handleOptionChange}
              />
              <p>Middle Eastern or North African (MENA)</p>
            </label>

            <label className="demographic-option">
              <input
                type="checkbox"
                value="Other"
                checked={selectedOptions.includes("Other")}
                onChange={handleOptionChange}
              />
              <p>Other</p>
              <input
                type="text"
                className="gender-input"
                value={otherText}
                onChange={(e) => {
                  handleOptionChange({ target: { value: "Other" } });
                  setSelectedOptions(prev => [...prev, "Other"]);
                  setOtherText(e.target.value);
                }}
              />
            </label>

          </div>
          {showError && <p className="error-message">Please select at least one option before proceeding.</p>}
          {showError2 && <p className="error-message">Please specify an answer before proceeding.</p>}
          <button className="submit-button" onClick={handleClick}>Submit</button>
          </div>
        </div>
      );
}

export default DemographicQuestion3;
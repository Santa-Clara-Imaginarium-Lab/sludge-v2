import React, {useState} from 'react';
import './PostTestSurvey.css'; 
import { useNavigate } from 'react-router-dom';

function DemographicQuestion4() {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('');
    const [showError, setShowError] = useState(false);
    const userId = localStorage.getItem('userId'); 

    const handleOptionChange = (event) => {
      const value = event.target.value;
      setSelectedOption(value);
      setShowError(false); 
    };

    const handleClick = async () => {
      if (!selectedOption) {
        setShowError(true);
        return;
      }

      const dataToSend = {
        userId,
        academicYear: selectedOption
      };
      console.log("Data to send:", dataToSend); 

      try {
        const response = await fetch(`https://sludge-v2.onrender.com/demographicques4`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          throw new Error('Failed to save academic year data');
        }

        console.log("Academic year data saved successfully");
        navigate('/quiznav'); 
      } catch (error) {
        console.error('Error saving academic year data:', error);
        setShowError(true); 
      }
    };

    return (
        <div className="container">
          <div className='demographic-container'>
          <h2 className="brief-subtitle">What is your academic year?</h2>
          <div className="demographic-options">
          <label className="demographic-option">
              <input
                type="radio"
                value="Freshman"
                checked={selectedOption === "Freshman"}
                onChange={handleOptionChange}
              />
              <span className="demographic-circle"></span>
              <p>Freshman</p>
            </label>

            <label className="demographic-option">
              <input
                type="radio"
                value="Sophomore"
                checked={selectedOption === "Sophomore"}
                onChange={handleOptionChange}
              />
              <span className="demographic-circle"></span>
              <p>Sophomore</p>
            </label>

            <label className="demographic-option">
              <input
                type="radio"
                value="Junior"
                checked={selectedOption === "Junior"}
                onChange={handleOptionChange}
              />
              <span className="demographic-circle"></span>
              <p>Junior</p>
            </label>

            <label className="demographic-option">
              <input
                type="radio"
                value="Senior"
                checked={selectedOption === "Senior"}
                onChange={handleOptionChange}
              />
              <span className="demographic-circle"></span>
              <p>Senior</p>
            </label>

            <label className="demographic-option">
              <input
                type="radio"
                value="Graduate"
                checked={selectedOption === "Graduate"}
                onChange={handleOptionChange}
              />
              <span className="demographic-circle"></span>
              <p>Graduate</p>
            </label>
          </div>
          {showError && <p className="error-message">Please select an option before proceeding.</p>}
          <button className="submit-button" onClick={handleClick}>Submit</button>
          </div>
        </div>
      );
}

export default DemographicQuestion4;
import React, {useState} from 'react';
import './PostTestSurvey.css'; 
import { useNavigate } from 'react-router-dom';

function DemographicQuestion2() {
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);
    const [showError2, setShowError2] = useState(false);
    const [freeResponse, setFreeResponse] = useState(''); 
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);

    const handleFreeResponseChange = (event) => {
      setFreeResponse(event.target.value); 
    };

    const handleClick = async () => {
      if (!freeResponse) { 
        setShowError(true);
        setShowError2(false); 
        return;
      }
      setLoading(true);
      const freeResponseNum = Number(freeResponse);

      if (isNaN(freeResponseNum) || !Number.isInteger(freeResponseNum) || freeResponseNum < 0 || freeResponseNum > 120) {
        setShowError2(true);
        setShowError(false); 
        return;
      }

      setShowError(false);
      setShowError2(false);

      try {
        const response = await fetch(`https://sludge-v2.onrender.com/demographicques2`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            age: freeResponse, 
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update demographic data');
        }

        console.log("Demographic data updated successfully");
        navigate('/demographicques3'); 
      } catch (error) {
        console.error('Error updating demographic data:', error);
        setShowError(true); 
      }
      setLoading(false);
    };

    return (
        <div className="container tutorial-container">
          <div className='demographic-container'>
          <h2 className="brief-subtitle">What is your age?</h2>
          <div className="demographic-options">

            <label className="demographic-option">
              <input
                type="text"
                className="age-input"
                value={freeResponse}
                onChange={handleFreeResponseChange}
              />
            </label>
          </div>
          {showError && <p className="error-message">Please provide an answer before proceeding.</p>}
          {showError2 && <p className="error-message">Please provide a valid number.</p>}
          <button className="submit-button" onClick={handleClick} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          </div>
        </div>
      );
}

export default DemographicQuestion2;
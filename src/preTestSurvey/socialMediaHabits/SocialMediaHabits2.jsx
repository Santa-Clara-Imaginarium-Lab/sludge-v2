import React, {useState} from 'react';
import './SocialMediaHabits.css'; 
import { useNavigate } from 'react-router-dom';

function SocialMediaHabits2() {
    const navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [showError, setShowError] = useState(false);
    const userId = localStorage.getItem('userId'); 

    const handleOptionChange = (event) => {
      const value = event.target.value;
      setShowError(false); 

      setSelectedOptions([value]); // Update to allow only one selection
    };

    const handleClick = async () => {
      if (selectedOptions.length === 0) { 
        setShowError(true);
        return;
      }

      try {
        const response = await fetch("https://sludge-v2.onrender.com/social-media-habits-2", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            hours: selectedOptions,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update data');
        }

        console.log("Social media habits data updated successfully");
        navigate('/socialmediahabits3'); // Navigate after successful submission
      } catch (error) {
        console.error('Error updating Social media habits data:', error);
        setShowError(true); // Optionally show an error message
      }
    };

    return (                 
        <div className="container">
          <div className='survey-container'>
          <h2 className="brief-subtitle">How many hours per week do you estimate that you spend using social media?</h2>
          <div className="survey-options">

            <label className="survey-option">
              <input
                type="radio"
                value="0-5hrs"
                checked={selectedOptions.includes("0-5hrs")}
                onChange={handleOptionChange}
              />
              <span className="circle"></span>
              <p>0-5hrs</p>
            </label>

            <label className="survey-option">
              <input
                type="radio"
                value="5-10hrs"
                checked={selectedOptions.includes("5-10hrs")}
                onChange={handleOptionChange}
              />
              <span className="circle"></span>
              <p>5-10hrs</p>
            </label>

            <label className="survey-option">
              <input
                type="radio"
                value="10-15hrs"
                checked={selectedOptions.includes("10-15hrs")}
                onChange={handleOptionChange}
              />
              <span className="circle"></span>
              <p>10-15hrs</p>
            </label>

            <label className="survey-option">
              <input
                type="radio"
                value="15-20hrs"
                checked={selectedOptions.includes("15-20hrs")}
                onChange={handleOptionChange}
              />
              <span className="circle"></span>
              <p>15-20hrs</p>
            </label>

            <label className="survey-option">
              <input
                type="radio"
                value="20+hrs"
                checked={selectedOptions.includes("20+hrs")}
                onChange={handleOptionChange}
              />
              <span className="circle"></span>
              <p>20+hrs</p>
            </label>

          </div>
          {showError && <p className="error-message">Please select at least one option before proceeding.</p>}
          <button className="submit-button" onClick={handleClick}>Submit</button>
          </div>
        </div>
      );
}

export default SocialMediaHabits2;
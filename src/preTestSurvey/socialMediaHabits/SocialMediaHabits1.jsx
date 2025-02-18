import React, {useState} from 'react';
import './SocialMediaHabits.css'; 
import { useNavigate } from 'react-router-dom';

function SocialMediaHabits1() {
    const navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [showError, setShowError] = useState(false);
    const userId = localStorage.getItem('userId'); 

    const handleOptionChange = (event) => {
      const value = event.target.value;
      setShowError(false); 

      setSelectedOptions(prev => 
        prev.includes(value) ? prev.filter(option => option !== value) : [...prev, value]
      );
    };

    const handleClick = async () => {
      if (selectedOptions.length === 0) { 
        setShowError(true);
        return;
      }

      try {
        const response = await fetch("https://sludge-v2.onrender.com/social-media-habits-1", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            platforms: selectedOptions,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update data');
        }

        console.log("Social media habits data updated successfully");
        navigate('/socialmediahabits2'); // Navigate after successful submission
      } catch (error) {
        console.error('Error updating Social media habits data:', error);
        setShowError(true); // Optionally show an error message
      }
    };

    return (                 
        <div className="container">
          <div className='survey-container'>
          <h2 className="brief-subtitle">What social media platforms do you use to view videos?</h2>
          <div className="survey-options">
            <label className="checkbox">
              <input
                type="checkbox"
                value="TikTok"
                checked={selectedOptions.includes("TikTok")}
                onChange={handleOptionChange}
              />
              <p>TikTok</p>
            </label>

            <label className="survey-option">
              <input
                type="checkbox"
                value="Instagram"
                checked={selectedOptions.includes("Instagram")}
                onChange={handleOptionChange}
              />
              <p>Instagram</p>
            </label>

            <label className="survey-option">
              <input
                type="checkbox"
                value="SnapChat"
                checked={selectedOptions.includes("SnapChat")}
                onChange={handleOptionChange}
              />
              <p>SnapChat</p>
            </label>

            <label className="survey-option">
              <input
                type="checkbox"
                value="X"
                checked={selectedOptions.includes("X")}
                onChange={handleOptionChange}
              />
              <p>X</p>
            </label>

            <label className="survey-option">
              <input
                type="checkbox"
                value="Facebook"
                checked={selectedOptions.includes("Facebook")}
                onChange={handleOptionChange}
              />
              <p>Facebook</p>
            </label>

            <label className="survey-option">
              <input
                type="checkbox"
                value="YouTube"
                checked={selectedOptions.includes("YouTube")}
                onChange={handleOptionChange}
              />
              <p>YouTube</p>
            </label>

            <label className="survey-option">
              <input
                type="checkbox"
                value="Other"
                checked={selectedOptions.includes("Other")}
                onChange={handleOptionChange}
              />
              <p>Other</p>
            </label>

          </div>
          {showError && <p className="error-message">Please select at least one option before proceeding.</p>}
          <button className="submit-button" onClick={handleClick}>Submit</button>
          </div>
        </div>
      );
}

export default SocialMediaHabits1;
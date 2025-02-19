import React, {useState} from 'react';
import './SocialMediaHabits.css'; 
import { useNavigate } from 'react-router-dom';

function SocialMediaHabits3() {
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
        const response = await fetch("https://sludge-v2.onrender.com/social-media-habits-3", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            reasons: selectedOptions,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update data');
        }

        console.log("Social media habits data updated successfully");
        navigate('/maaslo1'); // Navigate after successful submission
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

            <label className="checkbox">
              <input
                type="checkbox"
                value="Social interaction"
                checked={selectedOptions.includes("Social interaction")}
                onChange={handleOptionChange}
              />
              <p>Social interaction</p>
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                value="Information seeking"
                checked={selectedOptions.includes("Information seeking")}
                onChange={handleOptionChange}
              />
              <p>Information seeking</p>
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                value="Passing time"
                checked={selectedOptions.includes("Passing time")}
                onChange={handleOptionChange}
              />
              <p>Passing time</p>
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                value="Entertainment"
                checked={selectedOptions.includes("Entertainment")}
                onChange={handleOptionChange}
              />
              <p>Entertainment</p>
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                value="Relaxation"
                checked={selectedOptions.includes("Relaxation")}
                onChange={handleOptionChange}
              />
              <p>Relaxation</p>
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                value="Expression of opinions"
                checked={selectedOptions.includes("Expression of opinions")}
                onChange={handleOptionChange}
              />
              <p>Expression of opinions</p>
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                value="Information sharing"
                checked={selectedOptions.includes("Information sharing")}
                onChange={handleOptionChange}
              />
              <p>Information sharing</p>
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                value="Knowledge of others"
                checked={selectedOptions.includes("Knowledge of others")}
                onChange={handleOptionChange}
              />
              <p>Knowledge of others</p>
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                value="Multitasking"
                checked={selectedOptions.includes("Multitasking")}
                onChange={handleOptionChange}
              />
              <p>Multitasking</p>
            </label>

          </div>
          {showError && <p className="error-message">Please select at least one option before proceeding.</p>}
          <button className="submit-button" onClick={handleClick}>Submit</button>
          </div>
        </div>
      );
}

export default SocialMediaHabits3;
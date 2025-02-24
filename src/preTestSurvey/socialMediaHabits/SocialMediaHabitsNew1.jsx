import React, {useState} from 'react';
import './SocialMediaHabits.css'; 
import { useNavigate } from 'react-router-dom';

function SocialMediaHabitsNew1() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); 
    const [loading, setLoading] = useState(false);

    const [hours, setHours] = useState({
        YouTube: '',
        Facebook: '',
        Instagram: '',
        Snapchat: '',
        BeReal: '',
        Twitter: '',
        LinkedIn: ''
    });

    const handleInputChange = (platform, value) => {
        setHours(prevHours => ({
            ...prevHours,
            [platform]: value
        }));
    };

    const handleClick = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://sludge-v2.onrender.com/socialmedia1", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    hours
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit data');
            }

            console.log("Social media hours data submitted successfully");
            navigate('/socialmedia2');
        } catch (error) {
            console.error('Error submitting social media hours data:', error);
        }
        setLoading(false);
    };

    return (                 
        <div className="container">
        <div className='survey-container'>
          <h2 className="brief-subtitle">How many hours per day do you spend on social media?</h2>
          <div className="survey-options">
            <div className="platform">
              <input type="text" className="hours-input" placeholder="Hours" onChange={(e) => handleInputChange('YouTube', e.target.value)} />
              <span className="platform-name">YouTube</span>
            </div>
            <div className="platform">
              <input type="text" className="hours-input" placeholder="Hours" onChange={(e) => handleInputChange('Facebook', e.target.value)} />
              <span className="platform-name">Facebook</span>
            </div>
            <div className="platform">
              <input type="text" className="hours-input" placeholder="Hours" onChange={(e) => handleInputChange('Instagram', e.target.value)} />
              <span className="platform-name">Instagram</span>
            </div>
            <div className="platform">
              <input type="text" className="hours-input" placeholder="Hours" onChange={(e) => handleInputChange('Snapchat', e.target.value)} />
              <span className="platform-name">Snapchat</span>
            </div>
            <div className="platform">
              <input type="text" className="hours-input" placeholder="Hours" onChange={(e) => handleInputChange('BeReal', e.target.value)} />
              <span className="platform-name">BeReal.</span>
            </div>
            <div className="platform">
              <input type="text" className="hours-input" placeholder="Hours" onChange={(e) => handleInputChange('Twitter', e.target.value)} />
              <span className="platform-name">X (Twitter)</span>
            </div>
            <div className="platform">
              <input type="text" className="hours-input" placeholder="Hours" onChange={(e) => handleInputChange('LinkedIn', e.target.value)} />
              <span className="platform-name">LinkedIn</span>
            </div>
          </div>
          <button className="submit-button" onClick={handleClick} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    );
}

export default SocialMediaHabitsNew1;
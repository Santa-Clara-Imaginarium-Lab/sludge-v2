import React, {useState} from 'react';
import '../postTestSurvey/PostTestSurvey.css'; 
import { useNavigate } from 'react-router-dom';

function PopQuiz2() {
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);
    const [freeResponse, setFreeResponse] = useState(''); 
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    
    const handleFreeResponseChange = (event) => {
      setFreeResponse(event.target.value); 
    };

    const handleClick = async () => {
      if (!freeResponse) { 
        setShowError(true);
        return;
      }

      setShowError(false);
      setLoading(true);
      try {
        const response = await fetch(`https://sludge-v2.up.railway.app/popquiz2`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            answer: freeResponse, 
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update demographic data');
        }

        console.log("Demographic data updated successfully");
        navigate('/exit'); 
      } catch (error) {
        console.error('Error updating demographic data:', error);
        setShowError(true); 
      }
      setLoading(false);
    };

    return (
        <div className="container tutorial-container">
          <div className='demographic-container'>
          <h2 className="question">Please summarize the main ideas from the video you watched.</h2>


              <textarea
                className="ans-input"
                value={freeResponse}
                onChange={handleFreeResponseChange}
                rows="5"
              />


          {showError && <p className="error-message">Please provide an answer before proceeding.</p>}
          <button className="submit-button" onClick={handleClick} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          </div>
        </div>
      );
}

export default PopQuiz2;
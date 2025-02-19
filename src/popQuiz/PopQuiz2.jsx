import React, {useState} from 'react';
import '../postTestSurvey/PostTestSurvey.css'; 
import { useNavigate } from 'react-router-dom';

function PopQuiz2() {
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);
    const [freeResponse, setFreeResponse] = useState(''); 
    const userId = localStorage.getItem('userId');
    
    const handleFreeResponseChange = (event) => {
      setFreeResponse(event.target.value); 
    };

    const handleClick = async () => {
      if (!freeResponse) { 
        setShowError(true);
        return;
      }

      setShowError(false);

      try {
        const response = await fetch(`http://localhost:3100/popquiz2`, {
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
        navigate('/'); 
      } catch (error) {
        console.error('Error updating demographic data:', error);
        setShowError(true); 
      }
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
          <button className="submit-button" onClick={handleClick}>Submit</button>
          </div>
        </div>
      );
}

export default PopQuiz2;
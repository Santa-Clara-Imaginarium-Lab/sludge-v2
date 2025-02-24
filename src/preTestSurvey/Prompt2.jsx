import React, {useState} from 'react';
import '../postTestSurvey/PostTestSurvey.css'; 
import { useNavigate } from 'react-router-dom';

function Prompt2() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleNavigate = () => {
      setLoading(true);
      navigate('/studypart');
      setLoading(false);
    };
    
    return (
        <div className="container">
            <h1> STOP</h1>
            <h1>Please call the researcher for further instructions before proceeding</h1>
            <button className="submit-button" onClick={handleNavigate} disabled={loading}>
                {loading ? "Proceeding..." : "Proceed"}
            </button>
        </div>
    );
}

export default Prompt2;
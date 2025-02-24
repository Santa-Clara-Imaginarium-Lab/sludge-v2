import React, {useState} from 'react';
import '../postTestSurvey/PostTestSurvey.css'; 
import { useNavigate } from 'react-router-dom';
import stopSign from '../image/STOP.jpg'; 

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
            <h1 style={{ color: "red", fontSize: "2rem" }}>STOP</h1>
            <img 
                src={stopSign} 
                alt="Stop Sign" 
                style={{ width: "150px", height: "150px", marginBottom: "20px" }} 
            />
            <h1>Please call the researcher for further instructions before proceeding</h1>
            <button className="submit-button" onClick={handleNavigate} disabled={loading}>
                {loading ? "Proceeding..." : "Proceed"}
            </button>
        </div>
    );
}

export default Prompt2;
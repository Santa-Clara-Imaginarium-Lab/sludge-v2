import React, { useState } from 'react';
import '../postTestSurvey/PostTestSurvey.css'; 
import { useNavigate } from 'react-router-dom';

function Prompt1() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleNavigate = () => {
      setLoading(true);
      navigate('/socialmedia1');
      setLoading(false);
    };
    
    return (
        <div className="container">
            {/* <h1>Pre-Test Survey</h1> */}
            <button className="submit-button" onClick={handleNavigate} disabled={loading}>
                {loading ? "Proceeding..." : "Proceed"}
            </button>
        </div>
    );
}

export default Prompt1;
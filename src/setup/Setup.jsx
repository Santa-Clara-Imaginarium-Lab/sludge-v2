import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../index";
import './Setup.css';

const Setup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleNavigate = async () => {
    const setupData = [];
    if (companionContent) setupData.push("Companion Content");
    if (subtitles) setupData.push("Subtitles");
    setLoading(true);
    try {
      const response = await fetch("https://sludge-v2.onrender.com/submit-setup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'), // Assuming userId is stored in localStorage
          setupData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit setup data');
      }

      console.log("Setup data submitted successfully");
      navigate("/prompt1");
    } catch (error) {
      console.error('Error submitting setup data:', error);
    }
    setLoading(false);
  };

  const { companionContent, setCompanionContent, subtitles, setSubtitles } = useAppContext();

  return (
    <div className="container">
      <h1>Please call the researcher for the Setup</h1>
      <p className="text">Choose the settings below for the study.</p>
      <div className="checkbox-options">

      <label className="checkbox">
          <input
            type="checkbox"
            checked={subtitles}
            onChange={() => setSubtitles(!subtitles)}
          />
          <p>Subtitles</p>
        </label>
        
        <label className="checkbox">
          <input
            type="checkbox"
            checked={companionContent}
            onChange={() => setCompanionContent(!companionContent)}
          />
          <p>Companion Content</p>
        </label>

      </div>

      <p className="text">
        Study group selected: {subtitles ? "Subtitles" : "No Subtitles"}, {companionContent ? "Companion Content" : "No Companion Content"}
      </p>

      <button className="submit-button" onClick={handleNavigate} disabled={loading}>
        {loading ? "Proceeding..." : "Proceed"}
      </button>
    </div>
  );
};

export default Setup;

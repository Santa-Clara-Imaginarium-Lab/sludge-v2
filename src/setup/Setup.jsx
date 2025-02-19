import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../index";
import './Setup.css';

const Setup = () => {
  const navigate = useNavigate();

  const handleNavigate = async () => {
    const setupData = [];
    if (companionContent) setupData.push("Companion Content");
    if (subtitles) setupData.push("Subtitles");

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
      navigate("/socialmediahabits1");
    } catch (error) {
      console.error('Error submitting setup data:', error);
    }
  };

  const { companionContent, setCompanionContent, subtitles, setSubtitles } = useAppContext();

  return (
    <div className="container">
      <h1>Setup Page</h1>
      <p className="text">This is the setup page for the researcher.</p>
      <p className="text">Choose below which participant type is continuing with the study</p>
      <div className="checkbox-options">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={companionContent}
            onChange={() => setCompanionContent(!companionContent)}
          />
          <p>Companion Content</p>
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={subtitles}
            onChange={() => setSubtitles(!subtitles)}
          />
          <p>Subtitles</p>
        </label>
      </div>

      <p className="text">Companion Content Results: {companionContent ? "Content available" : 'No content available'}</p>
      <p className="text">Subtitles Results: {subtitles ? "Subtitles available" : 'No subtitles available'}</p>

      <button className="submit-button" onClick={handleNavigate}>
        Take the Pre-Test Survey
      </button>
    </div>
  );
};

export default Setup;

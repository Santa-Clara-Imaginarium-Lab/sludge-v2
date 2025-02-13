import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../index";
import './Setup.css';

const Setup = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/pretestsurvey");
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
        PreTest Survey
      </button>
    </div>
  );
};

export default Setup;

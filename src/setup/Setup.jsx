import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../index";


const Setup = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/pretestsurvey");
  };

  const { companionContent, setCompanionContent, subtitles, setSubtitles } = useAppContext();

  return (
    <div>
      <h1>Setup Page</h1>
      <p>This is the setup page for the researcher.</p>
      <p>Choose below which participant type is continuing with the study</p>
      <div>
        <label>
          <input
            type="checkbox"
            checked={companionContent}
            onChange={() => setCompanionContent(!companionContent)}
          />
          <span>Companion Content</span>
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={subtitles}
            onChange={() => setSubtitles(!subtitles)}
          />
          <span>Subtitles</span>
        </label>
      </div>

      <p>Companion Content Results: {companionContent ? "Content available" : 'No content available'}</p>
      <p>Subtitles Results: {subtitles ? "Subtitles available" : 'No subtitles available'}</p>

      <button className="button" onClick={handleNavigate}>
        PreTest Survey
      </button>
    </div>
  );
};

export default Setup;

import React from 'react';
import exampleSubtitles from "./MIB2-subtitles-pt-BR.vtt";
import video from "./MIB2.mp4";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../index";


const StudyPart = () => {
  const { companionContent, subtitles } = useAppContext();
  
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/posttestsurvey');
  };
  
  return (
    <div>
      <p>Companion Content Results: {companionContent ? "Content available" : 'No content available'}</p>
      <p>Subtitles Results: {subtitles ? "Subtitles available" : 'No subtitles available'}</p>
        <video width="600" height="400" controls>
          <source src={video} type="video/mp4" />
          {
            subtitles && <track
              label="en"
              kind="subtitles"
              srcLang="en"
              src={exampleSubtitles}
              default />
          }
        </video>
        <button className="button" onClick={handleNavigate}>PostTest Survey</button>
    </div>
  );
};

export default StudyPart;

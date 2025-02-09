import React from 'react';
import subtitles from "./MIB2-subtitles-pt-BR.vtt";
import video from "./MIB2.mp4";
import { useNavigate } from 'react-router-dom';

const StudyPart = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/posttestsurvey');
  };
  
  return (
    <div>
        <video width="600" height="400" controls>
          <source src={video} type="video/mp4" />
          <track
            label="pt"
            kind="subtitles"
            srcLang="pt"
            src={subtitles}
            default
          />
        </video>
        <button className="button" onClick={handleNavigate}>PostTest Survey</button>
    </div>
  );
};

export default StudyPart;

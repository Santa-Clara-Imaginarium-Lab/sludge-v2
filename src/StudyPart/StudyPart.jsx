import React from 'react';
import exampleSubtitles from "./MIB2-subtitles-pt-BR.vtt";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../index";

import primaryContent from "../videoAssets/primaryContent.mp4";

import minecraftCompanion1 from "../videoAssets/companionContent/minecraft1.mp4";
import minecraftCompanion2 from "../videoAssets/companionContent/minecraft2.mp4";
import craftCompanion1 from "../videoAssets/companionContent/craft1.mp4";
import craftCompanion2 from "../videoAssets/companionContent/craft2.mp4";
import craftCompanion3 from "../videoAssets/companionContent/craft3.mp4";


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
        <video width="600" height="400" autoPlay style={{'pointer-events': 'none'}}>
          <source src={primaryContent} type="video/mp4" />
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

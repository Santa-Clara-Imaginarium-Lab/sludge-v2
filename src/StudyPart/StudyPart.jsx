import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../index";

import primaryContent from "../videoAssets/primaryContent.mp4";
import primaryContentSubtitles from "../videoAssets/primaryContent.vtt";

//import exampleSubtitles from "./MIB2-subtitles-pt-BR.vtt";

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

  console.log(primaryContentSubtitles);
  
  return (
    <div className='container'>
      <p className='text'>Companion Content Results: {companionContent ? "Content available" : 'No content available'}</p>
      <p className='text'>Subtitles Results: {subtitles ? "Subtitles available" : 'No subtitles available'}</p>
        <video width="600" height="400" autoPlay style={{'pointerEvents': 'none'}}>
          <source src={primaryContent} type="video/mp4" />
          {
            subtitles && <track
              label="en"
              kind="subtitles"
              srcLang="en"
              src={primaryContentSubtitles}
              default />
          }
        </video>
        <button className="submit-button" onClick={handleNavigate}>PostTest Survey</button>
    </div>
  );
};

export default StudyPart;

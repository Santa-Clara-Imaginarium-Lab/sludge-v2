import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../index";
import "./StudyPart.css";

import primaryContent from "../videoAssets/primaryContent.mp4";
import primaryContentSubtitles from "../videoAssets/primaryContent_utf8.vtt";

// Companion Content Imports
import minecraftCompanion1 from "../videoAssets/companionContent/minecraft1.mp4";
import minecraftCompanion2 from "../videoAssets/companionContent/minecraft2.mp4";
import craftCompanion1 from "../videoAssets/companionContent/craft1.mp4";
import craftCompanion2 from "../videoAssets/companionContent/craft2.mp4";
import craftCompanion3 from "../videoAssets/companionContent/craft3.mp4";

// Companion content options
const companionVideos = [
  minecraftCompanion1,
  minecraftCompanion2,
  craftCompanion1,
  craftCompanion2,
  craftCompanion3,
];

const StudyPart = () => {
  const { companionContent, subtitles } = useAppContext();
  const navigate = useNavigate();

  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [videosStarted, setVideosStarted] = useState(false);
  const primaryVideoRef = useRef(null);
  const companionVideoRef = useRef(null);

  useEffect(() => {
    if (companionContent) {
      const randomIndex = Math.floor(Math.random() * companionVideos.length);
      setSelectedCompanion(companionVideos[randomIndex]);
    } else {
      setSelectedCompanion(null);
    }
  }, [companionContent]);

  useEffect(() => {
    if (primaryVideoRef.current && companionVideoRef.current) {
      const syncVideos = () => {
        companionVideoRef.current.currentTime = primaryVideoRef.current.currentTime;
      };

      primaryVideoRef.current.addEventListener("play", () => {
        companionVideoRef.current?.play();
        syncVideos();
      });

      primaryVideoRef.current.addEventListener("pause", () => {
        companionVideoRef.current?.pause();
      });

      primaryVideoRef.current.addEventListener("seeked", syncVideos);

      return () => {
        if (primaryVideoRef.current) {
          primaryVideoRef.current.removeEventListener("play", syncVideos);
          primaryVideoRef.current.removeEventListener("pause", syncVideos);
          primaryVideoRef.current.removeEventListener("seeked", syncVideos);
        }
      };
    }
  }, [selectedCompanion]);

  useEffect(() => {
    if (window.webgazer) {
      window.webgazer
        .setGazeListener((data, elapsedTime) => {
          if (data) {
            console.log(`X: ${data.x}, Y: ${data.y}`);
          }
        })
        .saveDataAcrossSessions(true)
        .showPredictionPoints(true)
        .showVideoPreview(true)
        .showFaceOverlay(true)
        .showFaceFeedbackBox(true)
        .begin();
  
      // // Optionally, show calibration points:
      // window.webgazer.showCalibrationPoint(true);
    } else {
      console.warn("WebGazer not available!");
    }
  
    return () => {
      if (window.webgazer) {
        try {
          if (window.webgazer.isReady()) {
            window.webgazer.end();
          }
        } catch (err) {
          console.warn("webgazer.end() cleanup failed:", err);
        }
      }
    };
  }, []);
  
  const handleStartVideos = () => {
    if (primaryVideoRef.current) {
      primaryVideoRef.current.play();
    }
    if (companionContent && companionVideoRef.current) {
      companionVideoRef.current.play();
    }
    setVideosStarted(true);
  };

  const handleNavigate = () => {
    navigate("/videoengagement");
  };

  return (
    <div className="container">

      {!videosStarted && (
        <button className="submit-button" onClick={handleStartVideos}>
          Start Videos
        </button>
      )}

      <div className="video-container">
        {/* Primary Video */}
        <video ref={primaryVideoRef} className="primary-video" width="600" height="400" controls>
          <source src={primaryContent} type="video/mp4" />
            {subtitles && 
              <track label="English" kind="subtitles" srcLang="en" src={primaryContentSubtitles} default />
            }
        </video>

        {/* Companion Video (only if companionContent is enabled) */}
        {companionContent && selectedCompanion && (
          <video ref={companionVideoRef} className="companion-video" width="600" height="400" muted>
            <source src={selectedCompanion} type="video/mp4" />
          </video>
        )}
      </div>

      <button className="submit-button" onClick={handleNavigate}>
        Done
      </button>
    </div>
  );
};

export default StudyPart;
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../index";
import "./StudyPart.css";

import primaryContent from "../videoAssets/primaryContent.mp4";
import primaryContentSubtitles from "../videoAssets/primaryContent.vtt";

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
  const { subtitles } = useAppContext();
  const navigate = useNavigate();

  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [videosStarted, setVideosStarted] = useState(false);
  const primaryVideoRef = useRef(null);
  const companionVideoRef = useRef(null);

  // Pick a random companion video when the component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * companionVideos.length);
    setSelectedCompanion(companionVideos[randomIndex]);
  }, []);

  // Sync companion video with primary video
  useEffect(() => {
    if (primaryVideoRef.current && companionVideoRef.current) {
      const syncVideos = () => {
        companionVideoRef.current.currentTime = primaryVideoRef.current.currentTime;
      };

      primaryVideoRef.current.addEventListener("play", () => {
        companionVideoRef.current.play();
        syncVideos();
      });

      primaryVideoRef.current.addEventListener("pause", () => {
        companionVideoRef.current.pause();
      });

      primaryVideoRef.current.addEventListener("seeked", syncVideos);

      return () => {
        primaryVideoRef.current.removeEventListener("play", syncVideos);
        primaryVideoRef.current.removeEventListener("pause", syncVideos);
        primaryVideoRef.current.removeEventListener("seeked", syncVideos);
      };
    }
  }, [selectedCompanion]);

  const handleStartVideos = () => {
    if (primaryVideoRef.current && companionVideoRef.current) {
      primaryVideoRef.current.play();
      companionVideoRef.current.play();
      setVideosStarted(true);
    }
  };
  const handleNavigate = () => {
    navigate("/posttestsurvey");
  };
  

  return (
    <div className="container">
      <h2>Study Part</h2>

      {!videosStarted && (
        <button className="start-button" onClick={handleStartVideos}>
          Start Videos
        </button>
      )}

      <div className="video-container">
        {/* Primary Video (Requires user to start) */}
        <video ref={primaryVideoRef} className="primary-video" width="600" height="400" controls>
          <source src={primaryContent} type="video/mp4" />
          {subtitles && (
            <track label="English" kind="subtitles" srcLang="en" src={primaryContentSubtitles} default />
          )}
        </video>

        {/* Companion Video (Muted) */}
        {selectedCompanion && (
          <video ref={companionVideoRef} className="companion-video" width="600" height="400" muted>
            <source src={selectedCompanion} type="video/mp4" />
          </video>
        )}
      </div>

      <button className="submit-button" onClick={handleNavigate}>
        PostTest Survey
      </button>
      <script>
        // Start WebGaze eye tracking
          webgazer.setGazeListener((data, elapsedTime) => {
              if (data) {
                  console.log(`X: ${data.x}, Y: ${data.y}`); //not sure how best to save this
              }
          })
      .showVideoPreview(false) // Hides the camera feed
          .showFaceOverlay(false)  // Hides the face-tracking box
          .showFaceFeedbackBox(false) // Hides face feedback
      .begin();
    </script>
    </div>
  );
};

export default StudyPart;


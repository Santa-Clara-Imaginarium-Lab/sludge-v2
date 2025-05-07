import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../index";
import "./StudyPart.css";
import io from "socket.io-client";

import primaryContent from "../videoAssets/primaryContent.mp4";
import primaryContentSubtitles from "../videoAssets/primaryContent_utf8.vtt";

// Companion Content Imports
import minecraftCompanion1 from "../videoAssets/companionContent/minecraft1.mp4";
import minecraftCompanion2 from "../videoAssets/companionContent/minecraft2.mp4";
import craftCompanion1 from "../videoAssets/companionContent/craft1.mp4";
import craftCompanion2 from "../videoAssets/companionContent/craft2.mp4";
import craftCompanion3 from "../videoAssets/companionContent/craft3.mp4";

// Eye tracking server URL
const EYE_TRACKER_SERVER_URL = "http://localhost:5000";

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
  const [eyeTrackingStarted, setEyeTrackingStarted] = useState(false);
  const [eyeTrackingStatus, setEyeTrackingStatus] = useState("not connected");
  const [sessionId, setSessionId] = useState(null);
  const [dataPoints, setDataPoints] = useState(0);
  const [csvFilename, setCsvFilename] = useState(null);

  const primaryVideoRef = useRef(null);
  const companionVideoRef = useRef(null);
  const socketRef = useRef(null);

  // Connect to eye tracking WebSocket
  useEffect(() => {
    // Only connect if not already connected
    if (!socketRef.current) {
      socketRef.current = io(EYE_TRACKER_SERVER_URL);

      socketRef.current.on("connect", () => {
        console.log("Connected to eye tracking server");
        setEyeTrackingStatus("connected");
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from eye tracking server");
        setEyeTrackingStatus("disconnected");
      });

      socketRef.current.on("gaze_data", (data) => {
        // Update data points counter
        setDataPoints((prev) => prev + 1);

        // You can also visualize gaze data if needed
        // console.log("Gaze data:", data);
      });
    }

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Select random companion video on mount
  useEffect(() => {
    if (companionContent) {
      const randomIndex = Math.floor(Math.random() * companionVideos.length);
      setSelectedCompanion(companionVideos[randomIndex]);
    } else {
      setSelectedCompanion(null);
    }
  }, [companionContent]);

  // Sync videos
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

  // Start eye tracking
  const startEyeTracking = async () => {
    try {
      // Get screen dimensions
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Get video information for context
      const videoData = {
        primaryVideo: primaryContent.split("/").pop(),
        companionVideo: selectedCompanion ? selectedCompanion.split("/").pop() : null,
        subtitlesEnabled: subtitles,
        companionEnabled: companionContent,
      };

      // Start a new tracking session
      const response = await fetch(`${EYE_TRACKER_SERVER_URL}/api/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          screenWidth,
          screenHeight,
          sessionId: `sludge_${Date.now()}`,
          videoData,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setSessionId(data.sessionId);
        setEyeTrackingStarted(true);
        setEyeTrackingStatus("tracking");
        console.log("Eye tracking started:", data);
      } else {
        console.error("Failed to start eye tracking:", data.message);
        setEyeTrackingStatus("error");
      }
    } catch (error) {
      console.error("Eye tracking error:", error);
      setEyeTrackingStatus("error");
    }
  };

  // Stop eye tracking
  const stopEyeTracking = async () => {
    if (eyeTrackingStarted) {
      try {
        const response = await fetch(`${EYE_TRACKER_SERVER_URL}/api/stop`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Eye tracking stopped:", data);

        // Check if a CSV file was created
        if (data.csvFile) {
          setCsvFilename(data.csvFile);
          console.log(`Eye tracking data saved to CSV: ${data.csvFile}`);
        }

        setEyeTrackingStarted(false);
        setEyeTrackingStatus("stopped");
      } catch (error) {
        console.error("Error stopping eye tracking:", error);
      }
    }
  };

  // Start videos and eye tracking
  const handleStartVideos = () => {
    if (primaryVideoRef.current) {
      primaryVideoRef.current.play();
    }
    if (companionContent && companionVideoRef.current) {
      companionVideoRef.current.play();
    }
    setVideosStarted(true);

    // Start eye tracking
    startEyeTracking();
  };

  // Handle navigation and cleanup
  const handleNavigate = () => {
    // Stop eye tracking before navigating away
    stopEyeTracking();
    navigate("/stop");
  };

  // Also stop tracking when component unmounts
  useEffect(() => {
    return () => {
      stopEyeTracking();
    };
  }, []);

  return (
    <div className="study-container">
      <div className="button-container">
        {!videosStarted && (
          <button className="submit-button" onClick={handleStartVideos}>
            Start Videos
          </button>
        )}
      </div>
      <div className="video-container">
        {/* Primary Video */}
        <video ref={primaryVideoRef} className="primary-video" width="600" height="400" controls>
          <source src={primaryContent} type="video/mp4" />
          {subtitles && (
            <track label="English" kind="subtitles" srcLang="en" src={primaryContentSubtitles} default />
          )}
        </video>

        {/* Companion Video (only if companionContent is enabled) */}
        {companionContent && selectedCompanion && (
          <video ref={companionVideoRef} className="companion-video" width="600" height="400" muted>
            <source src={selectedCompanion} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="button-container">
        <button className="submit-button" onClick={handleNavigate}>
          Done
        </button>
      </div>
    </div>
  );
};

export default StudyPart;
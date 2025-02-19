import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Setup from './setup/Setup.jsx';
import StudyPart from './StudyPart/StudyPart.jsx';
import SocialMediaHabits1 from './preTestSurvey/socialMediaHabits/SocialMediaHabits1.jsx';
import SocialMediaHabits2 from './preTestSurvey/socialMediaHabits/SocialMediaHabits2.jsx';
import SocialMediaHabits3 from './preTestSurvey/socialMediaHabits/SocialMediaHabits3.jsx';
import MAASLO1 from './preTestSurvey/everydayAttentionalFailures/MAASLO1.jsx';
import MAASLO2 from './preTestSurvey/everydayAttentionalFailures/MAASLO2.jsx';
import MAASLO3 from './preTestSurvey/everydayAttentionalFailures/MAASLO3.jsx';
import MEWS1 from './preTestSurvey/mindExcessivelyWanderingScale/MEWS1.jsx';
import MEWS2 from './preTestSurvey/mindExcessivelyWanderingScale/MEWS2.jsx';
import MEWS3 from './preTestSurvey/mindExcessivelyWanderingScale/MEWS3.jsx';
import CurrentMood from './preTestSurvey/CurrentMood.jsx';
import VideoEngagement from './postTestSurvey/VideoEngagement.jsx';
import DemographicQuestion1 from './postTestSurvey/DemographicQuestion1.jsx'
import DemographicQuestion2 from './postTestSurvey/DemographicQuestion2.jsx';
import DemographicQuestion3 from './postTestSurvey/DemographicQuestion3.jsx';
import DemographicQuestion4 from './postTestSurvey/DemographicQuestion4.jsx';
import Exit from './exit/Exit.jsx';

import { createContext, useContext, useState } from "react";


import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/setup',
    element: <Setup />,
  },
  {
    path: '/videoengagement',
    element: <VideoEngagement />,
  },
  {
    path: '/socialmediahabits1',
    element: <SocialMediaHabits1 />,
  },
  {
    path: '/socialmediahabits2',
    element: <SocialMediaHabits2 />,
  },
  {
    path: '/socialmediahabits3',
    element: <SocialMediaHabits3 />,
  },
  {
    path: '/maaslo1',
    element: <MAASLO1 />,
  },
  {
    path: '/maaslo2',
    element: <MAASLO2 />,
  },
  {
    path: '/mews1',
    element: <MEWS1 />,
  },
  {
    path: '/mews2',
    element: <MEWS2 />,
  },
  {
    path: '/mews3',
    element: <MEWS3 />,
  },
  {
    path: '/maaslo3',
    element: <MAASLO3 />,
  },
  {
    path: '/studypart',
    element: <StudyPart />,
  },
  {
    path: '/mood',
    element: <CurrentMood />,
  },
  {
    path: '/demographicques1',
    element: <DemographicQuestion1 />,
  },
  {
    path: '/demographicques2',
    element: <DemographicQuestion2 />,
  },
  {
    path: '/demographicques3',
    element: <DemographicQuestion3 />,
  },
  {
    path: '/demographicques4',
    element: <DemographicQuestion4 />,
  },
  {
    path: '/exit',
    element: <Exit />,
  },
]);

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [companionContent, setCompanionContent] = useState(false);
  const [subtitles, setSubtitles] = useState(false);

  return (
    <AppContext.Provider value={{ companionContent, setCompanionContent, subtitles, setSubtitles }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <AppProvider>
          <RouterProvider router={router}>
            <App />
          </RouterProvider>
        </AppProvider>
  </React.StrictMode>
);
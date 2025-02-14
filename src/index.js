import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Setup from './setup/Setup.jsx';
import PostTestSurvey from './postTestSurvey/PostTestSurvey.jsx';
import PreTestSurvey from './preTestSurvey/PreTestSurvey.jsx';
import StudyPart from './StudyPart/StudyPart.jsx';
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
    path: '/pretestsurvey',
    element: <PreTestSurvey />,
  },
  {
    path: '/posttestsurvey',
    element: <PostTestSurvey />,
  },
  {
    path: '/studypart',
    element: <StudyPart />,
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
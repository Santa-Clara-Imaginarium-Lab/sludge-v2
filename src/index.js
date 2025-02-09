import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Setup from './setup/Setup';
import PostTestSurvey from './postTestSurvey/PostTestSurvey';
import PreTestSurvey from './preTestSurvey/PreTestSurvey';
import StudyPart from './StudyPart/StudyPart';
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
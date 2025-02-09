import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Setup from './setup/Setup';
import PostTestSurvey from './postTestSurvey/PostTestSurvey';
import PreTestSurvey from './preTestSurvey/PreTestSurvey';
import StudyPart from './StudyPart/StudyPart';

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);
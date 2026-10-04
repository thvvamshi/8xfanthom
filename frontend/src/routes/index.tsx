import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import DashboardPage from '../pages/DashboardPage';
import MeetingsPage from '../pages/MeetingsPage';
import MeetingWorkspacePage from '../pages/MeetingWorkspacePage';
import SearchPage from '../pages/SearchPage';
import SharePage from '../pages/SharePage';
import LandingPage from '../pages/LandingPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/meetings', element: <MeetingsPage /> },
      { path: '/meetings/:id', element: <MeetingWorkspacePage /> },
      { path: '/search', element: <SearchPage /> },
    ],
  },
  {
    path: '/share/:id',
    element: <SharePage />
  }
]);

export default router;

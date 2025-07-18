import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { FocusStyleManager } from '@blueprintjs/core'; // Removed in v6
import NavigationHeader from './components/NavigationHeader';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Teams from './pages/Teams';
import Profile from './pages/Profile';
// Import new pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TeamMemberTasksPage from './pages/TeamMemberTasksPage';
import TeamLeadTeamsPage from './pages/TeamLeadTeamsPage';
import TeamLeadTasksPage from './pages/TeamLeadTasksPage';
import ProjectManagerTeamsPage from './pages/ProjectManagerTeamsPage';
import ProjectManagerUsersPage from './pages/ProjectManagerUsersPage';
import ProjectManagerTasksPage from './pages/ProjectManagerTasksPage';
import NotFoundPage from './pages/NotFoundPage';
import LogoutPage from './pages/LogoutPage';

// FocusStyleManager.onlyShowFocusOnTabs(); // Removed in v6

function RequireAuth({ children }) {
  const token = localStorage.getItem('access_token');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <>
      <NavigationHeader />
      <div style={{ margin: '2rem' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
          <Route path="/my-tasks" element={<RequireAuth><TeamMemberTasksPage /></RequireAuth>} />
          <Route path="/lead/teams" element={<RequireAuth><TeamLeadTeamsPage /></RequireAuth>} />
          <Route path="/lead/tasks" element={<RequireAuth><TeamLeadTasksPage /></RequireAuth>} />
          <Route path="/pm/teams" element={<RequireAuth><ProjectManagerTeamsPage /></RequireAuth>} />
          <Route path="/pm/users" element={<RequireAuth><ProjectManagerUsersPage /></RequireAuth>} />
          <Route path="/pm/tasks" element={<RequireAuth><ProjectManagerTasksPage /></RequireAuth>} />
          <Route path="/tasks" element={<RequireAuth><Tasks /></RequireAuth>} />
          <Route path="/teams" element={<RequireAuth><Teams /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

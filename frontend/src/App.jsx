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
import { useSelector } from 'react-redux';
// FocusStyleManager.onlyShowFocusOnTabs(); // Removed in v6

function RequireAuth({ children }) {
  const token = useSelector((state) => state.user.access_token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function RequireRole({ children, allowedRoles }) {
  const { role, access_token } = useSelector((state) => state.user);
  const location = useLocation();

  if (!access_token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
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

          {/* General Routes */}
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireRole allowedRoles={['project_manager']}><DashboardPage /></RequireRole>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

          {/* Project Manager Routes */}
          <Route path="/pm/teams" element={<RequireRole allowedRoles={['project_manager']}><ProjectManagerTeamsPage /></RequireRole>} />
          <Route path="/pm/users" element={<RequireRole allowedRoles={['project_manager']}><ProjectManagerUsersPage /></RequireRole>} />
          <Route path="/pm/tasks" element={<RequireRole allowedRoles={['project_manager']}><ProjectManagerTasksPage /></RequireRole>} />

          {/* Team Lead Routes */}
          <Route path="/lead/teams" element={<RequireRole allowedRoles={['team_lead']}><TeamLeadTeamsPage /></RequireRole>} />
          <Route path="/lead/tasks" element={<RequireRole allowedRoles={['team_lead']}><TeamLeadTasksPage /></RequireRole>} />

          {/* Team Member Routes */}
          <Route path="/my-tasks" element={<RequireRole allowedRoles={['team_member', 'developer']}><TeamMemberTasksPage /></RequireRole>} />

          {/* Shared/Legacy Routes - restricting or keeping valid? */}
          <Route path="/tasks" element={<RequireAuth><Tasks /></RequireAuth>} />
          <Route path="/teams" element={<RequireAuth><Teams /></RequireAuth>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

import React from 'react';
import { Menu, MenuItem } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';

const RoleBasedNav = ({ role }) => {
  const navigate = useNavigate();
  return (
    <Menu style={{ background: 'transparent', boxShadow: 'none', display: 'flex', flexDirection: 'row', gap: 8, margin: 0 }}>
      <MenuItem text="Dashboard" onClick={() => navigate('/dashboard')} />
      {role === 'team_member' && <MenuItem text="My Tasks" onClick={() => navigate('/my-tasks')} />}
      {role === 'team_lead' && <>
        <MenuItem text="Manage Teams" onClick={() => navigate('/lead/teams')} />
        <MenuItem text="Team Tasks" onClick={() => navigate('/lead/tasks')} />
      </>}
      {role === 'project_manager' && <>
        <MenuItem text="All Teams" onClick={() => navigate('/pm/teams')} />
        <MenuItem text="Manage Users" onClick={() => navigate('/pm/users')} />
        <MenuItem text="All Tasks" onClick={() => navigate('/pm/tasks')} />
      </>}
    </Menu>
  );
};

export default RoleBasedNav;

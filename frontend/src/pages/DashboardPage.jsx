import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../dashboardSlice';
import {
  Card,
  Elevation,
  H3,
  H5,
  Tag,
  Divider,
  Spinner,
  HTMLTable,
  Button,
  UL,
  Popover,
  Menu,
  MenuItem,
  Position,
  MenuDivider
} from '@blueprintjs/core';
import { EyeOpen } from '@blueprintjs/icons';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { teams, tasks, members, loading, error } = useSelector(state => state.dashboard);
  const token = useSelector((state) => state.user.access_token);
  useEffect(() => {

    if (token) {
      dispatch(fetchDashboardData(token));
    }
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      // Call the delete API here
      console.log('Task deleted:', id);
    }
  };

  // Helper to get members of a team
  const getTeamMembers = (team) => {
    if (!team || !Array.isArray(team.members) || !Array.isArray(members)) return [];
    return team.members;
  };

  // Helper to get project manager
  const getProjectManager = (team) => {
    if (!team || !team.project_manager || !Array.isArray(members)) return null;
    return members.find(m => m.member_id === team.project_manager || m._id === team.project_manager);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
        <Spinner size={50} />
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', minHeight: '100vh', padding: 24, boxSizing: 'border-box' }}>
      <H3 style={{ textAlign: 'center', marginBottom: 24 }}>Project Manager Dashboard</H3>
      {error && (
        <Card elevation={Elevation.TWO} style={{ marginBottom: 20, background: '#fffbe6' }}>
          <span style={{ color: '#d9822b' }}>{error}</span>
        </Card>
      )}
      <div
        style={{
          display: 'flex',
          gap: 24,
          flexWrap: 'nowrap',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        {/* Teams */}
        <Card elevation={Elevation.TWO} style={{ width: 320, minWidth: 280, flex: '0 0 320px' }}>
          <H5>Teams</H5>
          <Divider />
          {teams.length === 0 ? (
            <div style={{ color: '#aaa', marginTop: 16 }}>No teams found.</div>
          ) : (
            <UL style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
              {teams.map(team => (
                <li key={team.team_id || team._id} style={{ marginBottom: 10 }}>
                  <Popover
                    position={Position.RIGHT}
                    content={
                      <Menu>
                        <MenuItem
                          icon="user"
                          text={
                            <>
                              <b>Project Manager:</b>
                              <br />
                              {team.project_manager_name}

                            </>
                          }
                        />
                        <MenuDivider />
                        <MenuItem
                          icon="people"
                          text={
                            <div>
                              <b>Members:</b>
                              <ul style={{ paddingLeft: 16, margin: 0 }}>
                                {getTeamMembers(team).length === 0
                                  ? <li style={{ color: '#aaa' }}>No members</li>
                                  : getTeamMembers(team).map(m => (
                                    <li key={m.member_id || m._id}>{m.name || m.email}</li>
                                  ))
                                }
                              </ul>
                            </div>
                          }
                        />
                      </Menu>
                    }
                  >
                    <Tag
                      size="large"
                      interactive
                      intent="primary"
                      style={{ marginRight: 8, cursor: 'pointer' }}
                    >
                      {team.name}
                    </Tag>
                  </Popover>
                </li>
              ))}
            </UL>
          )}
        </Card>
        {/* Tasks */}
        <Card
          elevation={Elevation.TWO}
          style={{
            width: 520,
            minWidth: 480,
            flex: '0 0 520px',
            overflowX: 'auto',
            boxSizing: 'border-box'
          }}
        >
          <H5>Tasks</H5>
          <Divider />
          {tasks.length === 0 ? (
            <div style={{ color: '#aaa', marginTop: 16 }}>No tasks assigned.</div>
          ) : (
            <HTMLTable striped style={{ width: '100%', minWidth: 500, marginTop: 12 }}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Team Member</th>
                  <th>Team </th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id || task._id}>
                    <td>{task.title || task.name}</td>
                    <td>
                      <Tag intent={task.status === 'completed' ? 'success' : 'warning'}>
                        {task.status || 'Pending'}
                      </Tag>
                    </td>
                    <td>
                      <Tag>{task.team_member || 'Unassigned'}</Tag>
                    </td>
                    <td>
                      <Tag>{task.team_name || 'No team'}</Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </HTMLTable>
          )}
        </Card>
        {/* Team Members */}
        <Card elevation={Elevation.TWO} style={{ width: 320, minWidth: 280, flex: '0 0 320px' }}>
          <H5>Team Members</H5>
          <Divider />
          {members.length === 0 ? (
            <div style={{ color: '#aaa', marginTop: 16 }}>No team members.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
              {members.map(member => (
                <li key={member.member_id || member._id} style={{ marginBottom: 10 }}>
                  <Card interactive={false} elevation={Elevation.ONE} style={{ padding: 10, margin: 0 }}>
                    <div style={{ fontWeight: 500 }}>{member.name || member.email}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{member.email}</div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;

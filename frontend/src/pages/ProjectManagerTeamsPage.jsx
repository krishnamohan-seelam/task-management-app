import React, { useEffect, useState } from 'react';
import { Card, Elevation, FormGroup, InputGroup, Button, Callout, Spinner } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, createTeamThunk, editTeamThunk, deleteTeamThunk } from '../dashboardSlice';

const ProjectManagerTeamsPage = () => {
  const dispatch = useDispatch();
  const { teams, members, loading, error } = useSelector(state => state.dashboard);
  // Token is handled by interceptors now
  const [teamName, setTeamName] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editTeamId, setEditTeamId] = useState(null);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Project managers can be filtered from members
  const projectManagers = members.filter(m => m.role === 'project_manager');

  // Handle create/edit team
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!teamName || !selectedManager) return;
    const managerObj = projectManagers.find(pm => pm.user_id === selectedManager || pm.member_id === selectedManager);
    const teamPayload = {
      name: teamName,
      project_manager: selectedManager,
      project_manager_name: managerObj ? managerObj.name : '',
    };
    if (editMode && editTeamId) {
      dispatch(editTeamThunk({ teamId: editTeamId, team: teamPayload }));
    } else {
      dispatch(createTeamThunk({ team: teamPayload }));
    }
    setTeamName('');
    setSelectedManager('');
    setEditMode(false);
    setEditTeamId(null);
  };

  // Handle edit button click
  const handleEdit = (team) => {
    setEditMode(true);
    setEditTeamId(team.team_id || team._id);
    setTeamName(team.name);
    setSelectedManager(team.project_manager_id || (team.project_manager ? (typeof team.project_manager === 'object' ? team.project_manager.$oid : team.project_manager) : ''));
    // The project_manager might be an ID or object, depending on backend response.
  };

  // Handle delete
  const handleDelete = (teamId) => {
    dispatch(deleteTeamThunk({ teamId }));
    // Optionally reset form if deleting the team being edited
    if (editMode && editTeamId === teamId) {
      setTeamName('');
      setSelectedManager('');
      setEditMode(false);
      setEditTeamId(null);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f5f8fa' }}>
      <Card elevation={Elevation.TWO} style={{ width: 500, marginTop: 40, padding: 32 }}>
        <h2 style={{ textAlign: 'left', marginBottom: 24 }}>All Teams</h2>
        {error && <Callout intent="danger" style={{ marginBottom: 16, textAlign: 'left' }}>{error}</Callout>}
        <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
          <FormGroup label={editMode ? 'Edit Team' : 'Create Team'} labelFor="team-name">
            <InputGroup
              id="team-name"
              placeholder="Team Name"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <FormGroup label="Project Manager" labelFor="manager-select">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <select
                  id="manager-select"
                  value={selectedManager}
                  onChange={e => setSelectedManager(e.target.value)}
                  style={{ width: '100%', padding: '8px' }}
                >
                  <option value="">Select Manager</option>
                  {projectManagers.map(pm => (
                    <option key={pm.user_id || pm.member_id} value={pm.user_id || pm.member_id}>{pm.name}</option>
                  ))}
                </select>
              </div>
            </FormGroup>
            <Button type="submit" intent={editMode ? 'primary' : 'success'} style={{ marginTop: 8 }}>
              {editMode ? 'Update Team' : 'Create Team'}
            </Button>
            {editMode && (
              <Button style={{ marginLeft: 8 }} onClick={() => { setEditMode(false); setTeamName(''); setSelectedManager(''); setEditTeamId(null); }}>
                Cancel
              </Button>
            )}
          </FormGroup>
        </form>
        {loading ? <Spinner /> : (
          <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
            {teams.map(team => (
              <li key={team.team_id || team._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ textAlign: 'left' }}>
                  {team.name}
                  {team.project_manager_name && (
                    <span style={{ color: '#888', marginLeft: 8 }}>
                      (Manager: {team.project_manager_name})
                    </span>
                  )}
                </span>
                <span>
                  <Button
                    icon="edit"
                    variant="minimal"
                    onClick={() => handleEdit(team)}
                    style={{ marginRight: 8 }}
                  />
                  <Button
                    icon="trash"
                    variant="minimal"
                    intent="danger"
                    onClick={() => handleDelete(team.team_id || team._id)}
                  />
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default ProjectManagerTeamsPage;

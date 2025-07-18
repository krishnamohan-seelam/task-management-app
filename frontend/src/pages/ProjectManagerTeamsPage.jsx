import React, { useEffect, useState } from 'react';
import { fetchTeams, fetchTeamMembersByRole, createTeam, updateTeam, deleteTeam } from '../api';
import { Card, Elevation, FormGroup, InputGroup, Button, Callout, Spinner,MenuItem } from '@blueprintjs/core';
import { Select } from "@blueprintjs/select";


const ProjectManagerTeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projectManagers, setProjectManagers] = useState([]);

  const token = localStorage.getItem('access_token');
  const PROJECT_MANAGER_ROLE = 'project_manager';
  const loadTeams = () => {
    if (!token) return;
    setLoading(true);
    fetchTeams(token)
      .then(data => setTeams(data.teams || []))
      .catch(() => console.log('Failed to fetch teams'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTeams();
    // eslint-disable-next-line
  }, []);
  
  const loadProjectManagers = () => {
    if (!token) return;
    setLoading(true);
    fetchTeamMembersByRole(token,PROJECT_MANAGER_ROLE)
      .then(data => setProjectManagers(data.members || []))
      .catch(() => console.log('Failed to fetch project managers'))
      .finally(() => setLoading(false));
    
  };

  useEffect(() => {
    loadProjectManagers();
    // eslint-disable-next-line
  }, []);
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await updateTeam(token, editId, form);
      } else {
        await createTeam(token, form);
      }
      setForm({ name: '' });
      setEditId(null);
      loadTeams();
    } catch {
      setError('Failed to save team');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (team) => {
    setForm({
      name: team.name,
      project_manager: team.project_manager || team.project_manager_id || ''
    });
    setEditId(team.team_id || team._id);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteTeam(token, id);
      loadTeams();
    } catch {
      setError('Failed to delete team');
    } finally {
      setLoading(false);
    }
  };

  // Helper for Select
  const renderPM = (pm, { handleClick, modifiers }) => (
    <MenuItem
      key={pm.member_id || pm._id}
      text={pm.name}
      onClick={handleClick}
      active={modifiers.active}
      style={{ width: '100%', textAlign: 'left' }}
    />
  );
  const filterPM = (query, pm) =>
    pm.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;

  const handlePMSelect = (pm) => {
    setForm({ ...form, project_manager: pm.member_id || pm._id });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f5f8fa' }}>
      <Card elevation={Elevation.TWO} style={{ width: 500, marginTop: 40, padding: 32 }}>
        <h2 style={{ textAlign: 'left', marginBottom: 24 }}>All Teams</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: 24, textAlign: 'left' }}>
          <FormGroup label="Team Name" labelFor="team-name-input">
            <InputGroup
              id="team-name-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter team name"
              required
            />
          </FormGroup>
          <FormGroup label="Project Manager" labelFor="project-manager-select">
            <Select
              id="project-manager-select"
              items={projectManagers}
              itemRenderer={renderPM}
              itemPredicate={filterPM}
              onItemSelect={handlePMSelect}
              noResults={<Button disabled text="No project managers found" />}
              popoverProps={{ minimal: true }}
              filterable={true}
            >
              <Button
                text={
                  (() => {
                    const selected = projectManagers.find(pm => (pm.member_id || pm._id) === form.project_manager);
                    return selected ? selected.name : "Select project manager";
                  })()
                }
                style={{ width: '100%', textAlign: 'left' }}
              />
            </Select>
          </FormGroup>
          <Button type="submit" intent={editId ? 'warning' : 'primary'} large style={{ marginRight: 8 }} disabled={loading}>
            {editId ? 'Update' : 'Create'} Team
          </Button>
          {editId && (
            <Button
              type="button"
              onClick={() => { setEditId(null); setForm({ name: '', project_manager: '' }); }}
            >
              Cancel
            </Button>
          )}
        </form>
        {error && <Callout intent="danger" style={{ marginBottom: 16, textAlign: 'left' }}>{error}</Callout>}
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
                  <Button  icon="edit" intent="warning" onClick={() => handleEdit(team)} />
                  <Button  icon="trash" intent="danger" onClick={() => handleDelete(team.team_id || team._id)} />
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

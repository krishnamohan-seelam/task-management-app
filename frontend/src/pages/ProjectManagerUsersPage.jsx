import React, { useEffect, useState } from 'react';
import { fetchAllTeamMembers, createUser, updateUser, deleteUser } from '../api';
import { Card, Elevation, FormGroup, InputGroup, Button, Callout, Spinner } from '@blueprintjs/core';

const ProjectManagerUsersPage = () => {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', role: 'team_member', password: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);

  const token = localStorage.getItem('access_token');

  const loadMembers = () => {
    if (!token) return;
    setLoading(true);
    fetchAllTeamMembers(token)
      .then(data => setMembers(data.members || []))
      .catch(() => setError('Failed to fetch users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMembers();
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
        // Only update if something changed (ignore password if blank)
        const hasChanged =
          (originalUser?.name !== form.name) ||
          (originalUser?.email !== form.email) ||
          (originalUser?.role !== form.role) ||
          (form.password && form.password.length > 0);

        if (hasChanged) {
          await updateUser(token, editId, form);
        } else {
          console.log('No changes detected, updateUser API not called.');
        }
        // else: no API call if nothing changed
      } else {
        console.log
        await createUser(token, form);
      }
      setForm({ name: '', email: '', role: 'team_member', password: '' });
      setEditId(null);
      setOriginalUser(null);
      loadMembers();
    } catch {
      setError('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setForm({ name: member.name || '', email: member.email || '', role: member.role || 'team_member', password: '' });
    setEditId(member.member_id || member._id);
    setOriginalUser({ name: member.name || '', email: member.email || '', role: member.role || 'team_member' });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteUser(token, id);
      loadMembers();
    } catch {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f5f8fa' }}>
      <Card elevation={Elevation.TWO} style={{ width: 600, marginTop: 40, padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Manage Users</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <FormGroup label="Name" labelFor="user-name-input" style={{ flex: 1 }}>
            <InputGroup id="user-name-input" name="name" value={form.name} onChange={handleChange} placeholder="Name" required large />
          </FormGroup>
          <FormGroup label="Email" labelFor="user-email-input" style={{ flex: 1 }}>
            <InputGroup id="user-email-input" name="email" value={form.email} onChange={handleChange} placeholder="Email" required large />
          </FormGroup>
          <FormGroup label="Role" labelFor="user-role-input" style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
              <select id="user-role-input" name="role" value={form.role} onChange={handleChange} required style={{ width: '100%', height: '100%', fontSize: '1rem', padding: '8px' }}>
                <option value="team_member">Team Member</option>
                <option value="team_lead">Team Lead</option>
                <option value="project_manager">Project Manager</option>
              </select>
            </div>
          </FormGroup>
          <FormGroup label="Password" labelFor="user-password-input" style={{ flex: 1 }}>
            <InputGroup id="user-password-input" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required={!editId} large />
          </FormGroup>
          <Button
            type="button"
            intent="primary"
            large
            style={{ marginTop: 24, minWidth: 120 }}
            disabled={loading}
            onClick={() => {
              setEditId(null);
              setForm({ name: '', email: '', role: 'team_member', password: '' });
            }}
          >
            Create User
          </Button>
          <Button
            type="submit"
            intent="warning"
            style={{ marginTop: 24, minWidth: 120 }}
            disabled={loading || !editId}
          >
            Update User
          </Button>
          {editId && <Button type="button" onClick={() => { setEditId(null); setForm({ name: '', email: '', role: 'team_member', password: '' }); setOriginalUser(null); }}  style={{ marginTop: 24 }}>Cancel</Button>}
        </form>
        {error && <Callout intent="danger" style={{ marginBottom: 16 }}>{error}</Callout>}
        {loading ? <Spinner /> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {members.map(member => (
              <li key={member.member_id || member._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span>{member.name || member.email} <span style={{ color: '#888', fontSize: 14 }}>({member.role})</span></span>
                <span>
                  <Button  icon="edit" intent="warning" onClick={() => handleEdit(member)} />
                  <Button  icon="trash" intent="danger" onClick={() => handleDelete(member.member_id || member._id)} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default ProjectManagerUsersPage;

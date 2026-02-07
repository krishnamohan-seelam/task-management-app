import React, { useEffect, useState } from 'react';
import { Card, Elevation, FormGroup, InputGroup, Button, Callout, Spinner } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, createMemberThunk, updateMemberThunk, deleteMemberThunk } from '../dashboardSlice';

const ProjectManagerUsersPage = () => {
  const dispatch = useDispatch();
  const { members, loading, error } = useSelector(state => state.dashboard);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPassword, setMemberPassword] = useState("");


  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!memberName || !memberRole || (!editMode && !memberEmail) || (!editMode && !memberPassword)) {
      alert("Please fill in all required fields.");
      return;
    }
    const memberPayload = { name: memberName, role: memberRole, email: memberEmail, password: memberPassword };
    // For edit, maybe don't send password if empty
    if (editMode && editMemberId) {
      // API might expect different payload for update (without password if not changing)
      // For now, assuming update doesn't change password or requires distinct handling
      const updatePayload = { name: memberName, role: memberRole, email: memberEmail };
      dispatch(
        updateMemberThunk({ userId: editMemberId, member: updatePayload })
      );
    } else {
      dispatch(createMemberThunk({ member: memberPayload }));
    }

    resetForm();
  };

  // Populate form for editing a member
  const handleEdit = (member) => {
    setEditMode(true);
    setEditMemberId(member.member_id || member._id);
    setMemberName(member.name);
    setMemberRole(member.role);
    setMemberEmail(member.email || "");
    setMemberPassword(""); // Don't show password
    // Scroll to form?
  };

  // Delete a member
  const handleDelete = (memberId) => {
    dispatch(deleteMemberThunk({ userId: memberId }));

    if (editMode && editMemberId === memberId) {
      resetForm();
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setMemberName("");
    setMemberRole("");
    setMemberEmail("");
    setMemberPassword("");
    setEditMode(false);
    setEditMemberId(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f5f8fa' }}>
      <Card elevation={Elevation.TWO} style={{ width: 600, marginTop: 40, padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Manage Users</h2>
        {error && <Callout intent="danger" style={{ marginBottom: 16 }}>{error}</Callout>}
        <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
          <FormGroup label={editMode ? 'Edit Team Member' : 'Create Team Member'} labelFor="team-member">
            <InputGroup
              id="team-member"
              placeholder="Name"
              value={memberName}
              onChange={e => setMemberName(e.target.value)}
              style={{ marginBottom: 8 }}
              required
            />
            <InputGroup
              id="team-member-email"
              placeholder="Email"
              value={memberEmail}
              onChange={e => setMemberEmail(e.target.value)}
              style={{ marginBottom: 8 }}
              required
            />
            {!editMode && (
              <InputGroup
                id="team-member-password"
                placeholder="Password"
                type="password"
                value={memberPassword}
                onChange={e => setMemberPassword(e.target.value)}
                style={{ marginBottom: 8 }}
                required
              />
            )}
            <div className="bp5-select" style={{ width: '100%', marginBottom: '8px' }}>
              <select value={memberRole} onChange={(e) => setMemberRole(e.target.value)} required style={{ width: '100%' }}>
                <option value="" disabled>Select Role</option>
                <option value="project_manager">Project Manager</option>
                <option value="team_lead">Team Lead</option>
                <option value="developer">Developer</option>
                <option value="team_member">Team Member</option>
              </select>
            </div>

            <Button type="submit" intent={editMode ? "primary" : "success"}>
              {editMode ? "Update Member" : "Create Member"}
            </Button>
            {editMode && (
              <Button
                style={{ marginLeft: 8 }}
                onClick={resetForm}
                type="button"
              >
                Cancel
              </Button>
            )}
          </FormGroup>
        </form>

        {loading ? <Spinner /> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {members.map(member => (
              <li key={member.member_id || member._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ textAlign: 'left' }}>
                  <strong>{member.name}</strong>
                  <br />
                  <small style={{ color: '#888' }}>{member.email} ({member.role})</small>
                </span>

                <span>
                  <Button
                    icon="edit"
                    variant="minimal"
                    onClick={() => handleEdit(member)}
                    style={{ marginRight: 8 }}
                  />
                  <Button
                    icon="trash"
                    variant="minimal"
                    intent="danger"
                    onClick={() => handleDelete(member.member_id || member._id)}
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

export default ProjectManagerUsersPage;

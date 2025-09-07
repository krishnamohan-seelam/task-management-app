import React, { useEffect, useState } from 'react';
import { Card, Elevation, FormGroup, InputGroup, Button, Callout, Spinner } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../dashboardSlice';

const ProjectManagerUsersPage = () => {
  const dispatch = useDispatch();
  const { members, loading, error } = useSelector(state => state.dashboard);
  const token = useSelector((state) => state.user.access_token);
  // Local state for member form inputs and edit mode
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null);

  useEffect(() => {

    if (token) {
      dispatch(fetchDashboardData(token));
    }
  }, [dispatch]);

  // User creation/edit/delete logic can be refactored to use Redux thunks if needed

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!memberName || !memberRole) {
      alert("Please fill in all fields.");
      return;
    }
    const memberPayload = { name: memberName, role: memberRole };
    if (editMode && editMemberId) {
      dispatch(
        editMemberThunk({ token, memberId: editMemberId, member: memberPayload })
      );
    } else {
      dispatch(createMemberThunk({ token, member: memberPayload }));
    }

    resetForm();
  };

  // Populate form for editing a member
  const handleEdit = (member) => {
    setEditMode(true);
    setEditMemberId(member.member_id || member._id);
    setMemberName(member.name);
    setMemberRole(member.role);
  };

  // Delete a member
  const handleDelete = (memberId) => {
    dispatch(deleteMemberThunk({ token, memberId }));

    if (editMode && editMemberId === memberId) {
      resetForm();
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setMemberName("");
    setMemberRole("");
    setEditMode(false);
    setEditMemberId(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f5f8fa' }}>
      <Card elevation={Elevation.TWO} style={{ width: 600, marginTop: 40, padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Manage Users</h2>
        {/* Form logic can be refactored to use Redux actions */}
        {error && <Callout intent="danger" style={{ marginBottom: 16 }}>{error}</Callout>}
        <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
          <FormGroup label={editMode ? 'Edit Team Member' : 'Create Team Member'} labelFor="team-member">
            <InputGroup
              id="team-member"
              placeholder="Team Member"
              value={memberName}
              onChange={e => setTeamMember(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <InputGroup
              id="team-member-role"
              placeholder="Member Role"
              value={memberRole}
              onChange={(e) => setMemberRole(e.target.value)}
              style={{ marginBottom: 8 }}
            />
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
                <span>{member.name} <span style={{ color: '#888', fontSize: 14 }}>({member.role})</span></span>

                {/* Edit/Delete button logic can be added here using Redux thunks */}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default ProjectManagerUsersPage;

// API utility for backend endpoints
const API_BASE = 'http://localhost:8000';

export async function login({ username, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function fetchTasks(token) {
    //Fetch tasks from the backend based on role

  const res = await fetch(`${API_BASE}/project-manager/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function fetchTeams(token) {
  const res = await fetch(`${API_BASE}/project-manager/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch teams');
  console.log
  return res.json();
}

export async function createTeam(token, team) {
  const res = await fetch(`${API_BASE}/project-manager/create-team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(team),
  });
  if (!res.ok) throw new Error('Failed to create team');
  return res.json();
}
export async function fetchAllTeamMembers(token) {
  const res = await fetch(`${API_BASE}/project-manager/team-members`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch users');

  return res.json();
}
export async function fetchTeamMembers(token, teamId) {
  const res = await fetch(`${API_BASE}/project-manager/team-members/${teamId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function fetchTeamMembersByRole(token, role) {
  const res = await fetch(`${API_BASE}/project-manager/team-members-by-role/${role}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function updateTeam(token, teamId, team) {
  
  const res = await fetch(`${API_BASE}/project-manager/update-team/${teamId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(team),
  });
  if (!res.ok) throw new Error('Failed to update team');
  return res.json();
}

export async function deleteTeam(token, teamId) {
  const res = await fetch(`${API_BASE}/project-manager/teams/${teamId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete team');
  return res.json();
}

// Team Members (Users)
export async function createUser(token, user) {
  console.log('Creating user:', user);
  const res = await fetch(`${API_BASE}/project-manager/team-member`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

export async function updateUser(token, userId, user) {
  const res = await fetch(`${API_BASE}/project-manager/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(token, userId) {
  const res = await fetch(`${API_BASE}/project-manager/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
}

// Tasks
export async function createTask(token, task) {
  const res = await fetch(`${API_BASE}/project-manager/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTask(token, taskId, task) {
  const res = await fetch(`${API_BASE}/project-manager/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(token, taskId) {
  const res = await fetch(`${API_BASE}/project-manager/tasks/${taskId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
}

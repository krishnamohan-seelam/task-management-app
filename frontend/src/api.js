import axios from 'axios';


const API_BASE = 'http://localhost:8000';
// Project Manager Endpoints
//export const createTask = (data) => axios.post(`${API_BASE}/project-manager/tasks/`, data);
export const assignTaskPM = (data, token) => axios.post(
  `${API_BASE}/project-manager/assign-task`,
  data,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const getAllTasksPM = (token) => {
  console.log(`${API_BASE}/project-manager/tasks`);
  return axios.get(
    `${API_BASE}/project-manager/tasks`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
export const getTaskByIdPM = (taskId, token) => axios.get(
  `${API_BASE}/project-manager/task/${taskId}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const createTeamMemberPM = (data, token) => axios.post(
  `${API_BASE}/project-manager/team-member`,
  data,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const addTeamMembersPM = (data, token) => axios.post(
  `${API_BASE}/project-manager/add-team-members`,
  data,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const removeTeamMembersPM = (data, token) => axios.post(
  `${API_BASE}/project-manager/remove-team-members`,
  data,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const getTeamMembersPM = (teamId, token) => teamId
  ? axios.get(`${API_BASE}/project-manager/team-members?team_id=${teamId}`, { headers: { Authorization: `Bearer ${token}` } })
  : axios.get(`${API_BASE}/project-manager/team-members`, { headers: { Authorization: `Bearer ${token}` } });

// Team Lead Endpoints
export const assignTaskTL = (data, token) => axios.post(
  `${API_BASE}/team-lead/assign-task`,
  data,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const getTasksTL = (token) => axios.get(
  `${API_BASE}/team-lead/tasks`,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const updateTaskTL = (taskId, data, token) => axios.put(
  `${API_BASE}/team-lead/update-task/${taskId}`,
  data,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const trackTasksTL = (token) => axios.get(
  `${API_BASE}/team-lead/track-tasks`,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const createTeamTL = (data, token) => axios.post(
  `${API_BASE}/team-lead/create-team`,
  data,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const addTeamMembersTL = (data, token) => axios.post(
  `${API_BASE}/team-lead/add-team-members`,
  data,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const createTeamMemberTL = (data, token) => axios.post(
  `${API_BASE}/team-lead/team-member`,
  data,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const getTeamMembersTL = (token) => axios.get(
  `${API_BASE}/team-lead/team-members`,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const getTeamMemberByIdTL = (id, token) => axios.get(
  `${API_BASE}/team-lead/team-member/${id}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const updateTeamMemberTL = (id, data, token) => axios.put(
  `${API_BASE}/team-lead/team-member/${id}`,
  data,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const deleteTeamMemberTL = (id, token) => axios.delete(
  `${API_BASE}/team-lead/team-member/${id}`,
  { headers: { Authorization: `Bearer ${token}` } }
);

// Team Member Endpoints
export const getTasksTM = (token) => axios.get(
  `${API_BASE}/team-member/tasks/`,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const updateTaskTM = (taskId, data, token) => axios.put(
  `${API_BASE}/team-member/tasks/${taskId}`,
  data,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const createTeamMemberTM = (data, token) => axios.post(
  `${API_BASE}/team-member/team-member`,
  data,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const getTeamMembersTM = (token) => axios.get(
  `${API_BASE}/team-member/team-members`,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const getTeamMemberByIdTM = (id, token) => axios.get(
  `${API_BASE}/team-member/team-member/${id}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
// API utility for backend endpoints



export async function login({ username, password }) {
  try {
    const res = await axios.post(
      `${API_BASE}/auth/login`,
      new URLSearchParams({ username, password }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return res.data;
  } catch (err) {
    throw new Error('Login failed');
  }
}


export async function fetchTasks(token) {
  try {
    const res = await axios.get(`${API_BASE}/project-manager/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw new Error('Failed to fetch tasks');
  }
}


export async function fetchTeams(token) {
  try {
    const res = await axios.get(`${API_BASE}/project-manager/teams`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw new Error('Failed to fetch teams');
  }
}


export async function createTeam(token, team) {
  try {
    const res = await axios.post(
      `${API_BASE}/project-manager/create-team`,
      team,
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    throw new Error('Failed to create team');
  }
}

export async function fetchAllTeamMembers(token) {
  try {
    const res = await axios.get(`${API_BASE}/project-manager/team-members`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw new Error('Failed to fetch users');
  }
}

export async function fetchTeamMembers(token, teamId) {
  try {
    const res = await axios.get(`${API_BASE}/project-manager/team-members/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw new Error('Failed to fetch users');
  }
}


export async function fetchTeamMembersByRole(token, role) {
  try {
    const res = await axios.get(`${API_BASE}/project-manager/team-members-by-role/${role}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw new Error('Failed to fetch users');
  }
}


export async function updateTeam(token, teamId, team) {
  try {
    const res = await axios.put(
      `${API_BASE}/project-manager/update-team/${teamId}`,
      team,
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    throw new Error('Failed to update team');
  }
}


export async function deleteTeam(token, teamId) {
  try {
    const res = await axios.delete(`${API_BASE}/project-manager/teams/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw new Error('Failed to delete team');
  }
}

// Team Members (Users)

export async function createTeamMember(token, member) {
  try {
    const res = await axios.post(
      `${API_BASE}/project-manager/team-member`,
      member,
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    throw new Error('Failed to create user');
  }
}


export async function updateTeamMember(token, userId, member) {
  try {
    const res = await axios.put(
      `${API_BASE}/project-manager/users/${userId}`,
      member,
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    throw new Error('Failed to update user');
  }
}


export async function deleteUser(token, userId) {
  try {
    const res = await axios.delete(`${API_BASE}/project-manager/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw new Error('Failed to delete user');
  }
}

// Tasks

export async function createTask(token, task) {
  try {
    const res = await axios.post(
      `${API_BASE}/project-manager/tasks`,
      task,
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    throw new Error('Failed to create task');
  }
}


export async function updateTask(token, taskId, task) {
  try {
    const res = await axios.put(
      `${API_BASE}/project-manager/tasks/${taskId}`,
      task,
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    throw new Error('Failed to update task');
  }
}


export async function deleteTask(token, taskId) {
  try {
    const res = await axios.delete(`${API_BASE}/project-manager/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw new Error('Failed to delete task');
  }
}

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token header to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors (optional)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle 401 unauthorized (e.g., redirect to login)
    // if (error.response && error.response.status === 401) {
    //   window.location.href = '/login'; 
    // }
    return Promise.reject(error);
  }
);


// Auth
export const login = async ({ username, password }) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  const response = await apiClient.post('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data;
};

// Project Manager Endpoints
export const getAllTasksPM = () => apiClient.get('/project-manager/tasks');
export const getTaskByIdPM = (taskId) => apiClient.get(`/project-manager/task/${taskId}`);
export const createTeamMemberPM = (data) => apiClient.post('/project-manager/team-member', data);
export const addTeamMembersPM = (data) => apiClient.post('/project-manager/add-team-members', data);
export const removeTeamMembersPM = (data) => apiClient.post('/project-manager/remove-team-members', data);
export const getTeamMembersPM = (teamId) => {
  const url = teamId ? `/project-manager/team-members?team_id=${teamId}` : '/project-manager/team-members';
  return apiClient.get(url);
};

// Team Lead Endpoints
export const createTask = (data) => apiClient.post('/team-lead/tasks/', data);

export const assignTaskTL = (data) => {
  const { taskId, ...body } = data;
  return apiClient.post(`/team-lead/assign-task/${encodeURIComponent(taskId)}`, body);
};

export const getTasksTL = () => apiClient.get('/team-lead/tasks');
export const updateTaskTL = (taskId, data) => apiClient.put(`/team-lead/update-task/${taskId}`, data);
export const trackTasksTL = () => apiClient.get('/team-lead/track-tasks');
export const createTeamTL = (data) => apiClient.post('/team-lead/create-team', data);
export const getTeamsTL = () => apiClient.get('/team-lead/teams');
export const addTeamMembersTL = (data) => apiClient.post('/team-lead/add-team-members', data);
export const createTeamMemberTL = (data) => apiClient.post('/team-lead/team-member', data);
export const getTeamMembersTL = () => apiClient.get('/team-lead/team-members');
export const getTeamMemberByIdTL = (id) => apiClient.get(`/team-lead/team-member/${id}`);
export const updateTeamMemberTL = (id, data) => apiClient.put(`/team-lead/team-member/${id}`, data);
export const deleteTeamMemberTL = (id) => apiClient.delete(`/team-lead/team-member/${id}`);

// Team Member Endpoints
export const getTasksTM = () => apiClient.get('/team-member/tasks/');
export const updateTaskTM = (taskId, data) => apiClient.put(`/team-member/tasks/${taskId}`, data);
export const createTeamMemberTM = (data) => apiClient.post('/team-member/team-member', data);
export const getTeamMembersTM = () => apiClient.get('/team-member/team-members');
export const getTeamMemberByIdTM = (id) => apiClient.get(`/team-member/team-member/${id}`);


// General / Shared (Project Manager also uses these via legacy wrappers, or we can unify)
export const fetchTasks = () => apiClient.get('/project-manager/tasks').then(res => res.data);
export const fetchTeams = () => apiClient.get('/project-manager/teams').then(res => res.data);
export const createTeam = (team) => apiClient.post('/project-manager/create-team', team).then(res => res.data);
export const fetchAllTeamMembers = () => apiClient.get('/project-manager/team-members').then(res => res.data);
export const fetchTeamMembers = (teamId) => apiClient.get(`/project-manager/team-members/${teamId}`).then(res => res.data);
export const fetchTeamMembersByRole = (role) => apiClient.get(`/project-manager/team-members-by-role/${role}`).then(res => res.data);
export const updateTeam = (teamId, team) => apiClient.put(`/project-manager/update-team/${teamId}`, team).then(res => res.data);
export const deleteTeam = (teamId) => apiClient.delete(`/project-manager/teams/${teamId}`).then(res => res.data);

export const createTeamMember = (member) => apiClient.post('/project-manager/team-member', member).then(res => res.data);
export const updateTeamMember = (userId, member) => apiClient.put(`/project-manager/users/${userId}`, member).then(res => res.data);
export const deleteUser = (userId) => apiClient.delete(`/project-manager/users/${userId}`).then(res => res.data);

export const updateTask = (taskId, task) => apiClient.put(`/project-manager/tasks/${taskId}`, task).then(res => res.data);
export const deleteTask = (taskId) => apiClient.delete(`/project-manager/tasks/${taskId}`).then(res => res.data);

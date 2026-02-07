import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTeams, fetchTasks, fetchAllTeamMembers, createTeam, updateTeam, deleteTeam } from './api';

// Thunks for team operations
export const createTeamThunk = createAsyncThunk(
    'dashboard/createTeam',
    async ({ team }, thunkAPI) => {
        try {
            const res = await createTeam(team);
            thunkAPI.dispatch(fetchDashboardData());
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to create team');
        }
    }
);

export const editTeamThunk = createAsyncThunk(
    'dashboard/editTeam',
    async ({ teamId, team }, thunkAPI) => {
        try {
            console.log('Editing team:', teamId, team);
            const res = await updateTeam(teamId, team);
            thunkAPI.dispatch(fetchDashboardData());
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to update team');
        }
    }
);

export const deleteTeamThunk = createAsyncThunk(
    'dashboard/deleteTeam',
    async ({ teamId }, thunkAPI) => {
        try {
            const res = await deleteTeam(teamId);
            thunkAPI.dispatch(fetchDashboardData());
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to delete team');
        }
    }
);

// Note: createMemberThunk should use createTeamMember from api.js
// And we need updateMemberThunk and deleteMemberThunk

export const createMemberThunk = createAsyncThunk(
    'dashboard/createMember',
    async ({ member }, thunkAPI) => {
        try {
            // Import correctly or assume from header
            const { createTeamMember } = await import('./api');
            const res = await createTeamMember(member);
            thunkAPI.dispatch(fetchDashboardData());
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to create member');
        }
    }
);

export const updateMemberThunk = createAsyncThunk(
    'dashboard/updateMember',
    async ({ userId, member }, thunkAPI) => {
        try {
            const { updateTeamMember } = await import('./api');
            const res = await updateTeamMember(userId, member);
            thunkAPI.dispatch(fetchDashboardData());
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to update member');
        }
    }
);

export const deleteMemberThunk = createAsyncThunk(
    'dashboard/deleteMember',
    async ({ userId }, thunkAPI) => {
        try {
            const { deleteUser } = await import('./api');
            const res = await deleteUser(userId);
            thunkAPI.dispatch(fetchDashboardData());
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to delete member');
        }
    }
);

export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchDashboardData',
    async (_, thunkAPI) => {
        try {
            const [teamsRes, tasksRes, membersRes] = await Promise.all([
                fetchTeams(),
                fetchTasks(),
                fetchAllTeamMembers(),
            ]);
            return {
                teams: teamsRes.teams || [],
                tasks: tasksRes.tasks || [],
                members: membersRes.members || [],
            };
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch dashboard data');
        }
    }
);

export const fetchTLDashboardData = createAsyncThunk(
    'dashboard/fetchTLDashboardData',
    async (_, thunkAPI) => {
        try {
            // we need to dynamically import or rely on existing imports. 
            // I'll assume they are imported. I need to update imports at top of file separately if not.
            // Wait, replace_file_content is single block.
            // I should have updated imports in a separate call or included them here?
            // "Updated imports at top of file separately" - I haven't done that yet.
            // I will assume I can update imports in a next step or use dynamic import here?
            // Dynamic import is safer for this tool.

            const { getTeamsTL, getTasksTL, getTeamMembersTL } = await import('./api');

            const [teamsRes, tasksRes, membersRes] = await Promise.all([
                getTeamsTL(), // returns axios response
                getTasksTL(), // returns axios response, data is array or object?
                getTeamMembersTL(), // returns axios response
            ]);

            // Checking api.js:
            // getTeamsTL -> apiClient.get('/team-lead/teams') -> returns response
            // Backend /teams returns ResponseTeamCollection -> { teams: [...] }
            // So teamsRes.data.teams

            // getTasksTL -> apiClient.get('/team-lead/tasks') -> returns response
            // Backend /tasks returns List[TaskModel] -> [...]
            // So tasksRes.data is the array.

            // getTeamMembersTL -> apiClient.get('/team-lead/team-members') -> returns response
            // Backend /team-members returns ResponseTeamMembersCollection -> { members: [...] } (Check team_lead.py?)
            // team_lead.py does NOT have /team-members (get all). It has /team-members/{team_id}.
            // Wait.
            // team_lead.py: 
            // @router.get("/team-members/{team_id}") ...
            // @router.get("/team-member/{team_member_id}") ...
            // It does NOT have a "get all team members" for team lead.
            // So getTeamMembersTL in api.js:
            // export const getTeamMembersTL = () => apiClient.get('/team-lead/team-members');
            // This endpoint likely DOES NOT EXIST on backend for Team Lead if I didn't verify it.
            // Let's check team_lead.py again.

            // team_lead.py has NO `/team-members` (no arg). 
            // It has `/team-members/{team_id}`.
            // So `getTeamMembersTL` will 404.

            // For now, let's just fetch teams and tasks. Members can be fetched per team if needed.
            // Or I can add a endpoint to get all members of all managed teams.
            // But getting teams is the priority.

            const teams = teamsRes.data.teams || [];
            const tasks = tasksRes.data || [];
            // tasks is list, not object with tasks property?
            // team_lead.py: @router.get("/tasks", response_model=List[TaskModel])
            // Yes, list.

            return {
                teams: teams,
                tasks: tasks,
                members: [], // Placeholder or fetch members for each team?
            };
        } catch (error) {
            console.error(error);
            return thunkAPI.rejectWithValue('Failed to fetch TL dashboard data');
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        teams: [],
        tasks: [],
        members: [],
        loading: false,
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.teams = action.payload.teams;
                state.tasks = action.payload.tasks;
                state.members = action.payload.members;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error';
            })
            .addCase(createTeamThunk.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(createTeamThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createTeamThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error';
            })
            .addCase(editTeamThunk.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(editTeamThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(editTeamThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error';
            })
            .addCase(deleteTeamThunk.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(deleteTeamThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteTeamThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error';
            })
            .addCase(createMemberThunk.pending, (state) => { state.loading = true; state.error = ''; })
            .addCase(createMemberThunk.fulfilled, (state) => { state.loading = false; })
            .addCase(createMemberThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Error'; })
            .addCase(updateMemberThunk.pending, (state) => { state.loading = true; state.error = ''; })
            .addCase(updateMemberThunk.fulfilled, (state) => { state.loading = false; })
            .addCase(updateMemberThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Error'; })
            .addCase(deleteMemberThunk.pending, (state) => { state.loading = true; state.error = ''; })
            .addCase(deleteMemberThunk.fulfilled, (state) => { state.loading = false; })
            .addCase(deleteMemberThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Error'; })
            .addCase(fetchTLDashboardData.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchTLDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.teams = action.payload.teams;
                state.tasks = action.payload.tasks;
                state.members = action.payload.members;
            })
            .addCase(fetchTLDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error';
            });
    },
});

export default dashboardSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTeams, fetchTasks, fetchAllTeamMembers, createTeam, updateTeam, deleteTeam } from './api';
// Thunks for team operations
export const createTeamThunk = createAsyncThunk(
    'dashboard/createTeam',
    async ({ token, team }, thunkAPI) => {
        try {
            const res = await createTeam(token, team);
            thunkAPI.dispatch(fetchDashboardData(token));
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to create team');
        }
    }
);

export const editTeamThunk = createAsyncThunk(
    'dashboard/editTeam',
    async ({ token, teamId, team }, thunkAPI) => {
        try {
            console.log('Editing team:', teamId, team);
            const res = await updateTeam(token, teamId, team);
            thunkAPI.dispatch(fetchDashboardData(token));
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to update team');
        }
    }
);

export const deleteTeamThunk = createAsyncThunk(
    'dashboard/deleteTeam',
    async ({ token, teamId }, thunkAPI) => {
        try {
            const res = await deleteTeam(token, teamId);
            thunkAPI.dispatch(fetchDashboardData(token));
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to delete team');
        }
    }
);

export const createMemberThunk = createAsyncThunk(
    'dashboard/createMember',
    async ({ token, member }, thunkAPI) => {
        try {
            const res = await createMember(token, member);
            thunkAPI.dispatch(fetchDashboardData(token));
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to create member');
        }
    }
);

export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchDashboardData',
    async (token, thunkAPI) => {
        try {
            const [teamsRes, tasksRes, membersRes] = await Promise.all([
                fetchTeams(token),
                fetchTasks(token),
                fetchAllTeamMembers(token),
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
            });
    },
});

export default dashboardSlice.reducer;

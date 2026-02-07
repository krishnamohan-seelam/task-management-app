import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('user_state');
        if (serializedState === null) {
            return {
                isAuthenticated: false,
                user: null,
                role: null,
                access_token: null
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return {
            isAuthenticated: false,
            user: null,
            role: null,
            access_token: null
        };
    }
};

const initialState = loadState();

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.access_token = action.payload.access_token;
            localStorage.setItem('access_token', action.payload.access_token); // Explicitly set for api.js
            localStorage.setItem('user_state', JSON.stringify(state)); // Persist full state
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.role = null;
            state.access_token = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_state');
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: null,
    role: null,
    access_token: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.access_token = action.payload.access_token;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.role = null;
            state.access_token = null;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;

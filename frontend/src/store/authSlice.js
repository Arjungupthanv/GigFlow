import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Registration failed' });
    }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Logout failed' });
    }
});

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to get user' });
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, isAuthenticated: false, loading: false, error: null },
    reducers: {
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(register.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; })
            .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'Registration failed'; })
            .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(login.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; })
            .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'Login failed'; })
            .addCase(logout.fulfilled, (state) => { state.user = null; state.isAuthenticated = false; })
            .addCase(getCurrentUser.pending, (state) => { state.loading = true; })
            .addCase(getCurrentUser.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; })
            .addCase(getCurrentUser.rejected, (state) => { state.loading = false; state.isAuthenticated = false; state.user = null; });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

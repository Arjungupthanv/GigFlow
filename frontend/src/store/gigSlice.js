import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchGigs = createAsyncThunk('gigs/fetchGigs', async (searchQuery = '', { rejectWithValue }) => {
    try {
        const response = await api.get(`/gigs?search=${searchQuery}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to fetch gigs' });
    }
});

export const fetchGigById = createAsyncThunk('gigs/fetchGigById', async (gigId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/gigs/${gigId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to fetch gig' });
    }
});

export const createGig = createAsyncThunk('gigs/createGig', async (gigData, { rejectWithValue }) => {
    try {
        const response = await api.post('/gigs', gigData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to create gig' });
    }
});

export const fetchBidsForGig = createAsyncThunk('gigs/fetchBidsForGig', async (gigId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/bids/${gigId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to fetch bids' });
    }
});

export const submitBid = createAsyncThunk('gigs/submitBid', async (bidData, { rejectWithValue }) => {
    try {
        const response = await api.post('/bids', bidData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to submit bid' });
    }
});

export const hireBid = createAsyncThunk('gigs/hireBid', async (bidId, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/bids/${bidId}/hire`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to hire freelancer' });
    }
});

const gigSlice = createSlice({
    name: 'gigs',
    initialState: { gigs: [], currentGig: null, bids: [], loading: false, error: null, success: null },
    reducers: {
        clearError: (state) => { state.error = null; },
        clearSuccess: (state) => { state.success = null; },
        clearCurrentGig: (state) => { state.currentGig = null; state.bids = []; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGigs.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchGigs.fulfilled, (state, action) => { state.loading = false; state.gigs = action.payload.gigs; })
            .addCase(fetchGigs.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'Failed to fetch gigs'; })
            .addCase(fetchGigById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchGigById.fulfilled, (state, action) => { state.loading = false; state.currentGig = action.payload.gig; })
            .addCase(fetchGigById.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'Failed to fetch gig'; })
            .addCase(createGig.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createGig.fulfilled, (state, action) => { state.loading = false; state.success = action.payload.message; state.gigs.unshift(action.payload.gig); })
            .addCase(createGig.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'Failed to create gig'; })
            .addCase(fetchBidsForGig.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchBidsForGig.fulfilled, (state, action) => { state.loading = false; state.bids = action.payload.bids; })
            .addCase(fetchBidsForGig.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'Failed to fetch bids'; })
            .addCase(submitBid.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(submitBid.fulfilled, (state, action) => { state.loading = false; state.success = action.payload.message; })
            .addCase(submitBid.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'Failed to submit bid'; })
            .addCase(hireBid.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(hireBid.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.message;
                // Update current gig status
                if (state.currentGig) {
                    state.currentGig.status = 'assigned';
                }
                // Update bids array - mark hired bid as 'hired' and others as 'rejected'
                const hiredBid = action.payload.bid;
                state.bids = state.bids.map(bid => {
                    if (bid._id === hiredBid._id) {
                        return { ...bid, status: 'hired' };
                    } else if (bid.status === 'pending') {
                        return { ...bid, status: 'rejected' };
                    }
                    return bid;
                });
            })
            .addCase(hireBid.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'Failed to hire freelancer'; });
    },
});

export const { clearError, clearSuccess, clearCurrentGig } = gigSlice.actions;
export default gigSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import gigReducer from './gigSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        gigs: gigReducer,
    },
});

export default store;

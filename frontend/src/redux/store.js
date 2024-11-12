import {configureStore} from '@reduxjs/toolkit';
import miscSlice from './reducers/misc';
import authSlice from './reducers/auth';

const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [miscSlice.name]: miscSlice.reducer
    }
})

export default store;
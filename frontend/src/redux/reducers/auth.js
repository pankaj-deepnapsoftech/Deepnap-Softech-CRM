import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    id: null,
    name: null,
    email: null,
    role: null,
    allowedroutes: []
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userExists: (state, action)=>{
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.role = action.payload.role;
            state.allowedroutes = action.payload.allowedroutes;
        },
        userNotExists: (state)=>{
            state.id = null;
            state.email = null;
            state.name = null;
            state.role = null;
            state.allowedroutes = [];
        }
    }
})

export default authSlice;
export const {
    userExists,
    userNotExists
} = authSlice.actions;
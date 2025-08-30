import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: undefined,
    firstname: undefined,
    lastname: undefined,
    email: undefined,
    phone: undefined,
    role:undefined,
    allowedroutes: [],
    isSuper: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userExists: (state, action)=>{
            state.id = action.payload._id;
            state.firstname = action.payload.first_name;
            state.lastname = action.payload.last_name;
            state.email = action.payload.email;
            state.phone = action.payload.phone;
            state.allowedroutes = action.payload?.role?.permissions || [];
            state.isSuper = action.payload.isSuper;
            state.role = action.payload.role.role || action.payload.role
        },
        userNotExists: (state)=>{
            state.id = undefined;
            state.firstname = undefined;
            state.lastname = undefined;
            state.email = undefined;
            state.phone = undefined;
            state.allowedroutes = [];
            state.isSuper = false;
        }
    }
});

export default authSlice;
export const {userExists, userNotExists} = authSlice.actions;
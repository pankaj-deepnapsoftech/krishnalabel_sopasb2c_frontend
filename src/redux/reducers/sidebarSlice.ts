import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showIcons: true,
    changewidth: false,
}

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setShowIcons: (state, action)=>{
            state.showIcons = action.payload.showIcons;
        },
        setWidth: (state, action)=>{
            state.changewidth = action.payload.changewidth;
        },
    }
});

export default sidebarSlice;
export const {setShowIcons, setWidth} = sidebarSlice.actions;
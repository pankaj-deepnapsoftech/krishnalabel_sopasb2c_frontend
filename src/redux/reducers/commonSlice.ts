import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    update:0,
}

const CommonSlice = createSlice({
    name:"Common",
    initialState,
    reducers:{
        updateData:(state,action)=>{
            state.update += action.payload;
        }
    }
})

export default CommonSlice
export const {updateData} = CommonSlice.actions
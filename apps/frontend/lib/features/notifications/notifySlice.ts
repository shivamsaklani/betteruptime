import { notice } from "@/redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



const initialState:notice[] = [];

const notifySlice = createSlice({
    name:"notifications",
    initialState,
    reducers:{
        setnotification:(state,action:PayloadAction<notice[]>)=>{
          return action.payload;
        },
        addnotification:(state,action:PayloadAction<notice>) =>{
            state.push(action.payload);
        },
        removenotifcation:(state,action:PayloadAction<string>)=>{
            return (state.filter(n=>n.id != action.payload));
        },
        clearnotification:()=>{
            return [];
        }
    },
});


export const {setnotification , addnotification, removenotifcation,clearnotification }= notifySlice.actions;
export default notifySlice.reducer;
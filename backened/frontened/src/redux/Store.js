import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice"
import ownerSlice from "./ownerSlice"
import mapSlice from "./mapSlice"

export const Store = configureStore({
    reducer:{
       user:userSlice,
       owner:ownerSlice,
       map: mapSlice   
    }
    
})
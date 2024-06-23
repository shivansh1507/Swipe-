import { combineReducers } from "@reduxjs/toolkit";
import invoicesReducer from "./invoicesSlice"; 

const rootReducer = combineReducers({
  invoices: invoicesReducer,
});

export default rootReducer;

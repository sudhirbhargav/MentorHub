// src/redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./actions/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;

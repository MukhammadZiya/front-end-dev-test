import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import uiReducer from "./uiSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    ui: uiReducer,
  },
});

export default store;

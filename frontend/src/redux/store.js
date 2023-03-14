import { configureStore } from "@reduxjs/toolkit";
import attendancesReducer from "./admin/index";
import userReducer from "./admin/index";
export default configureStore({
  reducer: {
    allAttendancesSlice: attendancesReducer,
    userSlice: userReducer

  },
  devTools: process.env.NODE_ENV === "development",
});

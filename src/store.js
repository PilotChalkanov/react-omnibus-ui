import { configureStore } from "@reduxjs/toolkit";
import { alertReducer } from "./features/alert/alert.slice";
import { authReducer } from "./features/account/auth.slice";
import { usersReducer } from "./features/users/users.slice";
import { connectionReducer } from "./features/connections/connection.slice";

const store = configureStore({
  reducer: {
    alert: alertReducer,
    auth: authReducer,
    users: usersReducer,
    connection: connectionReducer,
  },
});

export default store;

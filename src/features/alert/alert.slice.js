import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    success: (state, action) =>
      setAlertState(state, "alert-success", action.payload),
    error: (state, action) =>
      setAlertState(state, "alert-danger", action.payload),
    clear: (state) => {
      if (state.value?.showAfterRedirect) {
        state.value.showAfterRedirect = false;
      } else {
        state.value = null;
      }
    },
  },
});

// Helper function to set alert state
const setAlertState = (state, type, payload) => {
  state.value = {
    type,
    message: payload.message,
    showAfterRedirect: payload.showAfterRedirect,
  };
};

// Exports
export const alertActions = alertSlice.actions;
export const alertReducer = alertSlice.reducer;

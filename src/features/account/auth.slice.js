import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { alertActions } from "../alert/alert.slice";
import { fetchWrapper } from "../../services";
import { BASE_URL } from "../../config";

// Slice Initialization
const name = "auth";
const initialState = {
  value: null, // No longer using localStorage to store token
};

// Slice definition
const authSlice = createSlice({
  name,
  initialState,
  reducers: {
    setAuth(state, action) {
      state.value = action.payload; // Set the authenticated user data
      state.loading = false; // Authentication check is complete
    },
    clearAuth(state) {
      state.value = null; // Clear user state on logout
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload; // Explicitly set loading state
    },
  },
});

// Async Actions
const login = createAsyncThunk(
  `${name}/login`,
  async ({ username, password }, { dispatch }) => {
    const user = await fetchWrapper.post(`${BASE_URL}/authenticate`, {
      username,
      password,
    });
    dispatch(authActions.setAuth(user)); // Set authenticated user in state
  }
);

const logout = createAsyncThunk(`${name}/logout`, async (arg, { dispatch }) => {
  await fetchWrapper.post(`${BASE_URL}/logout`);
  dispatch(authActions.clearAuth()); // Clear user on logout
});

const recovery = createAsyncThunk(
  `${name}/recovery`,
  async ({ email }, { dispatch }) => {
    dispatch(alertActions.clear());

    try {
      // Mock API call - replace with actual API endpoint
      await fetchWrapper.post(`${BASE_URL}/recovery`, { email });
      console.log(`Recovery email sent to ${email}`);
    } catch (error) {
      dispatch(alertActions.error(error.message || "An error occurred"));
    }
  }
);

// Thunk to load auth state from cookies
const loadAuthFromCookie = createAsyncThunk(
  `${name}/loadAuthFromCookie`,
  async (_, { dispatch }) => {
    dispatch(authActions.setLoading(true));
    const authToken = getCookie("authToken");

    if (authToken) {
      try {
        const user = await fetchWrapper.get(`${BASE_URL}/${name}/me`);
        dispatch(authActions.setAuth(user));
      } catch (error) {
        console.error("Error fetching user:", error);
        dispatch(authActions.clearAuth());
      }
    } else {
      dispatch(authActions.clearAuth()); // No token found, clear auth
    }
  }
);

// Helper function to get cookies by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Selectors

export const getAuth = (state) => state.auth.value;
export const getAuthLoading = (state) => state.auth.loading;

// Export actions and reducer
export const authActions = {
  ...authSlice.actions,
  login,
  logout,
  recovery,
  loadAuthFromCookie,
};
export const authReducer = authSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authActions } from "../account/auth.slice";
import { fetchWrapper } from "../../services";
import { BASE_URL } from "../../config";

// Constants
const name = "users";

// Initial State
const initialState = {
  list: { data: null, loading: false, error: null },
  item: { data: null, loading: false, error: null },
};

// Async Actions
const register = createAsyncThunk(`${name}/register`, async (user) => {
  return await fetchWrapper.post(`${BASE_URL}/register`, user);
});

const getAll = createAsyncThunk(`${name}/getAll`, async () => {
  return await fetchWrapper.get(`${BASE_URL}/users`);
});

const getById = createAsyncThunk(`${name}/getById`, async (id) => {
  return await fetchWrapper.get(`${BASE_URL}/${id}`);
});

const update = createAsyncThunk(
  `${name}/update`,
  async ({ id, data }, { getState, dispatch }) => {
    await fetchWrapper.put(`${BASE_URL}/${id}`, data);

    const auth = getState().auth.value;
    if (id === auth?.id.toString()) {
      const user = { ...auth, ...data };
      // localStorage.setItem("auth", JSON.stringify(user));
      dispatch(authActions.setAuth(user));
    }
  }
);

const deleteUser = createAsyncThunk(
  `${name}/delete`,
  async (id, { getState, dispatch }) => {
    await fetchWrapper.delete(`${BASE_URL}/${id}`);

    // Auto-logout if the deleted user is the current logged-in user
    if (id === getState().auth.value?.id) {
      dispatch(authActions.logout());
    }
  }
);

// Slice Definition
const usersSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getAll
      .addCase(getAll.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(getAll.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload;
      })
      .addCase(getAll.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.error.message;
      })

      // Handle getById
      .addCase(getById.pending, (state) => {
        state.item.loading = true;
        state.item.error = null;
      })
      .addCase(getById.fulfilled, (state, action) => {
        state.item.loading = false;
        state.item.data = action.payload;
      })
      .addCase(getById.rejected, (state, action) => {
        state.item.loading = false;
        state.item.error = action.error.message;
      })

      // Handle delete
      .addCase(deleteUser.pending, (state, action) => {
        const user = state.list.data?.find((x) => x.id === action.meta.arg);
        if (user) user.isDeleting = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list.data = state.list.data?.filter(
          (x) => x.id !== action.meta.arg
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        const user = state.list.data?.find((x) => x.id === action.meta.arg);
        if (user) user.isDeleting = false;
      });
  },
});

// Exports
export const userActions = {
  register,
  getAll,
  getById,
  update,
  delete: deleteUser,
};
export const usersReducer = usersSlice.reducer;

// Selectors
export const getUsers = (state) => state.users.list;

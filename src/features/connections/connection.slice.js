import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { CONNECTIONS_URL, PAIRS_URL } from "../../config";
import { fetchWrapper } from "../../services";
import { sampleServices } from "../../services/connection-services";

const name = "connection";

// Initial state
const initialState = {
  pairedConnections: [],
  services: [...sampleServices],
  connectionList: [],
  item: { data: null },
  loading: false,
  error: null,
};

// Async Thunks

const fetchConnections = createAsyncThunk(
  `${name}/fetchConnections`,
  async () => {
    return await fetchWrapper.get(CONNECTIONS_URL);
  }
);

// receives 'newConnection' object as argument
const addConnection = createAsyncThunk(
  `${name}/addConnection`,
  async (newConnection) => {
    console.log(newConnection);
    return await fetchWrapper.post(`${CONNECTIONS_URL}/add`, newConnection);
  }
);

// receives 'data' as argument; object containing the updated properties
const updateConnection = createAsyncThunk(
  `${name}/updateConnection`,
  async ({ id, data }) => {
    await fetchWrapper.put(`${CONNECTIONS_URL}/${id}`, data);
  }
);
//
const getConnectionById = createAsyncThunk(
  `${name}/getConnectionById`,
  async (id) => {
    return await fetchWrapper.get(`${CONNECTIONS_URL}/${id}`);
  }
);

// receives 'connectionId' as an argument
// IDs are currently set as strings
const removeConnection = createAsyncThunk(
  `${name}/removeConnection`,
  async (connectionId) => {
    await fetchWrapper.delete(`${CONNECTIONS_URL}/${connectionId}`);
  }
);

const fetchPairedConnections = createAsyncThunk(
  `${name}/fetchPairedConnections`,
  async () => await fetchWrapper.get(PAIRS_URL)
);

// receives 'pair' as an argument
// an array with with the two connection IDs
const pairConnections = createAsyncThunk(
  `${name}/pairConnections`,
  async (pair, { dispatch }) => {
    await fetchWrapper.post(`${PAIRS_URL}/add`, pair);
    await dispatch(connectionActions.fetchPairedConnections()).unwrap();
    return;
  }
);

// receives 'pair' as an argument
// an array with with the two connection IDs
const unpairConnections = createAsyncThunk(
  `${name}/unpairConnections`,
  async (pair, { dispatch }) => {
    await fetchWrapper.delete(`${PAIRS_URL}/unpair`, pair);
    await dispatch(connectionActions.fetchPairedConnections()).unwrap();
    return;
  }
);

const removeAllPairs = createAsyncThunk(
  `${name}/removeAllPairs`,
  async (id) => {
    await fetchWrapper.delete(`${PAIRS_URL}/${id}`);
    return;
  }
);

// Connection Slice
const connectionSlice = createSlice({
  name,
  initialState,
  reducers: {
    setError(state, action) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConnections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.loading = false;
        state.connectionList = action.payload;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch connections";
      })

      .addCase(addConnection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addConnection.fulfilled, (state, action) => {
        state.loading = false;
        state.connectionList.push(action.payload);
      })
      .addCase(addConnection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add connection";
      })

      .addCase(getConnectionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConnectionById.fulfilled, (state, action) => {
        state.loading = false;
        state.item.data = action.payload;
      })
      .addCase(getConnectionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(removeConnection.pending, (state, action) => {
        const connection = state.connectionList?.find(
          (x) => x.id === action.meta.arg
        );
        if (connection) state.loading = true;
      })
      .addCase(removeConnection.fulfilled, (state, action) => {
        state.connectionList = state.connectionList.filter(
          (connection) => connection.id !== action.meta.arg
        );
        state.loading = false;
      })
      .addCase(removeConnection.rejected, (state, action) => {
        const connection = state.connectionList?.find(
          (x) => x.id === action.meta.arg
        );
        if (connection) state.loading = false;
      })

      .addCase(fetchPairedConnections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPairedConnections.fulfilled, (state, action) => {
        state.loading = false;
        state.pairedConnections = action.payload;
      })
      .addCase(fetchPairedConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch paired connections";
      })
      .addCase(pairConnections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pairConnections.fulfilled, (state, action) => {
        state.loading = false;
        state.pairedConnections.push(action.payload);
      })
      .addCase(pairConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to pair connections";
      })
      .addCase(unpairConnections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unpairConnections.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(unpairConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to unpair connections";
      })

      .addCase(removeAllPairs.pending, (state, action) => {
        const pair = state.pairedConnections?.find((x) =>
          x.includes(action.meta.arg)
        );
        if (pair) state.loading = true;
      })
      .addCase(removeAllPairs.fulfilled, (state, action) => {
        state.pairedConnections = state.pairedConnections.filter(
          (pair) => !pair?.includes(action.meta.arg)
        );
        state.loading = false;
      })
      .addCase(removeAllPairs.rejected, (state, action) => {
        const pair = state.pairedConnections?.find((x) =>
          x.includes(action.meta.arg)
        );
        if (pair) state.loading = false;
      });
  },
});

// Exports
export const connectionReducer = connectionSlice.reducer;
export const connectionActions = {
  fetchConnections,
  addConnection,
  updateConnection,
  removeConnection,
  getConnectionById,
  fetchPairedConnections,
  pairConnections,
  unpairConnections,
  removeAllPairs,
  ...connectionSlice.actions,
};

// Selectors
export const getAllServices = (state) => state.connection.services;
export const getAllConnections = (state) => state.connection.connectionList;
export const getPairedConnections = (state) =>
  state.connection.pairedConnections;
export const getLoadingState = (state) => state.connection.loading;
export const getErrorMessage = (state) => state.connection.error;
export const getExistingConnection = (state) => state.connection.item.data;

// Selector to Find Paired Connections by ID
// Returns an array with the names of all connections paired to this ID
export const findPairedConnectionsById = (id) =>
  createSelector(
    [getPairedConnections, getAllConnections],
    (pairedConnections, allConnections) => {
      const paired = pairedConnections
        .filter((pair) => pair !== undefined || null) // Prevents errors while remote state is updating
        .filter((pair) => pair.includes(id)) // Find pairs containing this ID
        .flatMap((pair) => pair.filter((pairedId) => pairedId !== id)) // Get the other ID in the pair
        .map(
          (pairedId) =>
            allConnections.find((conn) => conn.id === pairedId)?.serviceName
        ) // Map to connection names
        .filter(Boolean); // Remove undefined values

      return paired;
    }
  );

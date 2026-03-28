import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, getErrorMessage } from "../apiClient";

export const fetchFixedMenu = createAsyncThunk(
  "menu/fetchFixedMenu",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/menu/fixed");
      return response?.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchTodayMenu = createAsyncThunk(
  "menu/fetchTodayMenu",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/menu/today");
      return response?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateTodayMenu = createAsyncThunk(
  "menu/updateTodayMenu",
  async (menuPayload, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/menu/today", {
        method: "POST",
        body: menuPayload,
      });
      return response?.data || menuPayload;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  loading: false,
  updating: false,
  data: {
    fixedMenu: [],
    todayMenu: null,
  },
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    clearMenuError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFixedMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFixedMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.data.fixedMenu = action.payload;
      })
      .addCase(fetchFixedMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch fixed menu";
      })
      .addCase(fetchTodayMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.data.todayMenu = action.payload;
      })
      .addCase(fetchTodayMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch today menu";
      })
      .addCase(updateTodayMenu.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateTodayMenu.fulfilled, (state, action) => {
        state.updating = false;
        state.data.todayMenu = action.payload;
      })
      .addCase(updateTodayMenu.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Failed to update today menu";
      });
  },
});

export const { clearMenuError } = menuSlice.actions;

export default menuSlice.reducer;

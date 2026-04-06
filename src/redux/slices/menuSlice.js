import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, getErrorMessage } from "../apiClient";

export const fetchWeeklyMenu = createAsyncThunk(
  "menu/fetchWeeklyMenu",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/menu/weekly");
      return response?.data || {};
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateWeeklyMenu = createAsyncThunk(
  "menu/updateWeeklyMenu",
  async (weeklyMenuPayload, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/menu/weekly", {
        method: "PUT",
        body: weeklyMenuPayload,
      });
      return response?.data || weeklyMenuPayload?.weeklyMenu || {};
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

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
    weeklyMenu: {},
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
      .addCase(fetchWeeklyMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeeklyMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.data.weeklyMenu = action.payload;
      })
      .addCase(fetchWeeklyMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch weekly menu";
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
      })
      .addCase(updateWeeklyMenu.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateWeeklyMenu.fulfilled, (state, action) => {
        state.updating = false;
        state.data.weeklyMenu = action.payload;
      })
      .addCase(updateWeeklyMenu.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Failed to update weekly menu";
      });
  },
});

export const { clearMenuError } = menuSlice.actions;

export default menuSlice.reducer;

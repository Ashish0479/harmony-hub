import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, getErrorMessage } from "../apiClient";

export const applyRebate = createAsyncThunk(
  "rebate/applyRebate",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/rebate/apply", {
        method: "POST",
        body: { fromDate, toDate },
      });

      return response?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchStudentRebates = createAsyncThunk(
  "rebate/fetchStudentRebates",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/rebate/student/${studentId}`);
      return response?.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAllRebates = createAsyncThunk(
  "rebate/fetchAllRebates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/rebate/all");
      return response?.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  loading: false,
  actionLoading: false,
  data: {
    studentRebates: [],
    allRebates: [],
  },
  error: null,
};

const rebateSlice = createSlice({
  name: "rebate",
  initialState,
  reducers: {
    clearRebateError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentRebates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentRebates.fulfilled, (state, action) => {
        state.loading = false;
        state.data.studentRebates = action.payload;
      })
      .addCase(fetchStudentRebates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch rebates";
      })
      .addCase(fetchAllRebates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRebates.fulfilled, (state, action) => {
        state.loading = false;
        state.data.allRebates = action.payload;
      })
      .addCase(fetchAllRebates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch all rebates";
      })
      .addCase(applyRebate.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(applyRebate.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (action.payload) {
          state.data.studentRebates.unshift(action.payload);
        }
      })
      .addCase(applyRebate.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to apply rebate";
      });
  },
});

export const { clearRebateError } = rebateSlice.actions;

export default rebateSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, getErrorMessage } from "../apiClient";

export const fetchMonthlyAttendance = createAsyncThunk(
  "mess/fetchMonthlyAttendance",
  async ({ studentId, month, year }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        `/attendance/monthly/${studentId}?month=${month}&year=${year}`,
      );
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const saveAttendance = createAsyncThunk(
  "mess/saveAttendance",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/attendance/save", {
        method: "POST",
        body: payload,
      });
      return response?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  loading: false,
  actionLoading: false,
  data: {
    attendanceSummary: null,
    attendanceRecord: null,
  },
  error: null,
};

const messSlice = createSlice({
  name: "mess",
  initialState,
  reducers: {
    clearMessError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.data.attendanceSummary = action.payload;
      })
      .addCase(fetchMonthlyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch attendance summary";
      })
      .addCase(saveAttendance.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(saveAttendance.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.data.attendanceRecord = action.payload;
      })
      .addCase(saveAttendance.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to save attendance";
      });
  },
});

export const { clearMessError } = messSlice.actions;

export default messSlice.reducer;

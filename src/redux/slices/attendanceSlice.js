import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, getErrorMessage } from "../apiClient";

export const getAttendanceByDate = createAsyncThunk(
  "attendance/getAttendanceByDate",
  async (date, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        `/attendance?date=${encodeURIComponent(date)}`,
      );
      return response?.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const markAttendance = createAsyncThunk(
  "attendance/markAttendance",
  async (attendanceRows, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/attendance/bulk", {
        method: "POST",
        body: attendanceRows,
      });

      return response?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  loading: false,
  saving: false,
  data: [],
  saveResult: null,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAttendanceByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAttendanceByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch attendance";
      })
      .addCase(markAttendance.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.saving = false;
        state.saveResult = action.payload;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to save attendance";
      });
  },
});

export const { clearAttendanceError } = attendanceSlice.actions;

export default attendanceSlice.reducer;

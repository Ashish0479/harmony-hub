import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, getErrorMessage } from "../apiClient";

export const submitFeedback = createAsyncThunk(
  "feedback/submitFeedback",
  async ({ suggestion, complaint, rating, message }, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/feedback/submit", {
        method: "POST",
        body: { suggestion, complaint, rating, message },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchStudentFeedbacks = createAsyncThunk(
  "feedback/fetchStudentFeedbacks",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/feedback/student/${studentId}`);
      return response?.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAllFeedbacks = createAsyncThunk(
  "feedback/fetchAllFeedbacks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/feedback/all");
      return response?.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  loading: false,
  submitLoading: false,
  data: {
    list: [],
    latest: null,
  },
  error: null,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    clearFeedbackError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.data.list = action.payload;
      })
      .addCase(fetchStudentFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch feedback";
      })
      .addCase(fetchAllFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.data.list = action.payload;
      })
      .addCase(fetchAllFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch all feedback";
      })
      .addCase(submitFeedback.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.data.latest = action.payload;
        if (action.payload) {
          state.data.list.unshift(action.payload);
        }
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload || "Failed to submit feedback";
      });
  },
});

export const { clearFeedbackError } = feedbackSlice.actions;

export default feedbackSlice.reducer;

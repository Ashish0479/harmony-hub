import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, getErrorMessage } from "../apiClient";

export const submitComplaint = createAsyncThunk(
  "complaint/submitComplaint",
  async ({ title, category, description }, { rejectWithValue }) => {
    try {
      const complaint = [title, category, description]
        .filter(Boolean)
        .join(" | ");
      const response = await apiRequest("/feedback/submit", {
        method: "POST",
        body: {
          complaint,
          suggestion: "",
          rating: null,
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchMyComplaints = createAsyncThunk(
  "complaint/fetchMyComplaints",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/feedback/student/${studentId}`);
      const list = response?.data || [];
      return list.filter((item) => item.complaint);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAllComplaints = createAsyncThunk(
  "complaint/fetchAllComplaints",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/feedback/all");
      const list = response?.data || [];
      return list.filter((item) => item.complaint);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  loading: false,
  submitLoading: false,
  data: [],
  error: null,
};

const complaintSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {
    clearComplaintError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMyComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch complaints";
      })
      .addCase(fetchAllComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch all complaints";
      })
      .addCase(submitComplaint.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(submitComplaint.fulfilled, (state, action) => {
        state.submitLoading = false;
        if (action.payload?.complaint) {
          state.data.unshift(action.payload);
        }
      })
      .addCase(submitComplaint.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload || "Failed to submit complaint";
      });
  },
});

export const { clearComplaintError } = complaintSlice.actions;

export default complaintSlice.reducer;

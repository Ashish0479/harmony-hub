import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, getErrorMessage } from "../apiClient";

export const fetchBillsForStudents = createAsyncThunk(
  "bill/fetchBillsForStudents",
  async (studentIds, { rejectWithValue }) => {
    try {
      const billLists = await Promise.all(
        studentIds.map((studentId) => apiRequest(`/bill/student/${studentId}`)),
      );

      return billLists.flatMap((entry) => entry?.data || []);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchStudentBills = createAsyncThunk(
  "bill/fetchStudentBills",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/bill/student/${studentId}`);
      return response?.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchBillById = createAsyncThunk(
  "bill/fetchBillById",
  async (billId, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/bill/${billId}`);
      return response?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const generateBill = createAsyncThunk(
  "bill/generateBill",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/bill/generate", {
        method: "POST",
        body: payload,
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  loading: false,
  actionLoading: false,
  data: {
    bills: [],
    selectedBill: null,
    adminBills: [],
  },
  error: null,
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    clearBillError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentBills.fulfilled, (state, action) => {
        state.loading = false;
        state.data.bills = action.payload;
      })
      .addCase(fetchStudentBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch bills";
      })
      .addCase(fetchBillsForStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillsForStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.data.adminBills = action.payload;
      })
      .addCase(fetchBillsForStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch bills summary";
      })
      .addCase(fetchBillById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillById.fulfilled, (state, action) => {
        state.loading = false;
        state.data.selectedBill = action.payload;
      })
      .addCase(fetchBillById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch bill";
      })
      .addCase(generateBill.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(generateBill.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (action.payload) {
          state.data.bills.unshift(action.payload);
        }
      })
      .addCase(generateBill.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to generate bill";
      });
  },
});

export const { clearBillError } = billSlice.actions;

export default billSlice.reducer;

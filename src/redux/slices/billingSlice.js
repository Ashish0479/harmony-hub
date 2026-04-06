import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, getErrorMessage } from "../apiClient";

export const getMonthlyBill = createAsyncThunk(
  "billing/getMonthlyBill",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        `/attendance/bill?month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}`,
      );

      return response?.data || { month, year, pricing: {}, bills: [] };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  loading: false,
  data: {
    month: null,
    year: null,
    pricing: {},
    bills: [],
  },
  error: null,
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    clearBillingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMonthlyBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMonthlyBill.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getMonthlyBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to generate monthly bill";
      });
  },
});

export const { clearBillingError } = billingSlice.actions;

export default billingSlice.reducer;

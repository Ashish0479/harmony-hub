import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, getErrorMessage } from "../apiClient";

export const createPaymentOrder = createAsyncThunk(
  "payment/createPaymentOrder",
  async ({ billId }, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/payments/create-order", {
        method: "POST",
        body: { billId },
      });
      return response?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/payments/verify", {
        method: "POST",
        body: payload,
      });
      return response?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const markBillPaidByAdminCash = createAsyncThunk(
  "payment/markBillPaidByAdminCash",
  async (billId, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/payments/admin/cash/${billId}`, {
        method: "POST",
      });
      return response?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  loading: false,
  data: null,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.loading = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create payment order";
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to verify payment";
      })
      .addCase(markBillPaidByAdminCash.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markBillPaidByAdminCash.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(markBillPaidByAdminCash.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to mark bill paid";
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;

export default paymentSlice.reducer;

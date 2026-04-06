import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, getErrorMessage } from "../apiClient";

export const fetchAnnouncements = createAsyncThunk(
  "announcement/fetchAnnouncements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/announcement/all");
      return response?.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createAnnouncement = createAsyncThunk(
  "announcement/createAnnouncement",
  async ({ title, message }, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/announcement", {
        method: "POST",
        body: { title, message },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteAnnouncement = createAsyncThunk(
  "announcement/deleteAnnouncement",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/announcement/${id}`, {
        method: "DELETE",
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
    list: [],
  },
  error: null,
};

const announcementSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {
    clearAnnouncementError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.data.list = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch announcements";
      })
      .addCase(createAnnouncement.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (action.payload) {
          state.data.list.unshift(action.payload);
        }
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to create announcement";
      })
      .addCase(deleteAnnouncement.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.actionLoading = false;
        const removedId = action.payload?._id;
        state.data.list = state.data.list.filter(
          (item) => String(item._id) !== String(removedId),
        );
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to delete announcement";
      });
  },
});

export const { clearAnnouncementError } = announcementSlice.actions;

export default announcementSlice.reducer;

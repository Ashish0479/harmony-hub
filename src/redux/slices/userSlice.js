import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, getErrorMessage } from "../apiClient";

export const fetchStudents = createAsyncThunk(
  "user/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/students");
      return response?.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchStudentById = createAsyncThunk(
  "user/fetchStudentById",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/students/${studentId}`);
      return response?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createStudent = createAsyncThunk(
  "user/createStudent",
  async (studentPayload, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/students", {
        method: "POST",
        body: studentPayload,
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteStudent = createAsyncThunk(
  "user/deleteStudent",
  async (studentId, { rejectWithValue }) => {
    try {
      await apiRequest(`/students/${studentId}`, {
        method: "DELETE",
      });
      return studentId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  loading: false,
  actionLoading: false,
  data: {
    students: [],
    currentStudent: null,
  },
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.data.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch students";
      })
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.data.currentStudent = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch student";
      })
      .addCase(createStudent.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (action.payload) {
          state.data.students.unshift(action.payload);
        }
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to create student";
      })
      .addCase(deleteStudent.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.data.students = state.data.students.filter(
          (student) => String(student._id) !== String(action.payload),
        );
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to delete student";
      });
  },
});

export const { clearUserError } = userSlice.actions;

export default userSlice.reducer;

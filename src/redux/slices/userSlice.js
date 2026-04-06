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

export const fetchMyProfile = createAsyncThunk(
  "user/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/user/profile");
      return response?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateMyProfile = createAsyncThunk(
  "user/updateMyProfile",
  async (profilePayload, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/user/profile", {
        method: "PUT",
        body: profilePayload,
      });
      return response?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const uploadMyProfileImage = createAsyncThunk(
  "user/uploadMyProfileImage",
  async (imageFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", imageFile);

      const response = await apiRequest("/user/upload-profile-image", {
        method: "POST",
        body: formData,
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
  profileLoading: false,
  profileActionLoading: false,
  profileUploading: false,
  data: {
    students: [],
    currentStudent: null,
  },
  profile: null,
  error: null,
  profileError: null,
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
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload || "Failed to fetch profile";
      })
      .addCase(updateMyProfile.pending, (state) => {
        state.profileActionLoading = true;
        state.profileError = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.profileActionLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.profileActionLoading = false;
        state.profileError = action.payload || "Failed to update profile";
      })
      .addCase(uploadMyProfileImage.pending, (state) => {
        state.profileUploading = true;
        state.profileError = null;
      })
      .addCase(uploadMyProfileImage.fulfilled, (state, action) => {
        state.profileUploading = false;
        state.profile = action.payload;
      })
      .addCase(uploadMyProfileImage.rejected, (state, action) => {
        state.profileUploading = false;
        state.profileError = action.payload || "Failed to upload profile image";
      });
  },
});

export const { clearUserError } = userSlice.actions;

export default userSlice.reducer;

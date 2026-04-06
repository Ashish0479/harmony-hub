import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, getErrorMessage } from "../apiClient";

const AUTH_STORAGE_KEY = "hostelhub_auth";

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistAuth(authState) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
}

function clearPersistedAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

const storedAuth = loadStoredAuth();

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: credentials,
      });

      const authData = {
        isAuthenticated: true,
        role: response?.data?.userRole || "STUDENT",
        user: response?.data?.userData || null,
        token: response?.data?.token || null,
      };

      persistAuth(authData);
      return authData;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userPayload, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/users", {
        method: "POST",
        body: userPayload,
      });
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createManager = createAsyncThunk(
  "auth/createManager",
  async (managerPayload, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/users/admin", {
        method: "POST",
        body: managerPayload,
      });
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
      clearPersistedAuth();
      return true;
    } catch (error) {
      clearPersistedAuth();
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  loading: false,
  signupLoading: false,
  managerLoading: false,
  data: {
    isAuthenticated: Boolean(storedAuth?.isAuthenticated),
    role: storedAuth?.role || null,
    user: storedAuth?.user || null,
    token: storedAuth?.token || null,
  },
  error: null,
  signupSuccess: false,
  managerSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    syncAuthUser: (state, action) => {
      if (!state.data.user) {
        state.data.user = action.payload;
      } else {
        state.data.user = {
          ...state.data.user,
          ...action.payload,
        };
      }

      persistAuth(state.data);
    },
    clearSignupStatus: (state) => {
      state.signupSuccess = false;
      state.error = null;
    },
    clearManagerStatus: (state) => {
      state.managerSuccess = false;
      state.error = null;
    },
    clearSession: (state) => {
      state.data = {
        isAuthenticated: false,
        role: null,
        user: null,
        token: null,
      };
      state.error = null;
      clearPersistedAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(signupUser.pending, (state) => {
        state.signupLoading = true;
        state.error = null;
        state.signupSuccess = false;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.signupLoading = false;
        state.signupSuccess = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.signupLoading = false;
        state.error = action.payload || "Signup failed";
      })
      .addCase(createManager.pending, (state) => {
        state.managerLoading = true;
        state.managerSuccess = false;
        state.error = null;
      })
      .addCase(createManager.fulfilled, (state) => {
        state.managerLoading = false;
        state.managerSuccess = true;
      })
      .addCase(createManager.rejected, (state, action) => {
        state.managerLoading = false;
        state.error = action.payload || "Manager creation failed";
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.data = {
          isAuthenticated: false,
          role: null,
          user: null,
          token: null,
        };
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.data = {
          isAuthenticated: false,
          role: null,
          user: null,
          token: null,
        };
        state.error = action.payload || "Logout failed";
      });
  },
});

export const {
  clearAuthError,
  syncAuthUser,
  clearSignupStatus,
  clearManagerStatus,
  clearSession,
} = authSlice.actions;

export default authSlice.reducer;

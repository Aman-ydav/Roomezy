import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axiosInterceptor";
import { toast } from "sonner";

// ------------------------- REGISTER -------------------------
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/users/register", formData, {
        withCredentials: true,
      });

      const email = formData.get ? formData.get("email") : formData.email;
      const password = formData.get
        ? formData.get("password")
        : formData.password;

      await thunkAPI.dispatch(loginUser({ email, password }));

      return res.data?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/users/login", data, {
        withCredentials: true,
      });

      const payload = res.data?.data;
      const user = payload?.user;
      const accessToken = payload?.accessToken;
      const refreshToken = payload?.refreshToken;

      if (!user || !accessToken) {
        throw new Error("Login response missing user or tokens");
      }

      localStorage.setItem("user", JSON.stringify(user));

      localStorage.setItem(
        "roomezy_tokens",
        JSON.stringify({ accessToken, refreshToken })
      );

      return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/users/get-current-user", {
        withCredentials: true,
      });

      return res.data?.data?.user;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch user");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/users/forgot-password", { email });
      toast.success("Reset link sent to email");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error occurred");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/users/reset-password/${token}`, {
        password,
      });

      toast.success("Password reset successfully!");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reset password"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await api.post("/users/logout", {}, { withCredentials: true });

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("roomezy_tokens");

      toast.success("Logged out successfully!");

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateUserData = (userData) => (dispatch) => {
  dispatch(updateUser(userData));

  if (userData) {
    localStorage.setItem("user", JSON.stringify(userData));
  } else {
    localStorage.removeItem("user");
  }
};

const savedUser = localStorage.getItem("user");

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  loading: false,
  error: null,
  isAuthenticated: !!savedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // Update user after profile/avatar updates
    updateUser: (state, action) => {
      state.user = action.payload;

      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },

    // Force logout (used in axios interceptor)
    forceLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("user");
      localStorage.removeItem("roomezy_tokens");
    },
  },

  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload || state.user;
        state.isAuthenticated = !!state.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH CURRENT USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // FORGOT / RESET
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateUser, forceLogout } = authSlice.actions;
export default authSlice.reducer;

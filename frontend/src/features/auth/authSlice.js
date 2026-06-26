import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axiosInterceptor";
import { getNewAccessToken } from "@/utils/axiosInterceptor";
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

      if (!user || !accessToken) {
        throw new Error("Login response missing user or tokens");
      }

      localStorage.setItem("user", JSON.stringify(user));

      return { user, accessToken };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Called once on app load.
// Uses the shared getNewAccessToken() singleton so it de-duplicates with
// any concurrent 401 retries — only one /refresh-token HTTP request fires.
// Fulfilled  → access token in Redux (socket auth) + isAuthenticated confirmed.
// Rejected 401/403 → genuine expiry, wipe user and redirect to login.
// Rejected other  → transient error (network down), keep optimistic state.
export const bootstrapAuth = createAsyncThunk(
  "auth/bootstrapAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getNewAccessToken();
      return token;
    } catch (err) {
      return rejectWithValue({ status: err.response?.status ?? 0 });
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

      localStorage.removeItem("user");

      toast.success("Logged out successfully!");

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (id_token, thunkAPI) => {
    try {
      const res = await api.post(
        "/users/google",
        { id_token },
        { withCredentials: true }
      );

      const payload = res.data?.data;
      const user = payload?.user;
      const accessToken = payload?.accessToken;

      localStorage.setItem("user", JSON.stringify(user));

      return { user, accessToken };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Google login failed"
      );
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

export const sendVerificationCode = createAsyncThunk(
  "auth/sendVerificationCode",
  async (email, thunkAPI) => {
    try {
      const res = await api.post("/users/send-verification-code", { email });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const verifyEmailCode = createAsyncThunk(
  "auth/verifyEmailCode",
  async ({ email, code }, thunkAPI) => {
    try {
      const res = await api.post("/users/verify-email", { email, code });
      const updatedUser = res.data?.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

const savedUser = localStorage.getItem("user");

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  accessToken: null,
  loading: false,
  error: null,
  // Optimistic: trust the localStorage cache immediately.
  // bootstrapAuth runs in background and corrects this if the session expired.
  isAuthenticated: !!savedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;

      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    forceLogout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("user");
    },

    googleLoginSuccess: (state, action) => {
      const { user, accessToken } = action.payload;

      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(user));
    },
  },

  extraReducers: (builder) => {
    builder
      // BOOTSTRAP
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(bootstrapAuth.rejected, (state, action) => {
        const status = action.payload?.status;
        // Only wipe on genuine auth failure (expired / revoked token).
        // Network errors (status 0) keep the optimistic state so the user
        // isn't bounced to login on a momentary connectivity blip.
        if (status === 401 || status === 403) {
          state.user = null;
          state.accessToken = null;
          state.isAuthenticated = false;
          localStorage.removeItem("user");
        }
      })

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

      .addCase(verifyEmailCode.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
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
        state.accessToken = null;
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
        // Don't wipe user on network errors — only on real 401s handled
        // by the interceptor (which dispatches forceLogout directly).
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

export const { updateUser, setAccessToken, forceLogout, googleLoginSuccess } =
  authSlice.actions;
export default authSlice.reducer;

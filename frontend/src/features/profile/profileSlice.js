import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axiosInterceptor";
import { updateUser } from "@/features/auth/authSlice";
import { toast } from "sonner";

export const updateAccountDetails = createAsyncThunk(
  "profile/updateAccountDetails",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await api.patch(
        "/users/update-account-details",
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(updateUser(data.data));

      toast.success("Profile updated successfully!");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateUserAvatar = createAsyncThunk(
  "profile/updateUserAvatar",
  async (avatarFile, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const { data } = await api.patch("/users/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      dispatch(updateUser(data.data));

      toast.success("Avatar updated!");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (passwords, { rejectWithValue }) => {
    try {
      await api.post("/users/change-password", passwords, {
        withCredentials: true,
      });
      toast.success("Password changed successfully!");
      return true;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message);
    }
  }
);

export const updateAccountType = createAsyncThunk(
  "profile/updateAccountType",
  async (accountType, thunkAPI) => {
    try {
      const res = await api.patch(
        "/users/update-account-type",
        { accountType },
        { withCredentials: true }
      );
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update account type"
      );
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "profile/deleteAccount",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await api.delete("/users/delete-account", { withCredentials: true });

      // Logout globally
      dispatch(updateUser(null));

      toast.success("Account deleted.");
      localStorage.removeItem("roomezy_tokens");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(updateAccountDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAccountDetails.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateAccountDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserAvatar.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAccountType.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default profileSlice.reducer;

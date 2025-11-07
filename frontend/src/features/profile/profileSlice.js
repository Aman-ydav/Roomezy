import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axiosInterceptor";
import { updateUserData } from "@/features/auth/authSlice";


import { toast } from "sonner";

// Update basic account details (username, age)
export const updateAccountDetails = createAsyncThunk(
  "profile/updateAccountDetails",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(
        "/users/update-account-details",
        formData,
        {
          withCredentials: true,
        }
      );
        localStorage.setItem("user", JSON.stringify(data.data)); // updated user
      return data.data; // updated user
    } catch (err) {
     
      return rejectWithValue(err.response?.data?.message);
    }
  }
);



// Update avatar
export const updateUserAvatar = createAsyncThunk(
  "profile/updateUserAvatar",
  async (avatarFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const { data } = await api.patch("/users/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      localStorage.setItem("user", JSON.stringify(data.data)); // updated user
      return data.data;
    } catch (err) {
     
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (passwords, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/users/change-password", passwords, {
        withCredentials: true,
      });
   
      return data.data;
    } catch (err) {
    
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// Delete account
export const deleteAccount = createAsyncThunk(
  "profile/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.delete("/users/delete-account", {
        withCredentials: true,
      });
     
      return data.data;
    } catch (err) {
    
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateAccountDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAccountDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateAccountDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserAvatar.fulfilled, (state, action) => {
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
        state.user = null;
      });
  },
});

export default profileSlice.reducer;

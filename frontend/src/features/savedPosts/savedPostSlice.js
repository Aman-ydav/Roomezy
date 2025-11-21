import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axiosInterceptor";
import { toast } from "sonner";

/* -------- TOGGLE SAVE / UNSAVE -------- */
export const toggleSavePost = createAsyncThunk(
  "savedPosts/toggleSavePost",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `/savedposts/${postId}/saved-post`,
        {},
        { withCredentials: true }
      );
      return { postId, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to toggle");
    }
  }
);

/* -------- FETCH SAVED POSTS LIST -------- */
export const getSavedPosts = createAsyncThunk(
  "savedPosts/getSavedPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/savedposts", { withCredentials: true });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch saved posts"
      );
    }
  }
);

const savedPostSlice = createSlice({
  name: "savedPosts",
  initialState: {
    saved: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ----- FETCH SAVED POSTS ----- */
      .addCase(getSavedPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSavedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.saved = action.payload;
      })
      .addCase(getSavedPosts.rejected, (state) => {
        state.loading = false;
      })

      /* ----- TOGGLE SAVE/UNSAVE ----- */

      .addCase(toggleSavePost.fulfilled, (state, action) => {
        const { postId, message } = action.payload;
        toast.success(message);

        if (message.includes("unsaved")) {
          state.saved = state.saved.filter((s) => s.post._id !== postId);
        } else {
          state.saved.push({ post: { _id: postId } });
        }
      });
  },
});

export default savedPostSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axiosInterceptor";
import { toggleSavePost } from "../savedPosts/savedPostSlice";

export const createPost = createAsyncThunk(
  "post/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      for (const key in postData) {
        if (Array.isArray(postData[key])) {
          postData[key].forEach((val) => formData.append(key, val));
        } else {
          formData.append(key, postData[key]);
        }
      }

      const res = await api.post("/posts/create-post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create post.";
      return rejectWithValue(message);
    }
  }
);

export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/posts");
      return res.data.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch posts.";
      return rejectWithValue(message);
    }
  }
);

export const getPostById = createAsyncThunk(
  "post/getPostById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/posts/${id}`);
      return res.data.data;
    } catch (err) {
      const message = err.response?.data?.message || "Post not found.";
      return rejectWithValue(message);
    }
  }
);

export const toggleArchivePost = createAsyncThunk(
  "post/toggleArchivePost",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/posts/${id}/archive`);
      return res.data.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to archive post.";
      return rejectWithValue(message);
    }
  }
);

export const togglePostStatus = createAsyncThunk(
  "post/togglePostStatus",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/posts/${id}/status`);
      return res.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to toggle post status.";
      return rejectWithValue(message);
    }
  }
);

export const ratePost = createAsyncThunk(
  "post/ratePost",
  async ({ id, value }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/posts/${id}/rate`, { value });
      return res.data.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to rate post.";
      return rejectWithValue(message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${id}`);
      return id;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete post.";
      return rejectWithValue(message);
    }
  }
);

export const updatePostBasic = createAsyncThunk(
  "post/updatePostBasic",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/posts/${id}/basic`, updatedData);
      return res.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update basic information.";
      return rejectWithValue(message);
    }
  }
);

export const updatePostPreferences = createAsyncThunk(
  "post/updatePostPreferences",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/posts/${id}/preferences`, updatedData);
      return res.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update preferences.";
      return rejectWithValue(message);
    }
  }
);

export const updatePostImages = createAsyncThunk(
  "post/updatePostImages",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      for (const key in updatedData) {
        if (Array.isArray(updatedData[key])) {
          updatedData[key].forEach((val) => formData.append(key, val));
        } else {
          formData.append(key, updatedData[key]);
        }
      }
      const res = await api.patch(`/posts/${id}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update images.";
      return rejectWithValue(message);
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    selectedPost: null,
    loading: false,
    creating: false,
    updating: false,
    updatingBasic: false,
    updatingPreferences: false,
    updatingImages: false,
    error: null,
  },
  reducers: {
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* --- CREATE --- */
      .addCase(createPost.pending, (state) => {
        state.creating = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.creating = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      /* --- GET ALL --- */
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --- GET BY ID --- */
      .addCase(getPostById.fulfilled, (state, action) => {
        state.selectedPost = action.payload;
      })

      /* --- ARCHIVE --- */
      .addCase(toggleArchivePost.fulfilled, (state, action) => {
        const updated = action.payload;
        state.posts = state.posts.map((p) =>
          p._id === updated._id ? updated : p
        );
      })

      /* --- STATUS --- */
      .addCase(togglePostStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        state.posts = state.posts.map((p) =>
          p._id === updated._id ? updated : p
        );
      })

      /* --- RATE --- */
      .addCase(ratePost.fulfilled, (state, action) => {
        const updated = action.payload;
        state.posts = state.posts.map((p) =>
          p._id === updated._id ? updated : p
        );
      })

      /* --- DELETE --- */
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      })

      /* --- UPDATE BASIC --- */

      .addCase(updatePostBasic.pending, (state) => {
        state.updatingBasic = true;
      })
      .addCase(updatePostBasic.fulfilled, (state, action) => {
        state.updatingBasic = false;
        state.posts = state.posts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        if (state.selectedPost?._id === action.payload._id) {
          state.selectedPost = action.payload;
        }
      })
      .addCase(updatePostBasic.rejected, (state, action) => {
        state.updatingBasic = false;
        state.error = action.payload;
      })

      /* --- UPDATE PREFERENCES --- */
      .addCase(updatePostPreferences.pending, (state) => {
        state.updatingPreferences = true;
      })
      .addCase(updatePostPreferences.fulfilled, (state, action) => {
        state.updatingPreferences = false;
        state.posts = state.posts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        if (state.selectedPost?._id === action.payload._id) {
          state.selectedPost = action.payload;
        }
      })
      .addCase(updatePostPreferences.rejected, (state, action) => {
        state.updatingPreferences = false;
        state.error = action.payload;
      })

      /* --- UPDATE IMAGES --- */
      .addCase(updatePostImages.pending, (state) => {
        state.updatingImages = true;
      })
      .addCase(updatePostImages.fulfilled, (state, action) => {
        state.updatingImages = false;
        state.posts = state.posts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        if (state.selectedPost?._id === action.payload._id) {
          state.selectedPost = action.payload;
        }
      })
      .addCase(updatePostImages.rejected, (state, action) => {
        state.updatingImages = false;
        state.error = action.payload;
      })
      .addCase(toggleSavePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        if (state.selectedPost && state.selectedPost._id === postId) {
          state.selectedPost.isSaved = !state.selectedPost.isSaved;
        }
      });
  },
});

export const { clearSelectedPost } = postSlice.actions;
export default postSlice.reducer;

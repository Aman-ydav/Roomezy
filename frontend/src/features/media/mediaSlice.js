// src/features/media/mediaSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axiosInterceptor";

// Async thunks
export const createMediaPost = createAsyncThunk(
  "media/createMediaPost",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getAllMediaPosts = createAsyncThunk(
  "media/getAllMediaPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/media");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const toggleLikeMedia = createAsyncThunk(
  "media/toggleLikeMedia",
  async (mediaId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/media/${mediaId}/like`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const addComment = createAsyncThunk(
  "media/addComment",
  async ({ mediaId, comment_text }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/media/${mediaId}/comment`, {
        comment_text,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getAllComments = createAsyncThunk(
  "media/getAllComments",
  async (mediaId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/media/${mediaId}/comment`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteMediaPost = createAsyncThunk(
  "media/deleteMediaPost",
  async (mediaId, { rejectWithValue }) => {
    try {
      await api.delete(`/media/${mediaId}`);
      return mediaId;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const mediaSlice = createSlice({
  name: "media",
  initialState: {
    posts: [],
    loading: false,
    error: null,
    comments: {},
    commentsLoading: {},
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updatePostLikes: (state, action) => {
      const { postId, likes_count } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        post.likes_count = likes_count;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Media Post
      .addCase(createMediaPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMediaPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload.data);
      })
      .addCase(createMediaPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // Get All Media Posts
      .addCase(getAllMediaPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMediaPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
      })
      .addCase(getAllMediaPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // Toggle Like
      .addCase(toggleLikeMedia.fulfilled, (state, action) => {
        const updatedPost = action.payload.data;
        const index = state.posts.findIndex((p) => p._id === updatedPost._id);
        if (index !== -1) {
          state.posts[index] = { ...state.posts[index], ...updatedPost };
        }
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const newComment = action.payload.data;
        const postId = newComment.media;
        
        // Increment comments count in the post
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.comments_count = (post.comments_count || 0) + 1;
        }
        
        // Add to comments cache if it exists
        if (state.comments[postId]) {
          state.comments[postId].unshift(newComment);
        }
      })
      // Get All Comments
      .addCase(getAllComments.pending, (state, action) => {
        const mediaId = action.meta.arg;
        state.commentsLoading[mediaId] = true;
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        const comments = action.payload.data;
        const mediaId = action.meta.arg;
        state.commentsLoading[mediaId] = false;
        state.comments[mediaId] = comments;
      })
      .addCase(getAllComments.rejected, (state, action) => {
        const mediaId = action.meta.arg;
        state.commentsLoading[mediaId] = false;
      })
      // Delete Media Post
      .addCase(deleteMediaPost.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.posts = state.posts.filter((post) => post._id !== deletedId);
        // Also remove from comments cache
        delete state.comments[deletedId];
      });
  },
});

export const { clearError, updatePostLikes } = mediaSlice.actions;
export default mediaSlice.reducer;
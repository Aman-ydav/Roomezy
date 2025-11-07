// src/features/post/postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axiosInterceptor";

import { toast } from "sonner";

/* ===========================
   🔹 CREATE POST
=========================== */
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

      toast.success("Post created successfully!");
      return res.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create post.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/* ===========================
   🔹 GET ALL POSTS
=========================== */
export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/posts");
      return res.data.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch posts.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/* ===========================
   🔹 GET POST BY ID
=========================== */
export const getPostById = createAsyncThunk(
  "post/getPostById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/posts/${id}`);
      return res.data.data;
    } catch (err) {
      const message = err.response?.data?.message || "Post not found.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/* ===========================
   🔹 UPDATE POST
=========================== */
export const updatePost = createAsyncThunk(
  "post/updatePost",
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

      const res = await api.put(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post updated successfully!");
      return res.data.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update post.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/* ===========================
   🔹 TOGGLE ARCHIVE STATUS
=========================== */
export const toggleArchivePost = createAsyncThunk(
  "post/toggleArchivePost",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/posts/${id}/archive`);
      toast.info("Post archive status updated.");
      return res.data.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to archive post.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/* ===========================
   🔹 TOGGLE ACTIVE / CLOSED STATUS
=========================== */
export const togglePostStatus = createAsyncThunk(
  "post/togglePostStatus",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/posts/${id}/status`);
      toast.success("Post status updated!");
      return res.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to toggle post status.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/* ===========================
   🔹 RATE POST
=========================== */
export const ratePost = createAsyncThunk(
  "post/ratePost",
  async ({ id, value }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/posts/${id}/rate`, { value });
      toast.success("Thanks for rating!");
      return res.data.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to rate post.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/* ===========================
   🔹 DELETE POST
=========================== */
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${id}`);
      toast.success("Post deleted successfully!");
      return id;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete post.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);




/* ===========================
   ⚙️ SLICE
=========================== */
const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    selectedPost: null,
    loading: false,
    creating: false,
    updating: false,
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

      /* --- UPDATE --- */
      .addCase(updatePost.pending, (state) => {
        state.updating = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.updating = false;
        state.posts = state.posts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        if (state.selectedPost?._id === action.payload._id) {
          state.selectedPost = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
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
      });
  },
});

export const { clearSelectedPost } = postSlice.actions;
export default postSlice.reducer;

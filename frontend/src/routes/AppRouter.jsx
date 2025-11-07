import { Routes, Route } from "react-router-dom";
import Home from "@/pages/home/Home";
import Login from "@/pages/login/Login";
import Register from "@/pages/register/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import NotFound from "@/pages/NotFound";
import Navbar from "@/components/Layout/Navbar";
import ResetPassword from "@/pages/ResetPassword";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import EditProfile from "@/pages/profile/EditProfile";
import CreatePost from "@/components/createPost/CreatePost"; // 🆕 Import
import MyPosts from "@/components/post/MyPosts"; // 🆕 Future route
import PostDetails from "@/components/post/PostDetailsModal";

export default function AppRouter() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/post/:id" element={<PostDetails />} /> {/* 🆕 Single Post */}
        <Route path="*" element={<NotFound />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/create-post" element={<CreatePost />} /> {/* 🆕 */}
          <Route path="/my-posts" element={<MyPosts />} /> {/* 🆕 */}

        </Route>
      </Routes>
    </>
  );
}

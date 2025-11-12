import { Routes, Route } from "react-router-dom";
import Home from "@/pages/home/Home";
import Login from "@/pages/login/Login";
import Register from "@/pages/register/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import NotFound from "@/pages/NotFound";
import ResetPassword from "@/pages/ResetPassword";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import EditProfile from "@/pages/profile/EditProfile";
import CreatePost from "@/components/createPost/CreatePost";
import MyPosts from "@/components/post/MyPosts";
import PostDetails from "@/pages/post/PostDetails";
import EditPost from "@/pages/post/EditPost";
import SearchPage from "@/components/search/SearchPage";
import Inbox from "@/components/inbox/Inbox";
import Layout from "@/components/layout/Layout"; 
import Navbar from "@/components/layout/Navbar";

export default function AppRouter() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route
          element={
            <Layout>
                {/* <Route path="/help" element={<Help />} />
                <Route path="/about" element={<About />} /> */}
            </Layout>
          }
        >
      {/* ---------- PUBLIC ROUTES ---------- */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/post/:id" element={<PostDetails />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="*" element={<NotFound />} />

      {/* ----------PROTECTED ROUTES (with Layout) ---------- */}
      <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/post/:id/edit" element={<EditPost />} />
          <Route path="/inbox" element={<Inbox />} />
      </Route>
      </Route>
    </Routes>
    
    </>
  );
}

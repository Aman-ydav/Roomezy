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
import ScrollToTopOnRoute from "@/components/ui/ScrollToTopOnRoute";
import Layout from "@/components/layout/Layout";
import HelpCenterPage from "@/pages/About/HelpCenterPage";
import AboutPage from "@/pages/About/AboutPage";
import TermsOfServicePage from "@/pages/About/TermsOfServicePage";
import PrivacyPolicyPage from "@/pages/About/PrivacyPolicyPage";
import ListRoom from "@/pages/About/ListRoom";
import FindRoom from "@/pages/About/FindRoom";
import SavedPosts from "@/pages/saved/SavedPosts";
import ChatLayout from "@/components/chat/ChatLayout";
import Feed from "@/pages/feed/Feed.jsx";
import { installRoomezy } from "@/pwaInstall";

export default function AppRouter() {
  return (
    <>
      <ScrollToTopOnRoute />
      <Routes>
        <Route element={<Layout />}>
          {/* ---------- PUBLIC ROUTES ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/how-posting-works" element={<ListRoom />} />
          <Route path="/find-room" element={<FindRoom />} />
          <Route path="/feed" element={<Feed />} />

          <Route path="*" element={<NotFound />} />

          {/* ----------PROTECTED ROUTES (with Layout) ---------- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/post/:id/edit" element={<EditPost />} />
            <Route path="/inbox" element={<ChatLayout />} />
            <Route path="/saved" element={<SavedPosts />} />
          </Route>
        </Route>
      </Routes>
      {/* Install Popup */}
      <div
        id="installPopup"
        className="fixed inset-0 z-99999 bg-black/50  opacity-0 pointer-events-none transition-opacity duration-300 install-popup"
      >
        <div
          className="
      popup-content
      bg-background
      w-[92%]
      max-w-[380px]
      p-6
      rounded-2xl
      text-center
      shadow-xl
      animate-slideUp
      mx-auto
      md:mt-[10vh]
      md:mb-0
      md:rounded-2xl
     
    "
        >
          <img src="/logo.png" alt="Roomezy" className="w-16 mx-auto mb-2" />

          <h3 className="text-xl font-semibold text-primary">
            Install Roomezy
          </h3>

          <p className="text-sm text-[#5c3a40] mt-1 mb-4">
            Enjoy faster access to chat, feed, and updates.
          </p>

          <button
            className="w-full bg-primary text-white py-3 rounded-xl text-base font-medium cursor-pointer transition"
            onClick={installRoomezy}
          >
            Install App
          </button>

          <button
            className="w-full py-3 text-sm text-gray-600 mt-1 cursor-pointer"
            onClick={() =>
              document
                .getElementById("installPopup")
                .classList.remove("show-popup")
            }
          >
            Not Now
          </button>
        </div>
      </div>
    </>
  );
}

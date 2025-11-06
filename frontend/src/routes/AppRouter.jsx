import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import Navbar from "@/components/Layout/Navbar";
import ResetPassword from "@/pages/ResetPassword";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import EditProfile from "@/pages/EditProfile";

export default function AppRouter() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>
      </Routes>
    </>
  );
}

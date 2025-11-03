import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"; 


export default function Navbar() {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white shadow-sm">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Roomezy
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="hover:text-purple-600">
          Home
        </Link>

        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-purple-600">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-600">
              Sign In
            </Link>

            <Link to="/register">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

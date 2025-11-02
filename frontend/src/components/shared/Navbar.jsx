import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../app/slices/authSlice";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white shadow-sm">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        MyApp
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <button
              onClick={() => dispatch(logout())}
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

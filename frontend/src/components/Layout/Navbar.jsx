import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "../theme/ThemeToggle";

export default function Navbar() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("You have logged out successfully");
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 md:px-8">
       
        <Link
          to="/"
          className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
        >
          Roomezy
        </Link>

       
        <div className="hidden md:flex items-center gap-6">
          <ThemeToggle />

          <Link
            to="/"
            className="text-zinc-700 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-zinc-700 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-zinc-700 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Sign In
              </Link>

              <Link to="/register">
                <Button className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-zinc-700 dark:text-zinc-200 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all">
          <ThemeToggle />

          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-zinc-700 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="text-zinc-700 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-zinc-700 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Sign In
              </Link>

              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

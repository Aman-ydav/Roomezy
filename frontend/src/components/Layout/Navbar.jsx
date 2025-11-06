import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "../theme/ThemeToggle.jsx";
import {
  LogOut,
  Menu,
  X,
  Search,
  User,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav
      className="
      sticky top-0 z-50 backdrop-blur-md 
      border-b border-border bg-card/80 text-foreground 
      transition-all duration-300 
    "
    >
      {/* Desktop Navbar */}
      <div className="hidden md:flex max-w-9xl  justify-between items-center px-4 py-1 md:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer group">
          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 object-contain transition-transform group-hover:scale-110 "
          />
          <span
            className="
                   text-2xl font-extrabold 
                   bg-primary dark:bg-forground
                   bg-clip-text text-transparent 
                   tracking-tight"
          >
            Roomezy
          </span>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-1 mx-6 max-w-md relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search rooms, locations, or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="flex items-center gap-2 cursor-pointer p-4 py-5"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.avatar} alt={user?.userName} />
                    <AvatarFallback className="text-xs">
                      {user?.userName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate max-w-28">
                    {user?.fullName || user?.userName || "User"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56  bg-card/60 dark:bg-card/40  backdrop-blur-xl  border border-border/40  shadow-xl  rounded-xl"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {user?.fullName || user?.userName}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/edit-profile")}>
                  <Settings className="mr-2 h-4 w-4" /> Personal Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                to="/login"
                className="
                text-sm font-medium text-foreground/90 
                hover:text-primary transition-colors
              "
              >
                Sign In
              </Link>
              <Link to="/register">
                <Button
                  className="
                  bg-linear-to-r from-primary to-accent 
                  hover:from-primary/90 hover:to-accent/90 
                  text-primary-foreground font-medium shadow-md
                "
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navbar (No Hamburger, Inline Icons) */}
      <div className="flex md:hidden justify-between items-center px-4 py-3 bg-card/80 backdrop-blur-md">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer group">
          <img
            src={logo}
            alt="Roomezy Logo"
            className="w-7 h-7 object-contain transition-transform group-hover:scale-110"
          />
          <span
            className="
              text-xl font-extrabold 
              bg-linear-to-r from-primary to-accent 
              bg-clip-text text-transparent 
              tracking-tight
            "
          >
            Roomezy
          </span>
        </Link>

        {/* Right: Theme, Search, and User Menu */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Search Icon */}
          <button
            onClick={() => setShowSearch((prev) => !prev)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* User Dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 cursor-pointer">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.avatar} alt={user?.userName} />
                    <AvatarFallback className="text-xs">
                      {user?.userName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-card/60 dark:bg-card/40  backdrop-blur-xl  border border-border/40  shadow-xl  rounded-xl"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {user?.fullName || user?.userName}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <Settings className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <User className="h-5 w-5 text-muted-foreground" />
            </Link>
          )}
        </div>
      </div>

      {showSearch && (
        <div className="md:hidden px-4 py-3 bg-card border-t border-border backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <form
            onSubmit={(e) => {
              handleSearch(e);
              setShowSearch(false);
            }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search rooms, locations, or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </form>
        </div>
      )}
    </nav>
  );
}

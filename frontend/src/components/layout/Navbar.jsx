// src/components/layout/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "../theme/ThemeToggle.jsx";
import {
  LogOut,
  User,
  Search,
  Settings,
  LayoutDashboard,
  MessageCircle,
  MessagesSquare,
  Image,
  PanelLeftClose,
  PanelLeftOpen,
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

export default function Navbar({ onToggleSidebar, isSidebarOpen,sidebarIconRef  }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
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
      fixed top-0 left-0 right-0 z-50 
      backdrop-blur-2xl border-b border-border 
      bg-card/80 text-foreground transition-all duration-300
    "
    >
      {/* ---------------- Desktop Navbar ---------------- */}
      <div className="hidden md:flex max-w-9xl justify-between items-center px-2 py-2 md:px-8">
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle */}
          <div
            onClick={onToggleSidebar}
            data-sidebar-toggle="true"
            className="flex items-center justify-center cursor-pointer rounded-md transition-transform duration-200"
            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isSidebarOpen ? (
              <PanelLeftOpen className="h-7 w-7 text-primary drop-shadow-md" />
            ) : (
              <PanelLeftClose className="h-7 w-7 text-primary drop-shadow-md" />
            )}
          </div>

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            
            <span
              className="
              text-2xl font-extrabold 
              bg-primary bg-clip-text text-transparent 
              tracking-tight
            "
            >
              Roomezy
            </span>
          </Link>
        </div>

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

          {/* Inbox */}
          {user && (
            <button
              onClick={() => navigate("/inbox")}
              className="p-2 rounded-full hover:bg-muted transition-colors relative group"
              title="Chat Inbox"
            >
              <MessagesSquare className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                Inbox
              </span>
            </button>
          )}

          {/* Auth Menu */}
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
                className="w-56 bg-card/60 dark:bg-card/40 backdrop-blur-xl border border-border/40 shadow-xl rounded-xl"
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
                <DropdownMenuItem onClick={() => navigate("/my-posts")}>
                  <Image className="mr-2 h-4 w-4" /> Posts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/edit-profile")}>
                  <Settings className="mr-2 h-4 w-4" /> Account Settings
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
                className="flex items-center gap-1 text-sm font-medium text-foreground/90 hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link to="/register">
                <Button className="bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium shadow-md">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ---------------- Mobile Navbar ---------------- */}
      <div className="flex md:hidden justify-between items-center px-4 py-3 bg-card/90 backdrop-blur-md border-b border-border fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          {/* Sidebar Toggle Button */}
          <div
          ref={sidebarIconRef} 
            onClick={onToggleSidebar}
            data-sidebar-toggle="true"
            className="flex items-center justify-center cursor-pointer rounded-md hover:bg-accent/30 p-2 transition-transform duration-200"
            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isSidebarOpen ? (
              <PanelLeftOpen className="h-4.5 w-4.5 text-primary transition-transform" />
            ) : (
              <PanelLeftClose className="h-4.5 w-4.5 text-primary transition-transform" />
            )}
          </div>

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            
            <span
              className="text-xl font-extrabold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight"
            >
              Roomezy
            </span>
            
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user && (
            <button
              onClick={() => navigate("/inbox")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              title="Inbox"
            >
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
          <button
            onClick={() => setShowSearch((prev) => !prev)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>
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
                className="w-48 bg-card/60 dark:bg-card/40 backdrop-blur-xl border border-border/40 shadow-xl rounded-xl"
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
                <DropdownMenuItem onClick={() => navigate("/my-posts")}>
                  <Image className="mr-2 h-4 w-4" /> Posts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/edit-profile")}>
                  <Settings className="mr-2 h-4 w-4" /> Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="p-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
            >
              <User className="h-5 w-5 text-muted-foreground"/>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden px-4 py-3 bg-card border-t border-border backdrop-blur-md animate-in fade-in slide-in-from-top-2 fixed top-16 left-0 right-0 z-40">
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

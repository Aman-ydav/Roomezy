import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/features/auth/authSlice";
import {
  LayoutDashboard,
  Image,
  Settings,
  HelpCircle,
  Info,
  Home,
  Bookmark,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function Sidebar() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const publicNavItems = [{ label: "Home", icon: Home, path: "/" }];
  const privateNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "My Posts", icon: Image, path: "/my-posts" },
    { label: "Saved", icon: Bookmark, path: "/saved" },
    { label: "Account Settings", icon: Settings, path: "/edit-profile" },
  ];
  const miscItems = [
    { label: "Help Center", icon: HelpCircle, path: "/help" },
    { label: "About Us", icon: Info, path: "/about" },
  ];

  return (
    <div className="flex flex-col h-full bg-card/70 backdrop-blur-md">
      <ScrollArea className="flex-1 px-3 py-4">
        {/* Public Nav */}
        <div className="space-y-1">
          {publicNavItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className="w-full justify-start text-sm h-10"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>

        {/* Private Nav */}
        {user && (
          <>
            <Separator className="my-4" />
            <div className="space-y-1">
              {privateNavItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm h-10"
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </>
        )}

        {/* Misc */}
        <Separator className="my-4" />
        <div className="space-y-1">
          {miscItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="w-full justify-start text-sm h-10"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border/40">
        {user ? (
          <Button
            variant="destructive"
            className="w-full justify-start text-sm h-10 font-medium"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-start text-sm h-10 font-medium hover:bg-muted"
              onClick={() => navigate("/login")}
            >
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
            <Button
              className="w-full justify-start text-sm h-10 font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate("/register")}
            >
              <UserPlus className="mr-2 h-4 w-4" /> Sign Up
            </Button>
          </div>
        )}
      </div>

      <div className="text-center p-3 text-xs text-muted-foreground">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">Roomezy</span> • All rights reserved
      </div>
    </div>
  );
}

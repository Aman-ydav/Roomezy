import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Bookmark,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const quickActions = [
    {
      title: "Create New Post",
      icon: PlusCircle,
      color: "text-primary",
      onClick: () => handleNavigate("/create-post"),
    },
    {
      title: "View My Posts",
      icon: FileText,
      color: "text-accent",
      onClick: () => handleNavigate("/my-posts"),
    },
    {
      title: "Saved Posts",
      icon: Bookmark,
      color: "text-secondary-foreground",
      onClick: () => handleNavigate("/saved-posts"),
    },
    {
      title: "Edit Profile",
      icon: Settings,
      color: "text-muted-foreground",
      onClick: () => handleNavigate("/edit-profile"),
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-background py-12 px-4 md:px-8"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Welcome back, <span className="text-primary">{user?.userName}</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Manage your posts, track engagement, and personalize your experience.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-10">
        <Card className="p-5 border border-border bg-card hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Posts</p>
              <h2 className="text-2xl font-semibold text-foreground">12</h2>
            </div>
            <FileText className="w-6 h-6 text-primary" />
          </div>
        </Card>

        <Card className="p-5 border border-border bg-card hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saved Posts</p>
              <h2 className="text-2xl font-semibold text-foreground">8</h2>
            </div>
            <Bookmark className="w-6 h-6 text-accent" />
          </div>
        </Card>

        <Card className="p-5 border border-border bg-card hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <h2 className="text-2xl font-semibold text-foreground">4.5</h2>
            </div>
            <BarChart2 className="w-6 h-6 text-secondary-foreground" />
          </div>
        </Card>

        <Card className="p-5 border border-border bg-card hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Account Age</p>
              <h2 className="text-2xl font-semibold text-foreground">
                {user?.createdAt
                  ? Math.ceil(
                      (new Date() - new Date(user.createdAt)) /
                        (1000 * 60 * 60 * 24)
                    ) + " days"
                  : "—"}
              </h2>
            </div>
            <User className="w-6 h-6 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto mb-10">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <Card
              key={idx}
              onClick={action.onClick}
              className="
                flex flex-col items-center justify-center
                py-6 cursor-pointer border border-border
                hover:border-primary hover:shadow-lg
                bg-card transition-all duration-200
                text-center group
              "
            >
              <action.icon
                className={`w-8 h-8 mb-3 ${action.color} group-hover:scale-110 transition-transform duration-200`}
              />
              <p className="font-medium text-foreground group-hover:text-primary">
                {action.title}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Analytics Section Placeholder */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Analytics Overview
        </h2>
        <Card className="p-6 border border-border bg-card text-muted-foreground">
          <p className="text-sm">
            Coming soon — visual analytics for your posts’ performance,
            engagement, and saves.
          </p>
        </Card>
      </div>

      {/* Settings & Logout */}
      <div className="max-w-6xl mx-auto mt-10 flex flex-wrap justify-between gap-4">
        <Button
          onClick={() => handleNavigate("/edit-profile")}
          variant="outline"
          className="flex items-center gap-2 border-border hover:border-primary hover:text-primary"
        >
          <Settings className="w-4 h-4" />
          Profile Settings
        </Button>
        <Button
          onClick={() => toast.info('Logout functionality will be added soon.')}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </motion.div>
  );
}

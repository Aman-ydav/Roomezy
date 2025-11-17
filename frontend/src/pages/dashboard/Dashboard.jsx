import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
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
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAllPosts } from "@/features/post/postSlice";
import { logoutUser } from "@/features/auth/authSlice";
import UserDetails from "@/components/dashboard/UserDetails";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const handleNavigate = (path) => navigate(path);

  const totalPosts = posts.filter((p) => p.user?._id === user?._id).length;

  // Get recent activities (e.g., user's recent posts, limited to 3 for display)
  const recentActivities = posts
    .filter((p) => p.user?._id === user?._id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

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
      title: "Coming Soon",
      icon: Bookmark,
      color: "text-secondary-foreground",
      onClick: () => toast.info("Saved Posts feature coming soon!"),
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
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Welcome, <span className="text-primary">{user?.userName}</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Manage your posts, track engagement, and personalize your experience.
        </p>
      </div>

      {/* User Details Card */}
      <div className="max-w-6xl mx-auto mb-10">
        <UserDetails user={user} className="w-full" />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto mb-10">
        <div className="p-5 border border-border bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">My Posts</p>
              <h2 className="text-2xl font-semibold text-foreground">
                {totalPosts}
              </h2>
            </div>
            <FileText className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="p-5 border border-border bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saved Posts</p>
              <h2 className="text-2xl font-semibold text-foreground">0</h2>
            </div>
            <Bookmark className="w-6 h-6 text-accent" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto mb-10">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <div key={idx} className="cursor-pointer" onClick={action.onClick}>
              <Card
                className="
                  flex flex-col items-center justify-center py-6 border border-border
                  hover:border-primary hover:shadow-lg bg-card transition-all
                  text-center group rounded-xl
                "
              >
                <action.icon
                  className={`w-8 h-8 mb-3 ${action.color} group-hover:scale-110 transition-transform duration-200`}
                />
                <p className="font-medium text-foreground group-hover:text-primary">
                  {action.title}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-10">
        <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </h2>
        <Card className="p-6 border border-border bg-card">
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors rounded-md p-2"
                  onClick={() => handleNavigate(`/post/${activity._id}`)} 
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created on{" "}
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Rating: {activity.averageRating || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No recent activities yet.
            </p>
          )}
        </Card>
      </div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Analytics Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 border border-border bg-card">
            <div className="flex items-center gap-4">
              <BarChart2 className="w-8 h-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <h3 className="text-2xl font-semibold text-foreground">
                  {posts.filter((p) => p.user?._id === user?._id).length > 0
                    ? (
                        posts
                          .filter((p) => p.user?._id === user?._id)
                          .reduce((acc, p) => acc + (p.averageRating || 0), 0) /
                        posts.filter((p) => p.user?._id === user?._id).length
                      ).toFixed(1)
                    : 0}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border bg-card">
            <div className="flex items-center gap-4">
              <Bookmark className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Most Rated Post</p>
                <h3 className="text-lg font-semibold text-foreground">
                  {posts
                    .filter((p) => p.user?._id === user?._id)
                    .sort(
                      (a, b) =>
                        (b.ratings?.length || 0) - (a.ratings?.length || 0)
                    )[0]?.title || "None"}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border bg-card">
            <div className="flex items-center gap-4">
              <Settings className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Account Age</p>
                <h3 className="text-2xl font-semibold text-foreground">
                  {user?.createdAt
                    ? Math.ceil(
                        (new Date() - new Date(user.createdAt)) /
                          (1000 * 60 * 60 * 24)
                      ) + " days"
                    : "—"}
                </h3>
              </div>
            </div>
          </Card>
        </div>
      </div>

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
          onClick={() => dispatch(logoutUser())}
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

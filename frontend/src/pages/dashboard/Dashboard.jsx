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
  TrendingUp,
  Heart,
  Clock,
  Eye,
  ThumbsUp,
  Archive,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAllPosts } from "@/features/post/postSlice";
import { logoutUser } from "@/features/auth/authSlice";
import UserDetails from "@/features/dashboard/UserDetails";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const handleNavigate = (path) => navigate(path);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const totalPosts = posts.filter((p) => p.user?._id === user?._id).length;
  const savedPosts = 0;

  const quickActions = [
    {
      title: "Create New Post",
      icon: PlusCircle,
      color: "text-primary",
      bgColor: "bg-primary/10",
      onClick: () => handleNavigate("/create-post"),
      enabled: true,
    },
    {
      title: "View My Posts",
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
      onClick: () => handleNavigate("/my-posts"),
      enabled: true,
    },
    {
      title: "Saved Posts",
      icon: Bookmark,
      color: "text-muted-foreground",
      bgColor: "bg-muted/20",
      onClick: () => toast.info("Saved Posts page coming soon!"),
      enabled: false,
      overlay: "Coming Soon",
    },
    {
      title: "Edit Profile",
      icon: Settings,
      color: "text-secondary-foreground",
      bgColor: "bg-secondary/10",
      onClick: () => handleNavigate("/edit-profile"),
      enabled: true,
    },
  ];

  const userPosts = posts.filter((p) => p.user?._id === user?._id);
  const recentPosts = userPosts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getStatusIcon = (status) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "draft":
        return <Archive className="w-4 h-4 text-yellow-500" />;
      case "archived":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      {/* 🔹 Responsive two-column layout for desktop */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        
        {/* 🧭 Left: Existing Dashboard Content (100% same as yours) */}
        <div className="flex-1 space-y-8">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.userName}. Here's an overview of your
              activity.
            </p>
          </motion.div>

          {/* User Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <UserDetails />
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="p-6 border border-border bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Posts
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {totalPosts}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Bookmark className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Saved Posts
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {savedPosts}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, idx) => (
                <motion.div
                  key={idx}
                  whileHover={action.enabled ? { scale: 1.02 } : {}}
                  className={`cursor-pointer relative ${
                    !action.enabled ? "opacity-60" : ""
                  }`}
                  onClick={action.onClick}
                >
                  <Card
                    className={`p-6 border border-border bg-card hover:shadow-md transition-all text-center ${action.bgColor} ${
                      action.enabled ? "hover:border-primary" : ""
                    }`}
                  >
                    <action.icon
                      className={`w-8 h-8 mx-auto mb-3 ${action.color}`}
                    />
                    <p className="font-medium text-foreground">{action.title}</p>
                    {action.overlay && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
                        <p className="text-sm font-semibold text-muted-foreground">
                          {action.overlay}
                        </p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Recent Activity
            </h2>
            <Card className="p-6 border border-border bg-card">
              {recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div
                      key={post._id}
                      className="flex items-start space-x-4 p-4 border border-border rounded-lg bg-muted/10"
                    >
                      <FileText className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {post.title || "Untitled Post"}
                          </p>
                          {getStatusIcon(post.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center space-x-1">
                            <ThumbsUp className="w-3 h-3" />
                            <span>
                              {post.averageRating
                                ? post.averageRating.toFixed(1)
                                : 0}{" "}
                              rating
                            </span>
                          </span>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {post.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {post.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No Recent Activity</p>
                  <p className="text-sm">
                    Your recent posts and interactions will appear here.
                  </p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Analytics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Analytics
            </h2>
            <Card className="p-6 border border-border bg-card">
              <div className="text-center text-muted-foreground">
                <BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Analytics Coming Soon</p>
                <p className="text-sm">
                  Detailed insights into your posts' performance and audience
                  engagement.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Footer Actions */}
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <Button
              onClick={() => handleNavigate("/edit-profile")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Edit Profile
            </Button>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </motion.div>
        </div>

        {/* Right: Sticky Chat App (Responsive) */}
        <motion.div
          className="w-full lg:w-[340px] h-fit sticky top-1/2 lg:-translate-y-1/2 self-start"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="p-6 bg-card/70 border border-border/50 backdrop-blur-xl shadow-2xl text-center flex flex-col items-center justify-center rounded-2xl">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Chat App Coming Soon</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-[260px]">
              Stay tuned! Soon, you’ll be able to chat with roommates and discuss
              listings directly here.
            </p>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/inbox")}
            >
              <MessageSquare className="w-4 h-4" />
              Go to Inbox
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

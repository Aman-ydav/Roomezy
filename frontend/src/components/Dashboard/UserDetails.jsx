import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { User, Calendar, Mail, Phone, Venus, MapPin } from "lucide-react";

const UserDetails = () => {
  const { user } = useSelector((state) => state.auth);

  const formatDate = (isoDate) => {
    if (!isoDate) return "Unknown";
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-4 sm:p-5 md:p-6 border border-border bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-6">
          {/* Avatar */}
          {/* Avatar with fallback on error */}
          {user?.avatar ? (
            <motion.img
              src={user.avatar}
              alt="Profile Avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
                const fallback = document.getElementById("fallback-avatar");
                if (fallback) fallback.style.display = "flex";
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="w-30 h-30 sm:w-50 sm:h-50 rounded-full object-cover border-2 border-primary shadow-sm"
            />
          ) : null}

          {/* Fallback circle (initial letter) */}
          <div
            id="fallback-avatar"
            style={{ display: user?.avatar ? "none" : "flex" }}
            className="w-30 h-30 sm:w-50 sm:h-50 rounded-full bg-primary/10 flex items-center justify-center text-5xl font-bold text-primary border border-border shadow-sm"
          >
            {user?.userName?.[0]?.toUpperCase() || "U"}
          </div>

          {/* User Info */}
          <div className="flex-1 w-full space-y-3 text-center md:text-left">
            {/* Basic Info */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                {user?.userName || "User"}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4 text-primary" />
                {user?.email || "No email"}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-1">
              {user?.age && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 text-sm sm:text-base border border-border rounded-xl px-4 py-3 bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <User className="w-5 h-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">Age</p>
                    <p className="truncate">{user.age} years</p>
                  </div>
                </motion.div>
              )}

              {user?.gender && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 text-sm sm:text-base border border-border rounded-xl px-4 py-3 bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <Venus className="w-5 h-5 text-pink-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">Gender</p>
                    <p className="truncate capitalize">{user.gender}</p>
                  </div>
                </motion.div>
              )}

              {user?.phone && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex items-center gap-3 text-sm sm:text-base border border-border rounded-xl px-4 py-3 bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <Phone className="w-5 h-5 text-secondary shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="truncate">{user.phone}</p>
                  </div>
                </motion.div>
              )}

              {user?.createdAt && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="flex items-center gap-3 text-sm sm:text-base border border-border rounded-xl px-4 py-3 bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-secondary shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">Joined</p>
                    <p className="truncate">{formatDate(user.createdAt)}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default UserDetails;

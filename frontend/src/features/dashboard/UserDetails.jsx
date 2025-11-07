import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import {
  User,
  Calendar,
  Mail,
  Phone,
  Venus,
  MapPin,
} from "lucide-react";

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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 border border-border bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          {user?.avatar ? (
            <motion.img
              src={user.avatar}
              alt="Profile Avatar"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="w-24 h-24 rounded-full object-cover border-4 border-accent shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-accent bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent shadow-md">
              {user?.userName?.[0]?.toUpperCase() || "U"}
            </div>
          )}

          {/* User Info */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {user?.userName || "User"}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4 text-accent" />
                {user?.email || "No email"}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {user?.age && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 text-sm text-muted-foreground border border-border rounded-lg px-4 py-3 bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <User className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Age</p>
                    <p>{user.age} years</p>
                  </div>
                </motion.div>
              )}

              {user?.gender && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 text-sm text-muted-foreground border border-border rounded-lg px-4 py-3 bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <Venus className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Gender</p>
                    <p>{user.gender}</p>
                  </div>
                </motion.div>
              )}

              {user?.createdAt && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 text-sm text-muted-foreground border border-border rounded-lg px-4 py-3 bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-secondary-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Joined</p>
                    <p>{formatDate(user.createdAt)}</p>
                  </div>
                </motion.div>
              )}

              {user?.preferredLocations?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 text-sm text-muted-foreground border border-border rounded-lg px-4 py-3 bg-muted/20 hover:bg-muted/30 transition-colors sm:col-span-2 lg:col-span-1"
                >
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Locations</p>
                    <p className="truncate">{user.preferredLocations.join(", ")}</p>
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
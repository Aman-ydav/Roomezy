import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MapPin, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const statusColor =
    post.status_badge === "active"
      ? "bg-green-500/10 text-green-600 border-green-400/20"
      : "bg-red-500/10 text-red-600 border-red-400/20";

  return (
    <motion.div
      onClick={() => navigate(`/post/${post._id}`)}
      className="group cursor-pointer border border-border bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative w-full h-52 overflow-hidden">
        <img
          src={post.main_image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={statusColor}>{post.status_badge}</Badge>
          <Badge variant="secondary" className="capitalize">
            {post.badge_type?.replaceAll("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground line-clamp-1">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {post.description}
        </p>

        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {post.location}
          </span>
          {post.rent > 0 && (
            <span className="flex items-center gap-1 font-medium text-primary">
              <IndianRupee className="w-4 h-4" />
              {post.rent}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

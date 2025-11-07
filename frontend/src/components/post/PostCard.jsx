import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MapPin, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function PostCard({ post, index = 0 }) {
  const navigate = useNavigate();

  const getBadgeColor = (type) => {
    switch (type) {
      case "looking-for-room":
        return "bg-sky-500/90 hover:bg-sky-600/90";
      case "empty-room":
        return "bg-emerald-500/90 hover:bg-emerald-600/90";
      case "roommate-share":
        return "bg-violet-500/90 hover:bg-violet-600/90";
      default:
        return "bg-rose-500/90 hover:bg-rose-600/90";
    }
  };

  const hoverThemes = [
    {
      light: "hover:bg-sky-105",
      dark: "dark:hover:bg-sky-500/10",
      border: "hover:border-sky-300/50",
    },
    {
      light: "hover:bg-emerald-100",
      dark: "dark:hover:bg-emerald-500/10",
      border: "hover:border-emerald-300/50",
    },
    {
      light: "hover:bg-violet-100",
      dark: "dark:hover:bg-violet-500/10",
      border: "hover:border-violet-300/50",
    },
    {
      light: "hover:bg-rose-100",
      dark: "dark:hover:bg-rose-500/10",
      border: "hover:border-rose-300/50",
    },
    {
      light: "hover:bg-amber-100",
      dark: "dark:hover:bg-amber-500/10",
      border: "hover:border-amber-300/50",
    },
  ];

  const randomTheme = useMemo(
    () => hoverThemes[Math.floor(Math.random() * hoverThemes.length)],
    []
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.1, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => navigate(`/post/${post._id}`)}
      className={`group relative bg-card border border-border rounded-xl overflow-hidden shadow-sm
        transition-all duration-200 cursor-pointer 
        ${randomTheme.light} ${randomTheme.dark} ${randomTheme.border}
        hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_25px_rgba(0,0,0,0.4)]`}
    >
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={post.main_image}
          alt={post.title}
          className="w-full h-full object-cover pointer-events-none"
        />

        {post.badge_type && (
          <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <Badge
              className={`${getBadgeColor(
                post.badge_type
              )} backdrop-blur-sm text-white font-semibold px-3 py-1 rounded-full shadow-md`}
            >
              {post.badge_type === "looking-for-room"
                ? "Looking for Room"
                : post.badge_type === "empty-room"
                ? "Room Available"
                : "Roommate Wanted"}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col grow justify-between">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
            {post.title}
          </h3>
          <Badge
            className={`font-semibold px-3 py-1 rounded-full border group-hover:shadow-md transition-shadow duration-200 ${
              post.status_badge === "active"
                ? "bg-green-500/10 text-green-600 border-green-400/20"
                : "bg-red-500/10 text-red-600 border-red-400/20"
            }`}
          >
            {post.status_badge === "active" ? "Active" : "Closed"}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 h-10 group-hover:text-foreground transition-colors duration-200">
          {post.description}
        </p>

        <div className="flex justify-between items-center mt-3 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground transition-colors duration-200 truncate">
            <MapPin className="w-4 h-4" />
            {post.location}
          </span>
          {post.rent > 0 && (
            <span className="flex items-center gap-1 font-semibold text-primary group-hover:text-primary/80 transition-colors duration-200">
              <IndianRupee className="w-4 h-4" />
              {post.rent}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

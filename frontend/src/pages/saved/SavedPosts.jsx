import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSavedPosts, toggleSavePost } from "@/features/savedPosts/savedPostSlice";
import PostCard from "@/components/post/PostCard";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";

export default function SavedPosts() {
  const dispatch = useDispatch();
  const { saved, loading } = useSelector((s) => s.savedPosts);

  useEffect(() => {
    dispatch(getSavedPosts());
  }, [dispatch]);

  const handleUnsave = (postId) => {
    dispatch(toggleSavePost(postId));
  };

  return (
    <div className="min-h-screen bg-background px-4 md:px-10 py-10">
      <motion.h1
        className="text-3xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Saved Posts
      </motion.h1>

      {/* LOADING */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-muted h-64 rounded-xl" />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && saved.length === 0 && (
        <p className="text-muted-foreground text-sm">You have not saved any posts yet.</p>
      )}

      {/* SAVED POSTS LIST */}
      {!loading && saved.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {saved.map((item, index) => (
            <div key={item.post._id} className="relative group">

              {/* ---- Post Card ---- */}
              <PostCard post={item.post} index={index} />

              {/* ---- UNSAVE BUTTON ---- */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent navigating into post
                  handleUnsave(item.post._id);
                }}
                className="absolute top-3 right-3 z-40 px-3 py-1.5 rounded-lg 
                bg-background/80 backdrop-blur-md border border-border 
                flex items-center gap-1 text-xs font-medium
                hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                <Bookmark className="w-4 h-4" />
                Unsave
              </button>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

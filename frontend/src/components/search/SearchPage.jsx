import { useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { getAllPosts } from "@/features/post/postSlice";
import PostCard from "@/components/post/PostCard";
import PostSkeleton from "@/components/home/PostSkeleton";

export default function SearchPage() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((s) => s.post);

  const query = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const filteredPosts = useMemo(
    () =>
      posts.filter(
        (post) =>
          post.title?.toLowerCase().includes(query) ||
          post.description?.toLowerCase().includes(query) ||
          post.location?.toLowerCase().includes(query)
      ),
    [posts, query]
  );

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground px-4 md:px-8 py-10 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-bold mb-6">
        Search Results for <span className="text-primary">"{query}"</span>
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground mt-10 text-center">
          No results found for "{query}". Try a different keyword.
        </p>
      )}
    </motion.div>
  );
}

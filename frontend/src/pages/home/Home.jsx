import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { getAllPosts } from "@/features/post/postSlice";
import CreatePostBanner from "@/components/home/HeroBanner";
import PostCard from "../../components/post/PostCard";
import PostSkeleton from "../../components/home/PostSkeleton";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground py-8 px-4 md:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Create Post Banner */}
      <CreatePostBanner onClick={() => navigate("/dashboard")} />

      {/* Posts Section */}
      <div className="max-w-6xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          Explore Rooms and Roommates
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : posts?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No posts available yet. Be the first to create one!
          </p>
        )}
      </div>
    </motion.div>
  );
}

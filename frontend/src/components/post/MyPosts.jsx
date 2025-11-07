import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, useAnimation, useInView } from "framer-motion";
import { getAllPosts } from "@/features/post/postSlice";
import PostCard from "@/components/post/PostCard";
import PostSkeleton from "@/components/home/PostSkeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Edit3 } from "lucide-react";

export default function MyPosts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const myPosts = posts.filter((p) => p.user?._id === user?._id);

  const containerRef = useRef(null);
  const controls = useAnimation();
  const inView = useInView(containerRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" },
    }),
  };

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between max-w-6xl mx-auto mb-10"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Posts</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your published listings and edit them anytime.
          </p>
        </div>
        <Button
          onClick={() => navigate("/create-post")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300"
        >
          + New Post
        </Button>
      </motion.div>

      {/* Posts Grid */}
      <motion.div
        ref={containerRef}
        initial="hidden"
        animate={controls}
        variants={{
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="max-w-6xl mx-auto"
      >
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : myPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPosts.map((post, i) => (
              <motion.div
                key={post._id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="relative group"
              >
                {/* Post Card */}
                <PostCard post={post} index={i} />

                {/* Floating Edit Button (Top Right Corner) */}
                <button
                  onClick={() => navigate(`/post/${post._id}/edit`)}
                  className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 
                    bg-primary text-primary-foreground hover:bg-primary/90
                    p-2 rounded-full shadow-md transition-all duration-300
                    hover:scale-110 active:scale-95"
                  title="Edit Post"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center text-muted-foreground py-20 rounded-xl bg-muted/30 backdrop-blur-sm border border-border mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg font-medium">You haven’t created any posts yet.</p>
            <p className="text-sm mt-2">
              Start by creating a new post to share your listing.
            </p>
            <Button className="mt-5" onClick={() => navigate("/create-post")}>
              Create Post
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

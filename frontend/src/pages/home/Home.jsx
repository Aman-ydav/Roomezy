import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, useAnimation, useInView } from "framer-motion";
import { getAllPosts } from "@/features/post/postSlice";
import CreatePostBanner from "@/components/home/HeroBanner";
import PostCard from "../../components/post/PostCard";
import PostSkeleton from "../../components/home/PostSkeleton";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const containerRef = useRef(null);
  const controls = useAnimation();
  const inView = useInView(containerRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
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
      className="min-h-screen bg-background text-foreground py-8 px-4 md:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <CreatePostBanner onClick={() => navigate("/dashboard")} />
      </motion.div>

      <motion.div
        ref={containerRef}
        initial="hidden"
        animate={controls}
        variants={{
          visible: {
            transition: { staggerChildren: 0.08 },
          },
        }}
        className="max-w-6xl mx-auto mt-10"
      >
        <motion.h2
          className="text-2xl font-bold mb-6 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Explore Rooms and Roommates
        </motion.h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : posts?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post._id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No posts available yet. Be the first to create one!
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, useAnimation, useInView } from "framer-motion";
import { getAllPosts } from "@/features/post/postSlice";
import CreatePostBanner from "@/components/home/HeroBanner";
import PostCard from "@/components/post/PostCard";
import PostSkeleton from "@/components/home/PostSkeleton";
import Filters from "@/components/home/Filters"; // import your updated Filters
import { useNavigate } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading } = useSelector((state) => state.post);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

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

  // Filter + Search Logic
  const filteredPosts = useMemo(() => {
    return posts
      ?.filter((post) => {
        if (filter === "all") return true;
        return post.badge_type === filter;
      })
      .filter((post) => {
        if (!search.trim()) return true;
        const query = search.toLowerCase();
        return (
          post.title?.toLowerCase().includes(query) ||
          post.location?.toLowerCase().includes(query)
        );
      });
  }, [posts, filter, search]);

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


      <Filters
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
      />

      {/* Post Grid */}
      <motion.div
        ref={containerRef}
        initial="hidden"
        animate={controls}
        variants={{
          visible: {
            transition: { staggerChildren: 0.02 },
          },
        }}
        className="max-w-6xl mx-auto"
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
        ) : filteredPosts?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post._id}
                custom={i}
                variants={cardVariants}
                // initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-12">
            No posts found. Try adjusting your filters or search.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

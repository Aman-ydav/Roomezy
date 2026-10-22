import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, useAnimation, useInView } from "framer-motion";
import { getAllPosts } from "@/features/post/postSlice";
import CreatePostBanner from "@/components/home/HeroBanner";
import PostCard from "@/components/post/PostCard";
import PostSkeleton from "@/components/home/PostSkeleton";
import Filters from "@/components/home/Filters";
import TrustModal from "@/components/home/TrustModal";

import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import SliderSwitch from "@/components/ui/SliderSwitch";
import { ShieldCheck } from "lucide-react";

export default function Home() {
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [trustOpen, setTrustOpen] = useState(false);
  const [showTrustLabel, setShowTrustLabel] = useState(true);

  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
    const collapseTimer = setTimeout(() => setShowTrustLabel(false), 4000);
    return () => clearTimeout(collapseTimer);
  }, []);

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

  const feedPosts = useMemo(() => {
    if (!posts) return [];
    return [...posts]
      .sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0))
      .filter((post) => filter === "all" || post.badge_type === filter)
      .filter((post) => {
        if (status === "all") return true;
        return post.status_badge === status;
      })
      .filter((post) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return post.title?.toLowerCase().includes(q) || post.location?.toLowerCase().includes(q);
      });
  }, [posts, filter, status, search]);

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <div className="pt-4 bg-linear-to-b from-background to-background/80 sticky top-16 z-20">
          <SliderSwitch />
        </div>

        <div className="px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <CreatePostBanner onTrustClick={() => setTrustOpen(true)} />
          </motion.div>

          <Filters
            filter={filter}
            setFilter={setFilter}
            status={status}
            setStatus={setStatus}
            search={search}
            setSearch={setSearch}
          />

          <motion.div
            ref={containerRef}
            initial="hidden"
            animate={controls}
            variants={{ visible: { transition: { staggerChildren: 0.02 } } }}
            className="max-w-6xl mx-auto"
          >
            <motion.h2
              className="text-2xl font-bold mb-6 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Latest Rooms & Roommates
            </motion.h2>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <PostSkeleton key={i} />)}
              </div>
            ) : feedPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedPosts.map((post, i) => (
                  <motion.div
                    key={post._id}
                    custom={i}
                    variants={cardVariants}
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground mt-12">No posts available yet.</p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Floating "Why trust us?" pill */}
      <button
        onClick={() => setTrustOpen(true)}
        aria-label="Why trust us?"
        title="Why trust us?"
        className={`fixed bottom-6 left-6 z-40 flex h-11 items-center rounded-full bg-green-600 text-white text-sm font-semibold shadow-lg shadow-green-600/30 transition-all duration-500 hover:scale-105 hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/40 ${
          showTrustLabel ? "gap-2 px-4" : "px-3"
        }`}
      >
        <ShieldCheck size={15} />
        <span
          className={`overflow-hidden whitespace-nowrap transition-all duration-500 ${
            showTrustLabel ? "max-w-32 opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          Why trust us?
        </span>
      </button>

      {trustOpen && <TrustModal onClose={() => setTrustOpen(false)} />}

      <ScrollToTop />
      <div className="mt-16">
        <Footer />
      </div>
    </>
  );
}

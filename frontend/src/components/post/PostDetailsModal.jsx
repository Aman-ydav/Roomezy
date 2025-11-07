import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getPostById } from "@/features/post/postSlice";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  IndianRupee,
  MapPin,
  PawPrint,
  CigaretteOff,
  Rainbow,
  Cat,
  Dog,
  DoorOpen,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export default function PostDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedPost, loading } = useSelector((state) => state.post);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);

  // ESC to close lightbox
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") setLightboxImage(null);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading || !selectedPost)
    return (
      <div className="flex justify-center items-center min-h-screen text-muted-foreground">
        Loading post details...
      </div>
    );

  const post = selectedPost;
  const images = [post.main_image, ...(post.additional_images || [])];

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const statusColor =
    post.status_badge === "active"
      ? "bg-green-500/10 text-green-600 border-green-400/20"
      : "bg-red-500/10 text-red-600 border-red-400/20";

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* 🖼️ Single Image Carousel */}
        <Card className="overflow-hidden border border-border bg-card rounded-2xl shadow-md relative">
          {images.length > 0 && (
            <div className="relative w-full h-[340px] sm:h-[420px] md:h-[480px] overflow-hidden rounded-2xl">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`post-image-${currentIndex}`}
                onClick={() => setLightboxImage(images[currentIndex])}
                className="w-full h-full object-cover rounded-2xl cursor-pointer"
                initial={{ opacity: 0.6, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              />

              {/* Left Button */}
              {images.length > 1 && (
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 rounded-full p-2 shadow-md transition"
                >
                  <ChevronLeft className="w-6 h-6 text-foreground" />
                </button>
              )}

              {/* Right Button */}
              {images.length > 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 rounded-full p-2 shadow-md transition"
                >
                  <ChevronRight className="w-6 h-6 text-foreground" />
                </button>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-4 bg-background/60 text-foreground text-xs px-2 py-1 rounded-md">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* 🔍 Lightbox */}
        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/90 flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.img
                src={lightboxImage}
                alt="Expanded view"
                className="max-w-4xl max-h-[85vh] rounded-lg object-contain"
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
              />
              <button
                className="absolute top-6 right-8 text-white hover:text-primary transition-colors"
                onClick={() => setLightboxImage(null)}
              >
                <X size={28} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🏷️ Post Info */}
        <Card className="p-6 border border-border bg-card rounded-2xl shadow-md">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary" className="capitalize">
              {post.badge_type?.replaceAll("_", " ")}
            </Badge>
            <Badge className={statusColor}>{post.status_badge}</Badge>
            <Badge className="bg-primary/10 text-primary capitalize">
              {post.post_type.replaceAll("_", " ")}
            </Badge>
            <Badge className="bg-accent/10 text-accent capitalize">
              {post.post_role.replaceAll("_", " ")}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold text-foreground">{post.title}</h1>
          <p className="text-muted-foreground mt-2 leading-relaxed text-sm sm:text-base">
            {post.description}
          </p>

          {/* 📍 Basic Info */}
          <div className="flex flex-wrap gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" /> {post.location}
            </div>
            {post.rent > 0 && (
              <div className="flex items-center gap-1 font-medium text-primary">
                <IndianRupee className="w-4 h-4" />
                {post.rent}
              </div>
            )}
            {post.room_type && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <DoorOpen className="w-4 h-4" /> {post.room_type}
              </div>
            )}
          </div>

          {/* 🧩 Preferences */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Preferences</h2>
            <div className="flex flex-wrap gap-3">
              {post.non_smoker && (
                <Badge className="bg-green-500/10 text-green-600 border-green-400/20 flex items-center gap-1">
                  <CigaretteOff className="w-4 h-4" /> Non-Smoker
                </Badge>
              )}
              {post.lgbtq_friendly && (
                <Badge className="bg-pink-500/10 text-pink-600 border-pink-400/20 flex items-center gap-1">
                  <Rainbow className="w-4 h-4" /> LGBTQ+ Friendly
                </Badge>
              )}
              {post.has_cat && (
                <Badge className="bg-purple-500/10 text-purple-600 border-purple-400/20 flex items-center gap-1">
                  <Cat className="w-4 h-4" /> Has Cat
                </Badge>
              )}
              {post.has_dog && (
                <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-400/20 flex items-center gap-1">
                  <Dog className="w-4 h-4" /> Has Dog
                </Badge>
              )}
              {post.allow_pets && (
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-400/20 flex items-center gap-1">
                  <PawPrint className="w-4 h-4" /> Pets Allowed
                </Badge>
              )}
              {!post.non_smoker &&
                !post.lgbtq_friendly &&
                !post.has_cat &&
                !post.has_dog &&
                !post.allow_pets && (
                  <p className="text-muted-foreground text-sm italic">
                    No specific preferences mentioned.
                  </p>
                )}
            </div>
          </div>

          {/* 👤 Posted By */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Posted By</h2>
            <div className="flex items-center gap-3">
              <img
                src={post.user?.avatar}
                alt={post.user?.userName}
                className="w-12 h-12 rounded-full border border-border object-cover"
              />
              <div>
                <p className="font-medium">{post.user?.userName}</p>
                <p className="text-sm text-muted-foreground">
                  Age: {post.user?.age || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Coming Soon */}
          <div className="mt-10 p-4 border border-border rounded-md bg-accent/5 text-center text-sm text-muted-foreground italic">
            💬 Chat feature coming soon! You’ll be able to message the post owner directly here.
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

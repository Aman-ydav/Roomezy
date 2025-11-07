import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPostById,
  ratePost,
  toggleArchivePost,
  togglePostStatus,
  deletePost,
} from "@/features/post/postSlice";
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
  Trash2,
  Edit2,
  Archive,
  Star,
  StarHalf,
  MessageCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedPost: post, loading } = useSelector((s) => s.post);
  const authUser = useSelector((s) => s.auth?.user);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [localRating, setLocalRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) dispatch(getPostById(id));
  }, [dispatch, id]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") setLightboxImage(null);
      if (!post) return;
      const images = [post.main_image, ...(post.additional_images || [])];
      if (images.length <= 1) return;

      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    },
    [post]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (post) setLocalRating(0);
  }, [post]);

  if (loading || !post)
    return (
      <div className="flex justify-center items-center min-h-screen text-muted-foreground">
        Loading post details...
      </div>
    );

  const images = [post.main_image, ...(post.additional_images || [])].filter(
    Boolean
  );

  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const isOwner =
    authUser &&
    post.user &&
    String(post.user._id ?? post.user) === String(authUser._id ?? authUser._id);

  const submitRating = async (value) => {
    if (!authUser) return toast("Please sign in to rate", { type: "info" });
    if (isOwner) return toast.error("You cannot rate your own post");
    try {
      setSubmittingRating(true);
      await dispatch(ratePost({ id: post._id, value })).unwrap();
      await dispatch(getPostById(post._id));
      toast.success("Thanks for rating!");
    } catch (err) {
      toast.error(err || "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
      setLocalRating(0);
    }
  };

  const handleArchiveToggle = async () => {
    if (!isOwner) return toast.error("Only owner can archive/unarchive");
    try {
      setActionLoading(true);
      await dispatch(toggleArchivePost(post._id)).unwrap();
      await dispatch(getPostById(post._id));
      toast.success("Archive toggled");
    } catch {
      toast.error("Failed to toggle archive");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!isOwner) return toast.error("Only owner can change status");
    try {
      setActionLoading(true);
      await dispatch(togglePostStatus(post._id)).unwrap();
      await dispatch(getPostById(post._id));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to toggle status");
    } finally {
      setActionLoading(false);
    }
  };

  const statusColor =
    post.status_badge === "active"
      ? "bg-green-500/10 text-green-600 border-green-400/20"
      : "bg-red-500/10 text-red-600 border-red-400/20";

  const typeColor =
    {
      "looking-for-room": "bg-sky-500/90 text-white border-sky-400/20",
      "empty-room": "bg-emerald-500/90 text-white border-emerald-400/20",
      "roommate-share": "bg-violet-500/90 text-white border-violet-400/20",
    }[post.badge_type] || "bg-muted text-foreground";

  const renderStars = (avg) => {
    const full = Math.floor(avg);
    const half = avg - full >= 0.5;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= full)
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 inline fill-yellow-500 text-yellow-500"
          />
        );
      else if (i === full + 1 && half)
        stars.push(
          <StarHalf
            key={i}
            className="w-4 h-4 inline fill-yellow-500 text-yellow-500"
          />
        );
      else
        stars.push(
          <Star key={i} className="w-4 h-4 inline opacity-30 text-yellow-500" />
        );
    }
    return <span className="inline-flex items-center gap-1">{stars}</span>;
  };

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <div className="space-y-6">
          <Card className="p-6 border border-border bg-card rounded-2xl shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{post.title}</h1>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={statusColor}>{post.status_badge}</Badge>
                  <Badge className={typeColor}>
                    {post.badge_type === "looking-for-room"
                      ? "Looking for Room"
                      : post.badge_type === "room-available"
                      ? "Room Available"
                      : "Roommate Wanted"}
                  </Badge>
                  {post.archived && (
                    <Badge className="bg-amber-500/10 text-amber-700 border border-amber-400/30">
                      Archived
                    </Badge>
                  )}
                </div>
              </div>

              {isOwner && (
                <div className="w-full flex flex-wrap gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/post/${post._id}/edit`)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleArchiveToggle}
                    disabled={actionLoading}
                  >
                    <Archive className="w-4 h-4 mr-2" />{" "}
                    {post.archived ? "Unarchive" : "Archive"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStatusToggle}
                    disabled={actionLoading}
                  >
                    Toggle Status
                  </Button>
                </div>
              )}
            </div>
            <p className="text-muted-foreground mt-2">{post.description}</p>
          </Card>

          {/* Image Carousel */}
          <Card className="relative overflow-hidden border border-border bg-card rounded-2xl shadow-md w-full h-80 sm:h-96 md:h-[450px]">
            {images.length > 0 ? (
              <div className="absolute inset-0 w-full h-full">
                <AnimatePresence initial={false} custom={currentIndex}>
                  <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`post-image-${currentIndex}`}
                    onClick={() => setLightboxImage(images[currentIndex])}
                    className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </AnimatePresence>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 rounded-full p-2 shadow-md backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 rounded-full p-2 shadow-md backdrop-blur-sm"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-3 right-4 bg-background/60 text-foreground text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                      {currentIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </Card>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 border border-border bg-card rounded-xl">
              <h3 className="font-semibold mb-2">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {post.location}
                </div>

                {/* Budget or Rent */}
                {post.rent > 0 && (
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    {post.badge_type === "looking-for-room" ? (
                      <span>Budget: {post.rent}</span>
                    ) : (
                      <span>Rent Price: {post.rent}</span>
                    )}
                  </div>
                )}

                {post.room_type && (
                  <div className="flex items-center gap-2">
                    <DoorOpen className="w-4 h-4" /> Room Type: {post.room_type}
                  </div>
                )}
              </div>
            </Card>

            {/* Preferences */}
            <Card className="p-4 border border-border bg-card rounded-xl">
              <h3 className="font-semibold mb-2">Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {post.non_smoker && (
                  <Badge className="bg-green-100 text-green-800">
                    <CigaretteOff className="w-3 h-3 mr-1" /> Non-Smoker
                  </Badge>
                )}
                {post.lgbtq_friendly && (
                  <Badge className="bg-pink-100 text-pink-800">
                    <Rainbow className="w-3 h-3 mr-1" /> LGBTQ+
                  </Badge>
                )}
                {post.has_cat && (
                  <Badge className="bg-purple-100 text-purple-800">
                    <Cat className="w-3 h-3 mr-1" /> Has Cat
                  </Badge>
                )}
                {post.has_dog && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Dog className="w-3 h-3 mr-1" /> Has Dog
                  </Badge>
                )}
                {post.allow_pets && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <PawPrint className="w-3 h-3 mr-1" /> Pets Allowed
                  </Badge>
                )}
              </div>
            </Card>
          </div>

          {/* Rating Section */}
          <Card className="p-5 border border-border bg-linear-to-br from-card/80 to-muted/50 rounded-2xl shadow-lg">
            <h3 className="font-semibold text-lg mb-3">Rate this Post</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                {renderStars(post.averageRating ?? 0)}
                <span className="text-sm text-muted-foreground">
                  ({post.rating?.length ?? 0} ratings)
                </span>
              </div>
              {post.averageRating ? (
                <span className="text-sm font-medium text-primary">
                  Avg: {post.averageRating.toFixed(1)} ★
                </span>
              ) : (
                <span className="text-sm text-muted-foreground italic">
                  No ratings yet
                </span>
              )}
            </div>

            {!authUser ? (
              <p className="text-sm text-muted-foreground mt-3">
                Sign in to rate this post.
              </p>
            ) : isOwner ? (
              <p className="text-sm text-muted-foreground mt-3">
                Owners cannot rate their own posts.
              </p>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
                <span className="font-medium">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      onMouseEnter={() => setLocalRating(i)}
                      onMouseLeave={() => setLocalRating(0)}
                      onClick={() => submitRating(i)}
                      disabled={submittingRating}
                      className="group p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 transition-all ${
                          localRating >= i
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column (Sticky Chat Section) */}
        <div className="lg:sticky lg:top-1/2 lg:-translate-y-1/2 relative h-fit">
          {/* 🔹 Animated Chat Preview Background */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl opacity-60 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute inset-0 flex flex-col gap-3 px-4 py-6 animate-pulse">
              <div className="self-start bg-primary/25 dark:bg-primary/30 text-foreground/90 max-w-[85%] rounded-2xl px-3 py-2 text-xs shadow-sm backdrop-blur-md">
                Hey! 👋 I just saw your listing.
              </div>
              <div className="self-end bg-card/70 border border-border/50 text-foreground/90 max-w-[80%] rounded-2xl px-3 py-2 text-xs shadow-sm backdrop-blur-md">
                Hi! Great! Are you looking for a roommate?
              </div>
              <div className="self-start bg-primary/25 dark:bg-primary/30 text-foreground/90 max-w-[90%] rounded-2xl px-3 py-2 text-xs shadow-sm backdrop-blur-md">
                Yep! I’d love to connect and know more about the room.
              </div>
              <div className="self-end bg-card/70 border border-border/50 text-foreground/90 max-w-[70%] rounded-2xl px-3 py-2 text-xs shadow-sm backdrop-blur-md">
                Perfect. Let’s chat here soon!
              </div>
            </div>

            {/* Gradient overlay for clarity */}
            <div className="absolute inset-0 bg-linear-to-b from-background/95 via-background/80 to-background/95 backdrop-blur-[2px] rounded-2xl pointer-events-none" />
          </div>

          {/* 🔹 Foreground Chat Card */}
          <Card className="relative z-10 p-6 bg-card/80 border border-border/40 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" /> Chat with
                Owner
              </h2>
              <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs">
                Coming Soon
              </Badge>
            </div>

            {/* Subheader */}
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Soon you’ll be able to chat directly with the post owner, share
              details, and plan your visits — right here inside Roomezy.
            </p>

            {/* Chat Preview */}
            <div className="bg-muted/40 border border-border/40 rounded-xl p-4 shadow-inner space-y-3 backdrop-blur-sm max-h-80 overflow-y-auto">
              <div className="flex items-start gap-2">
                <MessageCircle className="text-primary mt-1" size={16} />
                <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-md max-w-[70%]">
                  <p className="text-sm">
                    Hey, I saw your post about the flat!
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 justify-end">
                <div className="bg-secondary text-secondary-foreground p-3 rounded-lg shadow-md max-w-[70%]">
                  <p className="text-sm">
                    Yes, it’s available! Want to visit tomorrow?
                  </p>
                </div>
                <MessageCircle
                  className="text-muted-foreground mt-1"
                  size={16}
                />
              </div>
              <div className="flex items-start gap-2">
                <MessageCircle className="text-primary mt-1" size={16} />
                <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-md max-w-[70%]">
                  <p className="text-sm">That’d be perfect. Thanks!</p>
                </div>
              </div>
            </div>

            {/* Disabled Input Mock */}
            <div className="mt-5 flex items-center gap-2 bg-muted/60 border border-border/30 rounded-full px-4 py-2 shadow-inner backdrop-blur-sm opacity-60">
              <input
                type="text"
                placeholder="Type a message..."
                disabled
                className="flex-1 bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/70 outline-none"
              />
              <Send className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={lightboxImage}
              alt="Expanded view"
              className="max-w-full max-h-[90vh] rounded-lg object-contain"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
            />
            <button
              className="absolute top-6 right-8 text-white hover:text-primary"
              onClick={() => setLightboxImage(null)}
            >
              <X size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

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
  AlertTriangle,
  Info,
  MessageSquare
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

  // Determine post type description
  const postTypeDescription =
    {
      "looking-for-room": "Looking for a Room",
      "empty-room": "Room Available",
      "roommate-share": "Looking for Roommate",
    }[post.badge_type] || "Post";

  // Preferences heading based on type
  let preferencesHeading = "";
  let preferencesSubtext = "";

  if (post.badge_type === "looking-for-room") {
    preferencesHeading = "My Preferences & Habits";
    preferencesSubtext =
      "Here are my personal preferences and habits to help potential roommates or owners understand my lifestyle better.";
  } else if (post.badge_type === "roommate-share") {
    preferencesHeading = "Preferences for Roommate";
    preferencesSubtext =
      "I’m looking for a roommate who matches these preferences and lifestyle habits to ensure a comfortable living environment.";
  } else if (post.badge_type === "empty-room") {
    preferencesHeading = "Owner’s Room Preferences";
    preferencesSubtext =
      "These are the owner's expectations and preferences for future tenants or roommates.";
  } else {
    // Default fallback (in case no valid badge_type is found)
    preferencesHeading = "Preferences & Lifestyle";
    preferencesSubtext =
      "Preferences or lifestyle details related to this post.";
  }

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <div className="space-y-6">
          <Card className="p-6 border border-border bg-card rounded-2xl shadow-md">
            <div className="max-w-7xl mb-6">
              {post.status_badge === "closed" && (
                <div className="flex items-center gap-2 p-4 bg-red-100 border border-red-300 text-red-800 rounded-xl shadow-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <p className="text-sm font-medium">
                    This post has been temporarily closed by the user.
                  </p>
                </div>
              )}
              {isOwner && post.archived && (
                <div className="flex items-center gap-2 p-4 bg-amber-100 border border-amber-300 text-amber-800 rounded-xl shadow-sm">
                  <Info className="w-5 h-5" />
                  <p className="text-sm font-medium">
                    You have archived this post. It’s hidden from other users.
                    You can unarchive it anytime.
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{post.title}</h1>

                {/* Prominent Post Type Indicator */}
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${typeColor} text-sm font-semibold px-3 py-1`}
                  >
                    {postTypeDescription}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={statusColor}>{post.status_badge}</Badge>
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
              <h3 className="font-semibold mb-3 text-lg">Property Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-medium">Location:</span> {post.location}
                </div>

                {/* Budget or Rent */}
                {post.rent > 0 && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                    <IndianRupee className="w-5 h-5 text-primary" />
                    <span className="font-medium">
                      {post.badge_type === "looking-for-room"
                        ? "Budget:"
                        : "Rent Price:"}
                    </span>{" "}
                    ₹{post.rent}
                  </div>
                )}

                {post.room_type && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                    <DoorOpen className="w-5 h-5 text-primary" />
                    <span className="font-medium">Room Type:</span>{" "}
                    {post.room_type}
                  </div>
                )}
              </div>
            </Card>

            {/* Preferences */}
            <Card className="p-4 border border-border bg-card rounded-xl">
              <h3 className="font-semibold mb-1 text-lg">
                {preferencesHeading}
                <span className="text-sm block font-normal">
                  {preferencesSubtext}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.non_smoker && (
                  <Badge className="bg-green-100 text-green-800 px-3 py-1">
                    <CigaretteOff className="w-3 h-3 mr-1" /> Non-Smoker
                  </Badge>
                )}
                {post.lgbtq_friendly && (
                  <Badge className="bg-pink-100 text-pink-800 px-3 py-1">
                    <Rainbow className="w-3 h-3 mr-1" /> LGBTQ+ Friendly
                  </Badge>
                )}
                {post.has_cat && (
                  <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                    <Cat className="w-3 h-3 mr-1" /> Has Cat
                  </Badge>
                )}
                {post.has_dog && (
                  <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">
                    <Dog className="w-3 h-3 mr-1" /> Has Dog
                  </Badge>
                )}
                {post.allow_pets && (
                  <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                    <PawPrint className="w-3 h-3 mr-1" /> Pets Allowed
                  </Badge>
                )}
              </div>
            </Card>
          </div>

          <Button
            onClick={() => navigate(`/chat/${post.user._id}`)}
            className="flex items-center gap-2"
          >
            <MessageSquare size={18} />
            Message With Post Owner
          </Button>

          {/* Posted By Section */}
          <Card className="p-5 border border-border/50 bg-card/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left: Avatar + Info */}
              <div className="flex items-center gap-4">
                {/* Avatar with glow */}
                <div className="relative">
                  <img
                    src={
                      post?.user?.avatar ||
                      "https://api.dicebear.com/8.x/initials/svg?seed=" +
                        post?.user?.userName
                    }
                    alt={post?.user?.userName || "User"}
                    className="w-14 h-14 rounded-full object-cover border border-border shadow-md transition-all hover:scale-105 hover:shadow-lg"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card shadow-sm" />
                </div>

                {/* User Info */}
                <div>
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-1">
                    {post?.user?.userName || "Unknown User"}
                    <Badge className="ml-1 text-[10px] px-1.5 bg-green-100 text-green-700 border border-green-300 font-medium">
                      Verified Owner
                    </Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Joined{" "}
                    {new Date(
                      post?.user?.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Right: Action Button */}
              <Button
                variant="outline"
                size="sm"
                className="text-sm flex items-center gap-2 opacity-60 cursor-not-allowed"
                title="Profile feature coming soon"
                // onClick={() => navigate(`/user/${post?.user?._id}`)}
              >
                <MessageCircle className="w-4 h-4" />
                View Profile
              </Button>
            </div>
          </Card>

          {/* Rating Section */}
          {/* Rating Section */}
          <Card className="p-6 border border-border bg-card/80 rounded-2xl shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                Rate This Post
              </h3>

              {/* Average rating display */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
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

              {/* User interaction section */}
              {!authUser ? (
                <p
                  className="text-sm text-muted-foreground mt-3 cursor-pointer hover:text-primary underline"
                  onClick={() => navigate("/login")}
                >
                  Sign in to rate this post.
                </p>
              ) : isOwner ? (
                <p className="text-sm text-muted-foreground mt-3">
                  Owners cannot rate their own posts.
                </p>
              ) : (
                <motion.div
                  className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="font-medium text-sm sm:text-base">
                    Your Rating:
                  </span>

                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => submitRating(star)}
                        disabled={submittingRating}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 transition-all duration-200 ${
                            localRating >= star
                              ? "text-yellow-500 fill-yellow-500 drop-shadow-sm"
                              : "text-muted-foreground"
                          }`}
                          onMouseEnter={() => setLocalRating(star)}
                          onMouseLeave={() => setLocalRating(0)}
                        />
                      </motion.button>
                    ))}
                  </div>

                  {submittingRating && (
                    <motion.span
                      className="text-xs text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Submitting your rating...
                    </motion.span>
                  )}
                </motion.div>
              )}

              {/* Optional: Animated bar visualization for average rating */}
              {post.averageRating > 0 && (
                <motion.div
                  className="mt-6 h-2 bg-muted rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full bg-yellow-400 rounded-full shadow-sm"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(post.averageRating / 5) * 100}%`,
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </motion.div>
              )}
            </motion.div>
          </Card>
        </div>

        {/* Right Column (Sticky Chat Section) */}

        <div className="relative h-fit lg:mt-54">
          <div className="lg:sticky lg:top-1/2 lg:-translate-y-1/2">
            <div
              className="absolute inset-0 overflow-hidden rounded-2xl opacity-40 pointer-events-none blur-2xl"
              aria-hidden="true"
            >
              <div className="absolute inset-0 flex flex-col gap-3 px-4 py-6 animate-pulse">
                <div className="self-start bg-primary/20 dark:bg-primary/25 text-foreground/80 max-w-[85%] rounded-2xl px-3 py-2 text-xs shadow-sm backdrop-blur-md">
                  Hey! 👋 I just saw your listing.
                </div>
                <div className="self-end bg-card/60 border border-border/40 text-foreground/80 max-w-[80%] rounded-2xl px-3 py-2 text-xs shadow-sm backdrop-blur-md">
                  Hi! Great! Are you looking for a roommate?
                </div>
                <div className="self-start bg-primary/20 dark:bg-primary/25 text-foreground/80 max-w-[90%] rounded-2xl px-3 py-2 text-xs shadow-sm backdrop-blur-md">
                  Yep! I’d love to connect and know more about the room.
                </div>
                <div className="self-end bg-card/60 border border-border/40 text-foreground/80 max-w-[70%] rounded-2xl px-3 py-2 text-xs shadow-sm backdrop-blur-md">
                  Perfect. Let’s chat here soon!
                </div>
              </div>

              <div className="absolute inset-0 bg-linear-to-b from-background/98 via-background/85 to-background/98 backdrop-blur-lg rounded-2xl pointer-events-none" />
            </div>

            <Card className="relative z-10 p-6 bg-card/70 border border-border/30 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  Inbuild Chat Features
                </h2>
                <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-medium animate-pulse">
                  Coming Soon
                </Badge>
              </div>

              <div className="bg-muted/30 border border-border/30 rounded-xl p-4 shadow-inner space-y-3 backdrop-blur-sm max-h-80 overflow-y-auto opacity-70">
                <div className="flex items-start gap-2">
                  <MessageCircle
                    className="text-muted-foreground mt-1"
                    size={16}
                  />
                  <div className="bg-muted text-muted-foreground p-3 rounded-lg shadow-md max-w-[70%]">
                    <p className="text-sm">
                      Hey, I saw your post about the flat!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 justify-end">
                  <div className="bg-muted/80 text-muted-foreground p-3 rounded-lg shadow-md max-w-[70%]">
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
                  <MessageCircle
                    className="text-muted-foreground mt-1"
                    size={16}
                  />
                  <div className="bg-muted text-muted-foreground p-3 rounded-lg shadow-md max-w-[70%]">
                    <p className="text-sm">That’d be perfect. Thanks!</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 bg-muted/50 border border-border/20 rounded-full px-4 py-2 shadow-inner backdrop-blur-sm opacity-50 cursor-not-allowed">
                <input
                  type="text"
                  placeholder="Type a message..."
                  disabled
                  className="flex-1 bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/60 outline-none"
                />
                <Send className="w-4 h-4 text-muted-foreground" />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-background/70 backdrop-blur-sm rounded-2xl px-4 py-2 text-xs text-foreground font-medium">
                  Feature Coming Soon
                </div>
              </div>
            </Card>
          </div>
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

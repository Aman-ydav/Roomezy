import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPostById,
  ratePost,
  toggleArchivePost,
  togglePostStatus,
} from "@/features/post/postSlice";
import { Badge } from "@/components/ui/badge";
import { createConversation } from "@/utils/chatApi";
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
  Bookmark,
  Edit2,
  Archive,
  Star,
  ArrowLeft,
  StarHalf,
  MessageCircle,
  Info,
  AlertTriangle,
  MessageSquare,
  User,
  Calendar,
  Home,
  CheckCircle,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import MiniChatWidget from "@/components/chat/MiniChatWidget";
import Loader from "@/components/layout/Loader";
import { toggleSavePost } from "@/features/savedPosts/savedPostSlice";

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
  const [chatLoading, setChatLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isEditingRating, setIsEditingRating] = useState(false);

  useEffect(() => {
    if (id) dispatch(getPostById(id));
  }, [dispatch, id]);

  // Find user's existing rating when post loads
  useEffect(() => {
    if (post && authUser && post.rating) {
      const existingRating = post.rating.find(
        (rating) => rating.user === authUser._id
      );
      if (existingRating) {
        setUserRating(existingRating.value);
        setLocalRating(existingRating.value);
      }
    }
  }, [post, authUser]);

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

  const handleChatClick = async () => {
    if (!authUser) {
      navigate("/login");
      return;
    }
    if (isOwner) return;

    setChatLoading(true);

    try {
      await createConversation({
        senderId: authUser._id,
        receiverId: post.user._id,
      });

      navigate("/inbox", {
        state: { openChatWith: post.user._id },
      });
    } catch (error) {
      console.error("Failed to create conversation:", error);
      navigate("/inbox", {
        state: { openChatWith: post.user._id },
      });
    } finally {
      setChatLoading(false);
    }
  };

  if (loading || !post) return <Loader />;

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
      setUserRating(value);
      setLocalRating(value);
      setIsEditingRating(false);
      toast.success(userRating > 0 ? "Rating updated!" : "Thanks for rating!");
    } catch (err) {
      toast.error(err || "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleEditRating = () => {
    setIsEditingRating(true);
    setLocalRating(userRating);
  };

  const handleCancelEdit = () => {
    setIsEditingRating(false);
    setLocalRating(userRating);
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

  // PREVIOUS COLORS FOR STATUS BADGES
  const statusColor =
    post.status_badge === "active"
      ? "bg-green-500/10 text-green-600 border-green-400/20"
      : "bg-red-500/10 text-red-600 border-red-400/20";

  // PREVIOUS COLORS FOR TYPE BADGES
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

  const postTypeDescription =
    {
      "looking-for-room": "Looking for a Room",
      "empty-room": "Room Available",
      "roommate-share": "Looking for Roommate",
    }[post.badge_type] || "Post";

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Section with Gradient Background */}
      <div className="bg-linear-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-row items-start justify-between gap-4 mb-6">
            <motion.button
              onClick={() => navigate(-1)}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card/80 backdrop-blur-sm border border-border text-foreground hover:bg-card font-medium transition-all duration-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>

            {authUser && !isOwner && (
              <motion.button
                onClick={() => dispatch(toggleSavePost(post._id))}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-xl border font-medium transition-all duration-200 shadow-sm ${
                  post.isSaved
                    ? "bg-primary text-white border-primary shadow-lg"
                    : "bg-card/80 backdrop-blur-sm text-foreground border-border hover:bg-card"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 transition-all ${
                    post.isSaved ? "fill-white text-white" : "text-foreground"
                  }`}
                />
                {post.isSaved ? "Saved" : "Save Post"}
              </motion.button>
            )}
          </div>

          {/* Status Alerts */}
          <div className="space-y-3 mb-6">
            {post.status_badge === "closed" && (
              <div className="flex items-center gap-3 p-4 bg-red-100 border border-red-300 text-red-800 rounded-xl">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">
                  This post has been temporarily closed by the user.
                </p>
              </div>
            )}
            {isOwner && post.archived && (
              <div className="flex items-center gap-3 p-4 bg-amber-100 border border-amber-300 text-amber-800 rounded-xl">
                <Info className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">
                  You have archived this post. It's hidden from other users.
                </p>
              </div>
            )}
          </div>

          {/* Title and Badges */}
          <div className="text-center sm:text-left">
            <div className="flex flex-wrap gap-2 justify-start sm:justify-start">
              <Badge className={`${typeColor} text-sm font-semibold px-2 py-1`}>
                {postTypeDescription}
              </Badge>
              <Badge className={`${statusColor} text-sm px-2 py-1`}>
                {post.status_badge}
              </Badge>
              {post.archived && (
                <Badge className="bg-amber-500/10 text-amber-700 border border-amber-400/30 px-4 py-2">
                  Archived
                </Badge>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                  {post.title}
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl">
                  {post.description}
                </p>
              </div>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start mt-6 pt-6 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/post/${post._id}/edit`)}
                  className="flex items-center gap-2 bg-card/80 backdrop-blur-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Post
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleArchiveToggle}
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-card/80 backdrop-blur-sm"
                >
                  <Archive className="w-4 h-4" />
                  {post.archived ? "Unarchive" : "Archive"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStatusToggle}
                  disabled={actionLoading}
                  className="bg-card/80 backdrop-blur-sm"
                >
                  Toggle Status
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-lg">
              {images.length > 0 ? (
                <div className="relative aspect-4/3 w-full">
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
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </AnimatePresence>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 shadow-xl backdrop-blur-sm transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 shadow-xl backdrop-blur-sm transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {currentIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="aspect-4/3 w-full flex items-center justify-center text-muted-foreground bg-muted/30">
                  <div className="text-center">
                    <Home className="w-12 h-12 mx-auto mb-2 opacity-40" />
                    <p>No images available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <DoorOpen className="w-6 h-6 text-primary" />
                Property Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border">
                    <MapPin className="w-6 h-6 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold text-foreground">
                        {post.location}
                      </p>
                    </div>
                  </div>

                  {post.rent > 0 && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border">
                      <IndianRupee className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {post.badge_type === "looking-for-room"
                            ? "Budget"
                            : "Monthly Rent"}
                        </p>
                        <p className="font-semibold text-foreground">
                          ₹{post.rent}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {post.room_type && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border">
                      <DoorOpen className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Room Type
                        </p>
                        <p className="font-semibold text-foreground">
                          {post.room_type}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Additional space for future details */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/10 border border-border/50">
                    <User className="w-6 h-6 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Availability
                      </p>
                      <p className="font-semibold text-foreground">Immediate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lifestyle Preferences */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Lifestyle & Preferences
              </h2>
              <p className="text-muted-foreground mb-6">
                {post.badge_type === "looking-for-room"
                  ? "My personal preferences and habits for a comfortable living environment"
                  : post.badge_type === "roommate-share"
                  ? "Preferences I'm looking for in a potential roommate"
                  : "Owner's expectations and preferences for tenants"}
              </p>

              <div className="flex flex-wrap gap-3">
                {post.non_smoker && (
                  <Badge className="bg-green-100 text-green-800 px-3 py-2 border border-green-300">
                    <CigaretteOff className="w-4 h-4 mr-1" />
                    Non-Smoker
                  </Badge>
                )}
                {post.lgbtq_friendly && (
                  <Badge className="bg-pink-100 text-pink-800 px-3 py-2 border border-pink-300">
                    <Rainbow className="w-4 h-4 mr-1" />
                    LGBTQ+ Friendly
                  </Badge>
                )}
                {post.has_cat && (
                  <Badge className="bg-purple-100 text-purple-800 px-3 py-2 border border-purple-300">
                    <Cat className="w-4 h-4 mr-1" />
                    Has Cat
                  </Badge>
                )}
                {post.has_dog && (
                  <Badge className="bg-yellow-100 text-yellow-800 px-3 py-2 border border-yellow-300">
                    <Dog className="w-4 h-4 mr-1" />
                    Has Dog
                  </Badge>
                )}
                {post.allow_pets && (
                  <Badge className="bg-blue-100 text-blue-800 px-3 py-2 border border-blue-300">
                    <PawPrint className="w-4 h-4 mr-1" />
                    Pets Allowed
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Owner Profile */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Posted By
              </h3>

              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img
                    src={
                      post?.user?.avatar ||
                      "https://api.dicebear.com/8.x/initials/svg?seed=" +
                        post?.user?.userName
                    }
                    alt={post?.user?.userName || "User"}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20 shadow-md"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card shadow-sm" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground text-lg">
                    {post?.user?.userName || "Unknown User"}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="text-xs bg-green-100 text-green-700 border border-green-300">
                      Verified Owner
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                Joined{" "}
                {new Date(
                  post?.user?.createdAt || Date.now()
                ).toLocaleDateString()}
              </div>

              {/* <Button
                variant="outline"
                size="sm"
                className="w-full bg-card/50 backdrop-blur-sm border-border text-foreground hover:bg-card"
                disabled
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                View Full Profile
              </Button> */}
            </div>

            {/* Chat Action */}
            {!isOwner && (
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Interested in this room?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with the owner to discuss details, schedule a visit,
                  or ask questions.
                </p>

                <Button
                  onClick={handleChatClick}
                  disabled={chatLoading}
                  className="w-full bg-primary text-white hover:bg-primary/90 border border-primary transition-all duration-200 shadow-lg"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {chatLoading
                    ? "Starting Chat..."
                    : authUser
                    ? "Start Conversation"
                    : "Login to Chat"}
                </Button>
              </div>
            )}

            {/* Rating Section - UPDATED WITH EDIT FUNCTIONALITY */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-4">Community Rating</h3>

              <div className="text-center mb-4">
                <div className="flex justify-center mb-2">
                  {renderStars(post.averageRating ?? 0)}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Average:{" "}
                    {post.averageRating ? post.averageRating.toFixed(1) : "0.0"}
                  </span>
                  <span>•</span>
                  <span>{post.rating?.length ?? 0} ratings</span>
                </div>
              </div>

              {!authUser ? (
                <p
                  className="text-sm text-muted-foreground text-center cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate("/login")}
                >
                  Sign in to rate this post
                </p>
              ) : isOwner ? (
                <p className="text-sm text-muted-foreground text-center">
                  Owners cannot rate their own posts
                </p>
              ) : userRating > 0 && !isEditingRating ? (
                // User has already rated - show their fixed rating with edit option
                <div className="space-y-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-success mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      Your Rating: {userRating} ★
                    </span>
                  </div>
                  <div className="flex justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 ${
                          star <= userRating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground opacity-30"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditRating}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit Rating
                    </Button>
                  </div>
                </div>
              ) : (
                // User is rating/editing - show interactive stars
                <div className="space-y-3">
                  <p className="text-sm font-medium text-center">
                    {userRating > 0 ? "Update Your Rating:" : "Your Rating:"}
                  </p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => submitRating(star)}
                        disabled={submittingRating}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-all duration-200 ${
                            localRating >= star
                              ? "text-yellow-500 fill-yellow-500 shadow-lg"
                              : "text-muted-foreground"
                          }`}
                          onMouseEnter={() => setLocalRating(star)}
                          onMouseLeave={() => setLocalRating(userRating)}
                        />
                      </motion.button>
                    ))}
                  </div>

                  {userRating > 0 && isEditingRating && (
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {submittingRating && (
                    <p className="text-xs text-muted-foreground text-center">
                      {userRating > 0
                        ? "Updating rating..."
                        : "Submitting rating..."}
                    </p>
                  )}

                  {localRating > 0 && !submittingRating && (
                    <p className="text-xs text-muted-foreground text-center">
                      Click a star to {userRating > 0 ? "update" : "submit"}{" "}
                      your rating
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={lightboxImage}
              alt="Expanded view"
              className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
            />
            <button
              className="absolute top-6 right-8 text-white hover:text-primary transition-colors bg-black/50 rounded-full p-2"
              onClick={() => setLightboxImage(null)}
            >
              <X size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOwner && (
        <div className="fixed bottom-6 right-6 z-50">
          <MiniChatWidget receiverId={post.user._id} />
        </div>
      )}
    </motion.div>
  );
}

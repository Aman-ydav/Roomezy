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
  const [chatMessage, setChatMessage] = useState(""); // For chat input

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
    if (!authUser) {
      toast("Please sign in to rate", { type: "info" });
      return;
    }
    if (isOwner) {
      toast.error("You cannot rate your own post");
      return;
    }
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
    } catch (err) {
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
    } catch (err) {
      toast.error("Failed to toggle status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) return toast.error("Only owner can delete this post");
    const confirm = window.confirm(
      "Are you sure you want to delete this post? This action is irreversible."
    );
    if (!confirm) return;
    try {
      setActionLoading(true);
      await dispatch(deletePost(post._id)).unwrap();
      toast.success("Post deleted");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to delete post");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    // Placeholder: In a real app, send message to backend
    toast.info("Chat feature coming soon! Message not sent.");
    setChatMessage("");
  };

  const statusColor =
    post.status_badge === "active"
      ? "bg-green-500/10 text-green-600 border-green-400/20"
      : "bg-red-500/10 text-red-600 border-red-400/20";

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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Post Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header with Actions */}
          <Card className="p-6 border border-border bg-card rounded-2xl shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{post.title}</h1>
                <Badge className={statusColor}>{post.status_badge}</Badge>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/posts/${post._id}/edit`)}
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
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={actionLoading}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
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
                      aria-label="previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 rounded-full p-2 shadow-md backdrop-blur-sm"
                      aria-label="next image"
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

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 border border-border bg-card rounded-xl">
              <h3 className="font-semibold mb-2">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {post.location}
                </div>
                {post.rent > 0 && (
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" /> {post.rent}
                  </div>
                )}
                {post.room_type && (
                  <div className="flex items-center gap-2">
                    <DoorOpen className="w-4 h-4" /> {post.room_type}
                  </div>
                )}
              </div>
            </Card>

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

          {/* Rating */}
          <Card className="p-5 border border-border bg-linear-to-br from-card/80 to-muted/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="font-semibold text-lg mb-3">Rate this Post</h3>

            {/* Average Rating Display */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {renderStars(post.averageRating ?? 0)}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({post.rating?.length ?? 0} ratings)
                </span>
              </div>

              {/* Display numerical average */}
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

            {/* Auth & Rating Logic */}
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
                      className="group p-1 transition-transform duration-200 hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-6 h-6 transition-all duration-200 ${
                          localRating >= i
                            ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]"
                            : "text-muted-foreground/40 group-hover:text-yellow-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Chat */}
        <div className="space-y-6">
          <Card className="p-6 border border-border bg-card rounded-2xl shadow-md relative overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Chat with Owner
            </h2>
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 bg-accent/40 rounded-2xl flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-white text-3xl font-bold mb-8">
                  Coming Soon
                </div>
                <div className="text-white text-sm">
                  Chat feature is under development. Stay tuned!
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4 space-y-3 max-h-96 overflow-y-auto scrollbar-hide opacity-30">
              {/* Simulated Chat Messages */}
              <div className="flex items-start gap-2">
                <MessageCircle className="text-primary mt-1" size={16} />
                <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-md max-w-xs">
                  <p className="text-sm">Hi! Interested in the room?</p>
                </div>
              </div>
              <div className="flex items-start gap-2 justify-end">
                <div className="bg-secondary text-secondary-foreground p-3 rounded-lg shadow-md max-w-xs">
                  <p className="text-sm">Yes, can we schedule a visit?</p>
                </div>
                <MessageCircle
                  className="text-muted-foreground mt-1"
                  size={16}
                />
              </div>
              <div className="flex items-start gap-2">
                <MessageCircle className="text-primary mt-1" size={16} />
                <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-md max-w-xs">
                  <p className="text-sm">Sure! How about tomorrow at 2 PM?</p>
                </div>
              </div>
              <div className="flex items-start gap-2 justify-end">
                <div className="bg-secondary text-secondary-foreground p-3 rounded-lg shadow-md max-w-xs">
                  <p className="text-sm">Perfect! See you then.</p>
                </div>
                <MessageCircle
                  className="text-muted-foreground mt-1"
                  size={16}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4 opacity-30">
              <Input
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled
              />
              <Button onClick={handleSendMessage} size="sm" disabled>
                <Send className="w-4 h-4" />
              </Button>
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
              aria-label="close"
            >
              <X size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

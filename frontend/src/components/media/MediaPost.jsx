// src/components/media/MediaPost.jsx - Update the handleLike function and like logic
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, getAllComments, deleteMediaPost, getAllMediaPosts } from "@/features/media/mediaSlice";
import { useAuth } from "@/hooks/useAuth";
import { Heart, MessageCircle, Share, MoreHorizontal, Trash2, LogIn, Bookmark, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import MediaCarousel from "./MediaCarousel";
import CommentsSection from "./CommentsSection";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function MediaPost({ post, onLike, currentUser }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { userLikes, posts: allPosts } = useSelector((state) => state.media);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [localIsLiked, setLocalIsLiked] = useState(false);

  // Check if current user liked this post - IMPROVED VERSION
  useEffect(() => {
    // Method 1: Check if post has isLiked field from backend (most reliable)
    if (post.isLiked !== undefined) {
      setLocalIsLiked(post.isLiked);
      return;
    }
    
    // Method 2: Check if we have userLikes array in Redux store
    if (userLikes && Array.isArray(userLikes) && currentUser) {
      const isLiked = userLikes.some(like => 
        like.media === post._id || like._id === post._id
      );
      setLocalIsLiked(isLiked);
      return;
    }
    
    // Method 3: Check if post.likes array contains current user
    if (post.likes && Array.isArray(post.likes) && currentUser) {
      const userLiked = post.likes.some(like => {
        // Handle both populated and non-populated like objects
        const likeUserId = like.user?._id || like.user;
        return likeUserId === currentUser._id;
      });
      setLocalIsLiked(userLiked);
      return;
    }
    
    // Method 4: Check if current post in Redux store has updated like info
    if (allPosts && Array.isArray(allPosts) && currentUser) {
      const updatedPost = allPosts.find(p => p._id === post._id);
      if (updatedPost) {
        if (updatedPost.isLiked !== undefined) {
          setLocalIsLiked(updatedPost.isLiked);
          return;
        }
        if (updatedPost.likes && Array.isArray(updatedPost.likes)) {
          const userLiked = updatedPost.likes.some(like => {
            const likeUserId = like.user?._id || like.user;
            return likeUserId === currentUser._id;
          });
          setLocalIsLiked(userLiked);
          return;
        }
      }
    }
    
    // Default to false
    setLocalIsLiked(false);
  }, [post, currentUser, userLikes, allPosts]);

  // Safe date formatting
  const formatPostDate = (dateString) => {
    try {
      if (!dateString) return "Recently";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recently";
      
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return "just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      return "Recently";
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    if (!commentText.trim() || !currentUser) return;

    setPostingComment(true);
    try {
      await dispatch(addComment({
        mediaId: post._id,
        comment_text: commentText.trim()
      })).unwrap();
      
      setCommentText("");
      // Refresh comments to show the new one immediately
      dispatch(getAllComments(post._id));
      toast.success("Comment added!");
    } catch (error) {
      toast.error(error.message || "Failed to add comment");
    } finally {
      setPostingComment(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    setIsLiking(true);
    // Store current state for potential rollback
    const previousLikeState = localIsLiked;
    
    // Optimistically update UI immediately
    setLocalIsLiked(!previousLikeState);
    
    try {
      await onLike(post._id);
      
      // After successful like, refresh the posts to get updated like state
      // This ensures we have the correct isLiked status from backend
      setTimeout(() => {
        dispatch(getAllMediaPosts());
      }, 300);
      
    } catch (error) {
      // Revert optimistic update on error
      setLocalIsLiked(previousLikeState);
      toast.error("Failed to like post");
    } finally {
      setIsLiking(false);
    }
  };

 

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteMediaPost(post._id)).unwrap();
      toast.success("Post deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const toggleComments = () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    if (!showComments) {
      // Load comments when opening comments section
      dispatch(getAllComments(post._id));
    }
    setShowComments(!showComments);
  };

  const handleLogin = () => {
    setLoginDialogOpen(false);
    navigate("/login");
  };

  return (
    <>
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-card/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src={post.user?.avatar} alt={post.user?.userName} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {post.user?.userName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {post.user?.userName || "Unknown User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPostDate(post.createdAt)}
              </p>
            </div>
          </div>

          {currentUser?._id === post.user?._id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                <DropdownMenuItem 
                  onClick={handleDeleteClick}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Media */}
        <MediaCarousel 
          images={post.images || []} 
          video={post.video} 
        />

        {/* Actions */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className={`p-0 h-9 w-9 rounded-full transition-all duration-200 ${
                  localIsLiked 
                    ? "text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <Heart className={`h-5 w-5 transition-transform ${localIsLiked ? "fill-current scale-110" : ""} ${isLiking ? "animate-pulse" : ""}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleComments}
                className="p-0 h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
              >
                <Share className="h-5 w-5" />
              </Button>
            </div>

          
          </div>

          {/* Likes count */}
          {post.likes_count > 0 && (
            <p className="text-sm font-semibold mb-2 text-foreground">
              {post.likes_count} like{post.likes_count !== 1 ? 's' : ''}
            </p>
          )}

          {/* Description */}
          {post.description && (
            <div className="mb-3 p-3 bg-muted/30 rounded-lg border border-border/30">
              <div className="flex items-start gap-2">
                <span className="text-sm font-semibold text-foreground shrink-0">
                  {post.user?.userName}
                </span>
                <span className="text-sm text-foreground/90 leading-relaxed">{post.description}</span>
              </div>
            </div>
          )}

          {/* Comments preview */}
          {post.comments_count > 0 && !showComments && (
            <button
              onClick={toggleComments}
              className="text-sm text-muted-foreground hover:text-primary transition-colors mb-3 font-medium"
            >
              View all {post.comments_count} comment{post.comments_count !== 1 ? 's' : ''}
            </button>
          )}

          {/* Add comment */}
          <form onSubmit={handleAddComment} className="flex gap-2 mt-2">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={isAuthenticated ? "Add a comment..." : "Login to comment..."}
              className="flex-1 resize-none text-sm min-h-10 bg-background/50 border-border focus:border-primary/50 transition-colors rounded-lg"
              rows={1}
              disabled={postingComment || !isAuthenticated}
              onClick={() => !isAuthenticated && setLoginDialogOpen(true)}
            />
            <Button 
              type="submit" 
              size="sm" 
              disabled={!commentText.trim() || postingComment || !isAuthenticated}
              onClick={() => !isAuthenticated && setLoginDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
            >
              {postingComment ? "..." : "Post"}
            </Button>
          </form>
        </div>

        {/* Comments section */}
        {showComments && (
          <CommentsSection 
            postId={post._id}
            onClose={() => setShowComments(false)}
          />
        )}
      </div>

      {/* Login Required Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <LogIn className="h-5 w-5 text-primary" />
              Login Required
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              You need to be logged in to like, comment, or interact with posts.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Please log in to your account to continue.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setLoginDialogOpen(false)}
                className="border-border hover:bg-accent/50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleLogin}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Log In
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Post
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete this post? This action cannot be undone and all comments and likes will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive font-medium">
                ⚠️ This action is permanent
              </p>
              <p className="text-xs text-destructive/80 mt-1">
                Your post, along with all associated comments and likes, will be deleted forever.
              </p>
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
              className="flex-1 border-border hover:bg-accent/50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Post"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
// src/components/media/MediaFeed.jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMediaPosts, toggleLikeMedia } from "@/features/media/mediaSlice";
import { useAuth } from "@/hooks/useAuth";
import MediaPost from "./MediaPost";
import CreateMediaPost from "./CreateMediaPost";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, LogIn, Sparkles, Users, Image } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export default function MediaFeed() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading, error } = useSelector((state) => state.media);
  const { user, isAuthenticated } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const feedRef = useRef(null);

  useEffect(() => {
    const loadPosts = async () => {
      setInitialLoad(true);
      await dispatch(getAllMediaPosts());
      setInitialLoad(false);
    };
    
    loadPosts();
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(getAllMediaPosts());
    setRefreshing(false);
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }
    await dispatch(toggleLikeMedia(postId));
  };

  const handleLogin = () => {
    setLoginDialogOpen(false);
    navigate("/login");
  };

  // Show loading skeleton only on initial load
  if (initialLoad) {
    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Modern Header Skeleton */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-10 w-28 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-96 w-full rounded-xl mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Modern Professional Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Brand Section */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Image className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-4 w-4 text-primary fill-primary" />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Community Feed
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>Real Stories from Real Rooms — Drop Yours</span>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-3">
             
              
              {isAuthenticated ? (
                <CreateMediaPost />
              ) : (
                <Button 
                  onClick={() => setLoginDialogOpen(true)}
                  className="gap-2 h-10 px-4 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="font-semibold">New Post</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div ref={feedRef} className="max-w-2xl mx-auto p-4 space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4">
              <Image className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No posts yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {isAuthenticated 
                ? "Be the first to share your room experiences, tips, or favorite moments with the community!" 
                : "Login to create the first post and start sharing with the Roomezy community!"
              }
            </p>
            {isAuthenticated ? (
              <CreateMediaPost />
            ) : (
              <Button 
                onClick={() => setLoginDialogOpen(true)}
                className="gap-2 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              >
                <LogIn className="h-4 w-4" />
                Login to Post
              </Button>
            )}
          </div>
        ) : (
          posts.map((post) => (
            <MediaPost
              key={post._id}
              post={post}
              onLike={handleLike}
              currentUser={user}
            />
          ))
        )}
        
        {loading && posts.length > 0 && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading more posts...</span>
            </div>
          </div>
        )}
      </div>

      {/* Login Required Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <LogIn className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg">Join the Community</DialogTitle>
                <DialogDescription>
                  Login to interact with posts and share your experiences
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <p className="text-sm text-muted-foreground">
              Create posts, like content, and connect with other roommates in the Roomezy community.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setLoginDialogOpen(false)}
                className="rounded-lg"
              >
                Later
              </Button>
              <Button 
                onClick={handleLogin}
                className="rounded-lg bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              >
                Log In Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
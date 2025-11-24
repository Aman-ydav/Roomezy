// src/components/media/MediaFeed.jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMediaPosts, toggleLikeMedia } from "@/features/media/mediaSlice";
import { useAuth } from "@/hooks/useAuth";
import MediaPost from "./MediaPost";
import CreateMediaPost from "./CreateMediaPost";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, LogIn, Sparkles, Users, Image, MessageCircle, Share2 } from "lucide-react";
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
        {/* Mobile-Optimized Header Skeleton */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="hidden sm:block space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded-lg sm:h-10 sm:w-24" />
                <Skeleton className="h-10 w-10 rounded-lg sm:w-28" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-64 w-full rounded-xl mb-4 sm:h-80" />
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
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg ">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            {/* Brand Section - Mobile Optimized */}
            <div className="flex items-center gap-3">
              
              <div className="sm:flex flex-col">
                <h1 className="text-lg font-bold text-foreground">
                  Roomezy Stories
                </h1>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>Share your space</span>
                </div>
              </div>
            </div>


            {/* Actions Section - Mobile First */}
            <div className="flex items-center gap-2">
              
              
              {isAuthenticated ? (
                <CreateMediaPost />
              ) : (
                <Button 
                  onClick={() => setLoginDialogOpen(true)}
                  size="sm"
                  className="h-10 px-3 sm:px-4 bg-primary hover:bg-primary/90 rounded-lg font-medium"
                >
                  <LogIn className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile-Only Quick Stats Bar */}
        <div className="border-t border-border/50 bg-background/80 sm:hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3 text-primary" />
                  <span>Discussions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="h-3 w-3 text-success" />
                  <span>Shares</span>
                </div>
              </div>
              
             
            </div>
          </div>
        </div>
      </div>

      {/* Feed Content - Mobile Optimized */}
      <div ref={feedRef} className="max-w-2xl mx-auto p-4 space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
              <Image className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No stories yet
            </h3>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              {isAuthenticated 
                ? "Be the first to share your room story and inspire the community!" 
                : "Join our community to share your space and get inspired."
              }
            </p>
            {isAuthenticated ? (
              <CreateMediaPost />
            ) : (
              <Button 
                onClick={() => setLoginDialogOpen(true)}
                className="bg-primary hover:bg-primary/90 font-medium"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Start Sharing
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
            <div className="flex items-center gap-3 text-muted-foreground bg-card rounded-xl px-4 py-3 border border-border">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div className="text-sm">
                <div className="font-medium text-foreground">Loading more</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile-Optimized Login Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="max-w-[90vw] rounded-2xl border border-border bg-card sm:mx-auto mx-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
                <LogIn className="h-6 w-6 text-white" />
              </div>
              <div className="">
                <DialogTitle className="text-xl font-bold text-foreground">
                  Join Roomezy Stories
                </DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  Unlock the full community experience
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <span>Share your room transformations</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-accent rounded-full"></div>
                <span>Connect with room enthusiasts</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <span>Get inspired by real spaces</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-end pt-3">
              <Button
                variant="outline"
                onClick={() => setLoginDialogOpen(false)}
                className="rounded-lg order-2 sm:order-1"
              >
                Explore First
              </Button>
              <Button 
                onClick={handleLogin}
                className="bg-primary hover:bg-primary/90 rounded-lg order-1 sm:order-2 mb-2 sm:mb-0"
              >
                Join Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Floating Action Button for Mobile */}
      {!isAuthenticated && (
        <div className="fixed bottom-6 right-6 z-40 md:hidden">
          <Button 
            onClick={() => setLoginDialogOpen(true)}
            className="h-14 w-14 rounded-2xl bg-primary shadow-lg hover:bg-primary/90 transition-all duration-300"
            size="icon"
          >
            <LogIn className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
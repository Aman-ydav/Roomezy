// src/components/media/CommentsSection.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllComments } from "@/features/media/mediaSlice";
import { X, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CommentsSection({ postId, onClose }) {
  const dispatch = useDispatch();
  const { comments, commentsLoading } = useSelector((state) => state.media);
  const postComments = comments[postId] || [];
  const isLoading = commentsLoading[postId];

  useEffect(() => {
    // Load comments when component mounts
    dispatch(getAllComments(postId));
  }, [dispatch, postId]);

  const formatCommentDate = (dateString) => {
    try {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return "just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="border-t border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold">Comments</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Comments list */}
      <ScrollArea className="h-64">
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : postComments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-4">
              {postComments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={comment.user?.avatar} />
                    <AvatarFallback className="text-xs">
                      {comment.user?.userName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="font-semibold text-sm mb-1">
                        {comment.user?.userName || "Unknown User"}
                      </p>
                      <p className="text-sm wrap-break-word">{comment.comment_text}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCommentDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
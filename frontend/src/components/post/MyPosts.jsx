import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, deletePost } from "@/features/post/postSlice";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function MyPosts() {
  const { posts, loading } = useSelector((s) => s.post);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const myPosts = posts.filter((p) => p.user?._id === user?._id);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <motion.div
      className="max-w-6xl mx-auto py-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-bold mb-6 text-foreground">
        My Posts ({myPosts.length})
      </h1>

      {myPosts.length === 0 ? (
        <p className="text-muted-foreground">You haven’t created any posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPosts.map((post) => (
            <motion.div
              key={post._id}
              whileHover={{ scale: 1.02 }}
              className="border border-border bg-card rounded-xl p-4 shadow-sm"
            >
              <h2 className="font-semibold text-foreground">{post.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.description}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-primary font-medium">₹{post.rent}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => dispatch(deletePost(post._id))}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

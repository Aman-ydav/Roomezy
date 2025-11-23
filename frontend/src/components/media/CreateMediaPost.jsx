// src/components/media/CreateMediaPost.jsx
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { createMediaPost } from "@/features/media/mediaSlice";
import { Plus, X, Image, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function CreateMediaPost() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleFileSelect = (e, type) => {
    const files = Array.from(e.target.files);
    
    if (type === 'images') {
      if (files.length + images.length > 3) {
        toast.error("Maximum 3 images allowed");
        return;
      }
      setImages(prev => [...prev, ...files]);
    } else if (type === 'video') {
      if (files.length > 1) {
        toast.error("Only one video allowed");
        return;
      }
      if (files[0]) {
        setVideo(files[0]);
        setImages([]); // Clear images if video is selected
      }
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!images.length && !video) {
      toast.error("Please select at least one image or video");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    
    // Append images
    images.forEach((image) => {
      formData.append("images", image);
    });
    
    // Append video
    if (video) {
      formData.append("video", video);
    }

    setUploading(true);
    try {
      await dispatch(createMediaPost(formData)).unwrap();
      toast.success("Post created successfully");
      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to create post");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setDescription("");
    setImages([]);
    setVideo(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogTitle className="sr-only">Create New Post</DialogTitle>
        <DialogDescription className="sr-only">
          Upload images or video and add a description to create a new post
        </DialogDescription>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold">Create New Post</h2>
          
          {/* Media upload area */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            {images.length === 0 && !video ? (
              <div className="space-y-4">
                <div className="flex gap-4 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Add Images
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Add Video
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload up to 3 images or 1 video
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Images preview */}
                {images.length > 0 && (
                  <div className="flex gap-2 flex-wrap justify-center">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="h-32 w-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Video preview */}
                {video && (
                  <div className="relative">
                    <video
                      src={URL.createObjectURL(video)}
                      className="h-48 mx-auto rounded-lg"
                      controls
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                      onClick={removeVideo}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (video) {
                      videoInputRef.current?.click();
                    } else {
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  Change Media
                </Button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e, 'images')}
              className="hidden"
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => handleFileSelect(e, 'video')}
              className="hidden"
            />
          </div>

          {/* Description */}
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a caption..."
            rows={3}
          />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
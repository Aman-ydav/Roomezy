import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, X, ImagePlus, User, Home } from "lucide-react";

export default function Step3Images({ files, setFiles, postType }) {
  const [previewUrls, setPreviewUrls] = useState([]);

  // Sync previews when files change
  useEffect(() => {
    const urls = [];
    if (files.main_image) urls.push(URL.createObjectURL(files.main_image));
    if (files.media_files?.length)
      urls.push(...files.media_files.map((f) => URL.createObjectURL(f)));
    setPreviewUrls(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const handleMainImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFiles((prev) => ({ ...prev, main_image: file }));
  };

  const handleMediaFiles = (e) => {
    const selected = Array.from(e.target.files).slice(0, 3);
    setFiles((prev) => ({ ...prev, media_files: selected }));
  };

  const removeImage = (index) => {
    if (index === 0 && files.main_image) {
      setFiles((prev) => ({ ...prev, main_image: null }));
    } else {
      const mediaIndex = index - 1;
      const updatedMedia = files.media_files?.filter((_, i) => i !== mediaIndex);
      setFiles((prev) => ({ ...prev, media_files: updatedMedia }));
    }
  };

  const isRoomSeeker = postType === "looking-for-room";

  return (
    <div className="space-y-6">
      {/* Context-Specific Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center sm:text-left"
      >
        <h2 className="text-xl font-semibold text-foreground flex items-center justify-center sm:justify-start gap-2">
          {isRoomSeeker ? (
            <>
              <User className="w-5 h-5 text-primary" />
              You’re <span className="text-primary font-bold">looking for a room</span>
            </>
          ) : (
            <>
              <Home className="w-5 h-5 text-primary" />
              You’re <span className="text-primary font-bold">offering a room</span>
            </>
          )}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isRoomSeeker
            ? "Upload a clear photo of yourself so room owners or roommates can recognize and trust you."
            : "Upload images of the room and facilities — at least one is mandatory for everyone."}
        </p>
      </motion.div>

      {/* Main Image Upload */}
      <div>
        <label className="text-sm font-medium block mb-2">
          {isRoomSeeker ? (
            <>
              Your Photo <span className="text-destructive">*</span>
            </>
          ) : (
            <>
              Main Room Image <span className="text-destructive">*</span>
            </>
          )}
        </label>

        <div className="flex items-center gap-3">
          <input
            id="main-upload"
            type="file"
            accept="image/*"
            onChange={handleMainImage}
            className="hidden"
          />
          <label
            htmlFor="main-upload"
            className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-md px-4 py-2 hover:bg-accent/10 transition-all"
          >
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isRoomSeeker ? "Select Your Photo" : "Select Main Room Image"}
            </span>
          </label>
        </div>
      </div>

      {/* Additional Images (Only for Room Owners) */}
      {!isRoomSeeker && (
        <div>
          <label className="text-sm font-medium block mb-2">
            Additional Room Images (up to 3)
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Add more pictures of the facilities, furniture, or living space to attract more responses.
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleMediaFiles}
            className="block text-sm text-muted-foreground"
          />
        </div>
      )}

      {/* Preview Section */}
      {previewUrls.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`grid ${isRoomSeeker ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"} gap-4 mt-4`}
        >
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`preview-${index}`}
                className={`${
                  isRoomSeeker ? "rounded-full h-40 w-40 mx-auto object-cover" : "w-full h-36 object-cover rounded-md"
                } border border-border shadow-sm`}
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-background/70 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4 text-destructive" />
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {/* Info Message */}
      <p className="text-xs text-muted-foreground italic mt-2 text-center sm:text-left">
        {isRoomSeeker
          ? "You only need to upload your photo once — it helps others know who you are."
          : "Upload at least one clear photo of the room. Add more for better engagement."}
      </p>
    </div>
  );
}

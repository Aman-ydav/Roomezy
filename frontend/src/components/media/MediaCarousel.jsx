// src/components/media/MediaCarousel.jsx
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MediaCarousel({ images = [], video }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const media = video ? [video] : images;

  if (!media.length) return null;

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <div className="relative bg-black">
      {/* Media display */}
      {video ? (
        <div className="relative w-full aspect-square flex items-center justify-center">
          <video
            src={media[currentIndex]}
            controls
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="h-16 w-16 text-white/80" />
          </div>
        </div>
      ) : (
        <img
          src={media[currentIndex]}
          alt={`Post image ${currentIndex + 1}`}
          className="w-full h-auto aspect-square object-cover"
        />
      )}

      {/* Navigation arrows */}
      {media.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots indicator */}
      {media.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
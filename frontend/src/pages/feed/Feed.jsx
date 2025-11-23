// src/pages/feed/Feed.jsx
import React from "react";
import ScrollToTop from "@/components/layout/ScrollToTop";
import MediaFeed from "@/components/media/MediaFeed";
import SliderSwitch from "@/components/ui/SliderSwitch";

export default function Feed() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        {/* Slider Switch for Feed Page */}
        <div className="pt-4 pb-2 bg-linear-to-b from-background to-background/80 sticky top-16 z-20">
          <SliderSwitch />
        </div>

        {/* Media Feed */}
        <div className="py-4">
          <MediaFeed />
        </div>
      </div>
      <ScrollToTop />
    </>
  );
}
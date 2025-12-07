import React, { useState } from "react";
import { motion } from "framer-motion";
import Step1Basic from "@/components/createPost/Step1Basic";
import Step2Details from "@/components/createPost/Step2Details"; 
import Step3Images from "@/components/createPost/Step3Images";
import StepIndicator from "@/components/createPost/StepIndicator";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import {
  Home,
  Users,
  User,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function PostingGuide() {
  const [currentSection, setCurrentSection] = useState(0);

  // --- Mock Data for Examples ---
  const mockDataBase = {
    title: "",
    description: "",
    location: "",
    rent: "",
    room_type: "",
    non_smoker: false,
    lgbtq_friendly: false,
    has_cat: false,
    has_dog: false,
    allow_pets: false,
    post_type: "",
    post_role: "",
  };

  const mockFiles = {
    main_image: null,
    media_files: [],
  };

  // --- Mock Users ---
  const mockOwner = { accountType: "ownerLookingForRenters" };
  const mockRoommateFinder = { accountType: "lookingForRoommate" };
  const mockRoomSeeker = { accountType: "lookingForRoom" };

  const sections = [
    {
      id: 1,
      title: "If You Are an Owner",
      subtitle: "You want to list your room and find a reliable renter.",
      icon: <Home className="w-10 h-10 text-primary" />,
      user: mockOwner,
      exampleTitle: "Owner Listing (Example)",
      description:
        "Owners can publish posts to list their available rooms. Post type and role are auto-selected for accuracy.",
      data: { ...mockDataBase, post_type: "room-available", post_role: "owner" },
      shortTitle: "Owner - Property Listing",
    },
    {
      id: 2,
      title: "If You're Looking for a Roommate",
      subtitle: "You already have a room and want someone to share it with.",
      icon: <Users className="w-10 h-10 text-primary" />,
      user: mockRoommateFinder,
      exampleTitle: "Roommate Finder (Example)",
      description:
        "People searching for roommates can list their space and specify lifestyle preferences for better matches.",
      data: { ...mockDataBase, post_type: "room-available", post_role: "roommate-share" },
      shortTitle: "Roommate Seeker",
    },
    {
      id: 3,
      title: "If You're Looking for a Room",
      subtitle: "You are searching for a place to stay.",
      icon: <User className="w-10 h-10 text-primary" />,
      user: mockRoomSeeker,
      exampleTitle: "Room Seeker (Example)",
      description:
        "Room seekers can share their preferences, budget, and personal details to help owners trust them.",
      data: { ...mockDataBase, post_type: "looking-for-room", post_role: "seeker" },
      shortTitle: "Room Seeker",
    },
  ];

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % sections.length);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + sections.length) % sections.length);
  };

  const sec = sections[currentSection];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center py-16 px-6 md:px-8"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-4">
          How Posting Works on Roomezy
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Whether you're an owner, searching for a roommate, or looking for a
          room—your posting flow is personalized. Here's how each role works.
        </p>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-24">
        {/* Slider Navigation Bar */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={prevSection}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="Previous section"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <div className="flex bg-muted/50 rounded-lg overflow-hidden">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`px-4 py-3 md:px-10 md:py-4 text-sm md:text-base font-medium transition-all flex-1 ${
                  index === currentSection
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/70"
                }`}
                aria-label={`Go to ${section.shortTitle}`}
              >
                {section.shortTitle}
              </button>
            ))}
          </div>
          <button
            onClick={nextSection}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="Next section"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>
        </div>

        {/* Current Section Content */}
        <motion.section
          key={sec.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="border border-border rounded-xl p-8 md:p-10 bg-card shadow-sm"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="shrink-0 p-3 bg-primary/10 rounded-full">
              {sec.icon}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">{sec.title}</h2>
              <p className="text-muted-foreground mt-1">{sec.subtitle}</p>
            </div>
          </div>

          <p className="text-sm md:text-base text-foreground mb-8 leading-relaxed">{sec.description}</p>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Step1 Example */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-primary">
                Step 1 — Basic Information
              </h3>
              <div className="border border-border rounded-lg p-6 bg-background">
                <Step1Basic
                  data={{ ...sec.data }}
                  setData={() => {}}
                  user={sec.user}
                />
              </div>
            </motion.div>

            {/* Step2 Example */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-primary">
                Step 2 — Room Details
              </h3>
              <div className="border border-border rounded-lg p-6 bg-background">
                <Step2Details
                  data={{ ...sec.data }}
                  setData={() => {}}
                />
              </div>
            </motion.div>

            {/* Step3 Example */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-primary">
                Step 3 — Image Upload
              </h3>
              <div className="border border-border rounded-lg p-6 bg-background">
                <Step3Images
                  files={mockFiles}
                  setFiles={() => {}}
                  postType={
                    sec.user.accountType === "lookingForRoom"
                      ? "looking-for-room"
                      : "room-available"
                  }
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-3 mt-8 p-4 bg-muted/50 rounded-lg"
          >
            <CheckCircle className="w-6 h-6 text-primary shrink-0" />
            <span className="text-primary font-medium text-sm md:text-base">
              This is exactly how your posting experience will look.
            </span>
          </motion.div>
        </motion.section>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
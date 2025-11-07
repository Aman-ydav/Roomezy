import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { PawPrint, Dog, Cat, CigaretteOff, Heart } from "lucide-react";

export default function Step2Details({ data, setData }) {
  useEffect(() => {
    let newBadge = "empty-room";
    if (data.post_type === "room-available" && data.post_role === "owner") {
      newBadge = "empty-room";
    } else if (
      data.post_type === "room-available" &&
      data.post_role === "roommate-share"
    ) {
      newBadge = "roommate-share";
    } else if (data.post_type === "looking-for-room") {
      newBadge = "looking-for-room";
    }
    setData((prev) => ({ ...prev, badge_type: newBadge }));
  }, [data.post_type, data.post_role, setData]);

  const handleChange = (field) => {
    setData({ ...data, [field]: !data[field] });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Room Details</h2>
      <p className="text-sm text-muted-foreground">
        Add some extra details about your room or preferences.
      </p>

      {/* Room Type */}
      <div>
        <label className="text-sm font-medium">Room Type</label>
        <input
          type="text"
          value={data.room_type}
          onChange={(e) => setData({ ...data, room_type: e.target.value })}
          placeholder="e.g. Single Room, Shared Room, 2BHK"
          className="w-full border border-input bg-background rounded-md p-2 mt-1"
        />
      </div>

      {/* Preferences */}
      <div>
        {/* Context-Aware Label */}
        <label className="text-sm font-medium block mb-2">
          {data.post_type === "looking-for-room"
            ? "Your Lifestyle & Preferences"
            : "Preferred Roommate Preferences"}
        </label>

        {/* Context-Aware Subtext */}
        <p className="text-xs text-muted-foreground mb-3">
          {data.post_type === "looking-for-room"
            ? "Tell others about your lifestyle or habits — it helps find compatible roommates."
            : "Select the preferences you’d like your future roommate to have."}
        </p>

        {/* Preference Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            {
              key: "non_smoker",
              label:
                data.post_type === "looking-for-room"
                  ? "I don’t smoke"
                  : "Prefer non-smoker",
              icon: <CigaretteOff className="w-4 h-4" />,
            },
            {
              key: "lgbtq_friendly",
              label:
                data.post_type === "looking-for-room"
                  ? "LGBTQ+ Friendly"
                  : "Prefer LGBTQ+ friendly",
              icon: <Heart className="w-4 h-4" />,
            },
            {
              key: "has_dog",
              label:
                data.post_type === "looking-for-room"
                  ? "I have a dog"
                  : "Okay with dogs",
              icon: <Dog className="w-4 h-4" />,
            },
            {
              key: "has_cat",
              label:
                data.post_type === "looking-for-room"
                  ? "I have a cat"
                  : "Okay with cats",
              icon: <Cat className="w-4 h-4" />,
            },
            {
              key: "allow_pets",
              label:
                data.post_type === "looking-for-room"
                  ? "Pets allowed where I stay"
                  : "Allow pets",
              icon: <PawPrint className="w-4 h-4" />,
            },
          ].map((item) => (
            <motion.button
              key={item.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChange(item.key)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                data[item.key]
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-foreground hover:bg-accent/10"
              }`}
            >
              {item.icon}
              {item.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

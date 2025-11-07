import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Step1Basic({ data, setData }) {
  const [availableRoles, setAvailableRoles] = useState([]);

  useEffect(() => {
    if (data.post_type === "room-available") {
      setAvailableRoles([
        { value: "owner", label: "I’m the Owner" },
        { value: "roommate-share", label: "I have a room, looking for a roommate" },
      ]);
      if (data.post_role === "room-seeker") {
        setData({ ...data, post_role: "owner" });
      }
    } else {
      setAvailableRoles([{ value: "room-seeker", label: "Room Seeker" }]);
      setData({ ...data, post_role: "room-seeker" });
    }
  }, [data.post_type]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
      <p className="text-sm text-muted-foreground">
        Let’s start with the basics — what kind of post are you creating and who you are.
      </p>

      {/* Post Type */}
      <div>
        <label className="text-sm font-medium block mb-2">
          What are you posting about? <span className="text-destructive">*</span>
        </label>
        <div className="flex gap-3 flex-wrap">
          {[
            { value: "room-available", label: "I have a room to offer" },
            { value: "looking-for-room", label: "I’m looking for a room" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setData({ ...data, post_type: option.value })}
              className={`px-4 py-2 rounded-md border transition-all ${
                data.post_type === option.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-foreground hover:bg-accent/10"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Role */}
      <AnimatePresence mode="wait">
        {availableRoles.length > 0 && (
          <motion.div
            key={data.post_type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <label className="text-sm font-medium block mb-2">
              Posting as (You are) <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-3 flex-wrap">
              {availableRoles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => setData({ ...data, post_role: role.value })}
                  className={`px-4 py-2 rounded-md border transition-all ${
                    data.post_role === role.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-foreground hover:bg-accent/10"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <div>
        <label className="text-sm font-medium">
          Post Title <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          placeholder="e.g. Spacious 2BHK near city center / need a room near city"
          className="w-full border border-input bg-background rounded-md p-2 mt-1"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">
          Description <span className="text-destructive">*</span>
        </label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows={6}
          placeholder="Describe your room or what kind of room you’re looking for e.g. 
fully furnished
air conditioned
high-speed Wi-Fi
lower backup
ro water"
          className="w-full border border-input bg-background rounded-md p-2 mt-1 resize-none text-sm"
        />
      </div>

      {/* Location + Rent */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">
            Location <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => setData({ ...data, location: e.target.value })}
            placeholder="e.g. Delhi, Mumbai, Bangalore"
            className="w-full border border-input bg-background rounded-md p-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            {data.post_type === "looking-for-room" ? (
              <span className="text-foreground text-xs ml-1">Budget (₹)</span>
            ) : (
              <span> Rent (₹) <span className="text-destructive">*</span></span>
            )}
          </label>
          <input
            type="number"
            value={data.rent}
            onChange={(e) => setData({ ...data, rent: e.target.value })}
            placeholder="Enter monthly rent"
            className="w-full border border-input bg-background rounded-md p-2 mt-1"
          />
        </div>
      </div>
    </div>
  );
}


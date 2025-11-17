import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Step1Basic({ data, setData, user }) {
  // Auto-lock allowed posting options based on user.accountType
  useEffect(() => {
    if (!user?.accountType) return;

    if (user.accountType === "lookingForRoom") {
      setData({
        ...data,
        post_type: "looking-for-room",
        post_role: "room-seeker",
      });
    }

    if (user.accountType === "lookingForRoommate") {
      setData({
        ...data,
        post_type: "room-available",
        post_role: "roommate-share",
      });
    }

    if (user.accountType === "ownerLookingForRenters") {
      setData({
        ...data,
        post_type: "room-available",
        post_role: "owner",
      });
    }
  }, [user?.accountType]);

  // Allowed roles based on account type
  const getAvailableRoles = () => {
    if (user.accountType === "lookingForRoom") {
      return [{ value: "room-seeker", label: "Room Seeker" }];
    }
    if (user.accountType === "lookingForRoommate") {
      return [
        {
          value: "roommate-share",
          label: "I have a room and want a roommate",
        },
      ];
    }
    if (user.accountType === "ownerLookingForRenters") {
      return [{ value: "owner", label: "I'm the Owner" }];
    }
    return [];
  };

  const availableRoles = getAvailableRoles();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
      <p className="text-sm text-muted-foreground">
        These options are based on your account type.
      </p>

      {/* POST TYPE - LOCKED */}
      <div>
        <label className="text-sm font-medium block mb-2">
          Post Type <span className="text-destructive">*</span>
        </label>

        <div className="text-sm px-4 py-2 rounded-md bg-accent/20 border border-input text-primary font-medium">
          {data.post_type === "looking-for-room"
            ? "Looking for a Room"
            : "Room Available"}
        </div>

        <p className="text-xs text-muted-foreground mt-1 italic">
          Based on your account type, this option is automatically selected.
        </p>
      </div>

      {/* ROLE - LOCKED */}
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
              Posting as <span className="text-destructive">*</span>
            </label>

            <div className="text-sm px-4 py-2 rounded-md bg-accent/20 border border-input text-primary font-medium">
              {availableRoles.find((r) => r.value === data.post_role)?.label}
            </div>

            <p className="text-xs text-muted-foreground mt-1 italic">
              You cannot change this role.
            </p>
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
          placeholder="e.g. Spacious 2BHK near IT Park / need a room near Koramangala"
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
          placeholder="Describe details…"
          className="w-full border border-input bg-background rounded-md p-2 mt-1 resize-none text-sm"
        />
      </div>

      {/* Location + Rent/Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">
            Location <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => setData({ ...data, location: e.target.value })}
            placeholder="City"
            className="w-full border border-input bg-background rounded-md p-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            {data.post_type === "looking-for-room"
              ? "Budget (₹)"
              : "Rent (₹) *"}
          </label>
          <input
            type="number"
            value={data.rent}
            onChange={(e) => setData({ ...data, rent: e.target.value })}
            placeholder="Enter amount"
            className="w-full border border-input bg-background rounded-md p-2 mt-1"
          />
        </div>
      </div>
    </div>
  );
}

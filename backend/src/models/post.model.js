import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Type and Role
    post_type: {
      type: String,
      enum: ["looking_for_room", "room_available"],
      required: true,
    },
    post_role: {
      type: String,
      enum: ["owner", "room_stayer"],
      required: true,
    },

    // Basic Info
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    rent: {
      type: Number,
      default: 0,
    },
    room_type: {
      type: String,
      trim: true,
    },

    // Media
    main_image: {
      type: String, // Cloudinary URL
      required: true,
    },
    additional_images: [
      {
        type: String, // Up to 3 Cloudinary URLs
      },
    ],

    // Badges
    badge_type: {
      type: String,
      enum: ["roommate_shareable", "empty_room"],
      required: true,
    },
    status_badge: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    // Auto & Expiration
    archived: {
      type: Boolean,
      default: false,
    },
    auto_closed_at: {
      type: Date,
      default: null,
    },
    expiration_date: {
      type: Date,
      default: null,
    },

    // Preferences (checkboxes)
    non_smoker: {
      type: Boolean,
      default: false,
    },
    lgbtq_friendly: {
      type: Boolean,
      default: false,
    },
    has_cat: {
      type: Boolean,
      default: false,
    },
    has_dog: {
      type: Boolean,
      default: false,
    },
    allow_pets: {
      type: Boolean,
      default: false,
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Rating moved here
    rating: {
      type: Number,
      default: 0,
    }
    },
    { timestamps: true,
});

postSchema.pre("save", function (next) {
  if (this.additional_images.length > 3) {
    throw new Error("Maximum of 3 images allowed.");
  }
  next();
});

postSchema.pre("save", function (next) {
  if (this.post_type === "looking_for_room" && this.post_role !== "room_stayer") {
    throw new Error("Looking for room post must have role = room_stayer");
  }
  next();
});




export const Post = mongoose.model("Post", postSchema);

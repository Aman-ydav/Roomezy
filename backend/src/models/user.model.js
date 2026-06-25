import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        gender: {
            type: String,
            default: null,
        },

        phone: {
            type: String,
            trim: true,
            default: null,
        },

        age: {
            type: Number,
            default: null,
        },

        avatar: {
            type: String,
        },

        preferredLocations: {
            type: [String],
            default: [],
        },

        password: {
            type: String,
            required: false,
        },

        refreshToken: {
            type: String,
        },

        resetPasswordToken: String,
        resetPasswordExpire: Date,

        accountType: {
            type: String,
            enum: [
                "lookingForRoom",
                "lookingForRoommate",
                "ownerLookingForRenters",
            ],
            default: null,
        },

        googleId: {
            type: String,
            default: null,
        },

        provider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },

        verificationCode: {
            type: String,
        },

        verificationCodeExpire: {
            type: Date,
        },

        // Recommendation preferences
        budgetMin: { type: Number, default: 0 },
        budgetMax: { type: Number, default: 0 },

        // Post credits (owners only — 5 free posts, then ₹49/post)
        postCreditsBalance: { type: Number, default: 0, min: 0 },

        // KYC verification
        kycStatus: {
            type: String,
            enum: ["none", "awaiting_payment", "verified", "attempts_exhausted"],
            default: "none",
        },
        kycAttempts:        { type: Number, default: 0, max: 20 },
        kycMatchedAt:       { type: Date, default: null },
        kycPaymentDeadline: { type: Date, default: null },
        kycVerifiedAt:      { type: Date, default: null },
        kycDocumentType: {
            type: String,
            enum: ["aadhaar", "pan", "passport"],
            default: null,
        },
        kycSelfieUrl:   { type: String, default: null },
        kycDocumentUrl: { type: String, default: null },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate JWT Tokens
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
};

// Password Reset Token
userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

export const User = mongoose.model("User", userSchema);

// src/controllers/auth.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { cleanupLocalFiles } from "../utils/fileCleanUp.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import "../config.js";
import { sendEmail } from "../utils/sendEmail.js";

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,           // true on production (HTTPS)
  sameSite: isProd ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found while generating tokens");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    userName,
    email,
    password,
    age,
    phone,
    gender,
    preferredLocations,
    accountType,
  } = req.body;

  const requiredFields = [userName, email, password, gender, accountType];

  if (requiredFields.some((f) => !f || String(f).trim() === "") || !age) {
    cleanupLocalFiles(req.files);
    throw new ApiError(
      400,
      "Required fields: userName, email, password, age, gender, accountType"
    );
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    cleanupLocalFiles(req.files);
    throw new ApiError(409, "User already exists with this email");
  }

  let avatarUrl = "";
  if (req.file?.path) {
    avatarUrl = req.file.path;
  }

  const avatar = avatarUrl ? await uploadOnCloudinary(avatarUrl) : null;

  const newUser = await User.create({
    userName: userName.toLowerCase(),
    email,
    password,
    age,
    phone,
    avatar: avatar?.url,
    gender,
    accountType,
    preferredLocations: preferredLocations || [],
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    cleanupLocalFiles(req.files);
    throw new ApiError(500, "User registration failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) throw new ApiError(400, "Email is required to login");
  if (!password) throw new ApiError(400, "Password is required to login");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found with this email");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Password is invalid");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});


const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is missing");
  }

  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded?._id);
    if (!user) throw new ApiError(401, "User not found");

    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is expired or mismatched");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, `Invalid refresh token: ${error.message}`);
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) throw new ApiError(401, "Old password is incorrect");

  user.password = newPassword;
  user.refreshToken = undefined; // logout from all devices
  await user.save();

  return res
    .status(200)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL_PROD}/reset-password/${resetToken}`;

    const html = `
    <div style="font-family:sans-serif;background:#f7f9fc;padding:20px;border-radius:10px;">
      <h2 style="color:#007bff;">Reset Your Roomezy Password</h2>
      <p>We received a request to reset your password.</p>
      <a href="${resetUrl}" style="background:#007bff;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>If you didn’t request this, please ignore this email.</p>
      <p style="color:#555;">– The Roomezy Team</p>
    </div>
  `;

    await sendEmail(user.email, "Password Reset Request", html);

    res.status(200).json(
        new ApiResponse(200, {}, "Reset link sent successfully!")
    );
});

const resetPassword = asyncHandler(async (req, res) => {
    //  Hash token (same way we stored it)
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    //  Find user with matching token & not expired
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) throw new ApiError(400, "Invalid or expired token");

    // Update password
    user.password = req.body.password;

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Save user
    await user.save();

    res.status(200).json(new ApiResponse(200, {}, "Password reset successful"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "Current user fetched successfully")
    );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { userName, age, gender, preferredLocations } = req.body;

  if (
    !userName &&
    !age &&
    !gender &&
    (!preferredLocations || preferredLocations.length === 0)
  ) {
    throw new ApiError(
      400,
      "At least one field (name, age, gender, or preferred locations) is required"
    );
  }

  const updateFields = {};

  if (userName?.trim()) updateFields.userName = userName.trim();
  if (age) updateFields.age = age;
  if (gender) updateFields.gender = gender;

  if (preferredLocations) {
    if (typeof preferredLocations === "string") {
      updateFields.preferredLocations = [preferredLocations];
    } else if (Array.isArray(preferredLocations)) {
      updateFields.preferredLocations = preferredLocations.filter(
        (loc) => typeof loc === "string" && loc.trim().length > 0
      );
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true }
  ).select("-password -refreshToken");

  if (!updatedUser) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Account details updated successfully")
    );
});


const getUserProfileById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select(
        "-password -refreshToken"
    );
    if (!user) throw new ApiError(404, "User not found");
    res.status(200).json(new ApiResponse(200, user, "User profile fetched"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) throw new ApiError(500, "Error uploading avatar");

  const userId = req.user?._id;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const oldAvatarUrl = user.avatar;

  user.avatar = avatar.url;
  await user.save();

  if (oldAvatarUrl) {
    await deleteFromCloudinary(oldAvatarUrl).catch(() => {});
  }

  const updatedUser = await User.findById(userId).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});


const deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const user = await User.findById(userId);

    if (!user) throw new ApiError(404, "User not found");

    // Delete user's Cloudinary avatar (if exists)
    if (user.avatar) {
        const result = await deleteFromCloudinary(user.avatar);
        if (result?.result === "ok") {
            console.log("User avatar deleted from Cloudinary");
        } else {
            console.warn("Avatar not found or already deleted in Cloudinary.");
        }
    }

    // Delete the user account from DB
    await User.findByIdAndDelete(userId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Account deleted successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    forgotPassword,
    resetPassword,
    getUserProfileById,
    deleteAccount,
};

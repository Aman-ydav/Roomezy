import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { cleanupLocalFiles } from "../utils/fileCleanUp.js";
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error in generating access and refresh token");
    }
};

const registerUser = asyncHandler(async (req, res, next) => {
    const {
        userName,
        email,
        password,
        age,
        phone,
        gender,
        preferredLocations,
    } = req.body;

    // validate required fields
    if ([userName, email, password, age, gender].some((f) => !f?.trim())) {
        cleanupLocalFiles(req.files);
        throw new ApiError(
            400,
            "Required fields missing: userName, email, password, age"
        );
    }

    // Check if user already exists
    const existedUser = await User.findOne({ $or: [{ email }] });
    if (existedUser) {
        cleanupLocalFiles(req.files);
        throw new ApiError(409, "User already exists with this email");
    }

    // if avatar is there then
    let avatarUrl = "";
    if (req.file && req.file.path) {
        avatarUrl = req.file.path;
    }

    const avatar = await uploadOnCloudinary(avatarUrl);

    // Create user in DB
    const newUser = await User.create({
        userName: userName.toLowerCase(),
        email,
        password,
        age,
        phone,
        avatar: avatar?.url,
        gender,
        preferredLocations: preferredLocations ? preferredLocations : [],
    });

    // Fetch user without sensitive fields
    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) {
        cleanupLocalFiles(req.files);
        throw new ApiError(500, "User registration failed");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, "User registered successfully")
        );
});

const loginUser = asyncHandler(async (req, res, next) => {
    // get the data from frontend
    // username or email base login
    // check user existance
    // check for password match
    // generate access token and refresh token
    // send cookies
    // send response

    const { email, password } = req.body;
    console.log(email);

    if (!email) {
        throw new ApiError(400, "email is required to login");
    }

    const user = await User.findOne({
        $or: [{ email }],
    });

    if (!user) {
        throw new ApiError(404, "User not found with this email");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Password is invalid");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    if (!accessToken || !refreshToken) {
        throw new ApiError(500, "Error in generating access and refresh token");
    }

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none", // allows cross-origin cookies
    };

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: undefined },
        },
        { new: true }
    ).select("-password -refreshToken");

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none", // allows cross-origin cookies
    };

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefeshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefeshToken) {
        throw new ApiError(
            401,
            "Unauthorized Access, refresh token is missing"
        );
    }

    try {
        console.log("Incoming refresh token:", incomingRefeshToken);
        console.log("Refresh token secret:", process.env.REFRESH_TOKEN_SECRET);

        const decodedToken = jwt.verify(
            incomingRefeshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Unauthorized Access, user not found");
        }

        if (user?.refreshToken !== incomingRefeshToken) {
            throw new ApiError(401, "Refresh token is expired or mismatched");
        }

        const { refreshToken: newrefreshToken, accessToken } =
            await generateAccessAndRefreshToken(user._id);

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none", // allows cross-origin cookies
        };

        return res
            .status(200)
            .cookie("refreshToken", newrefreshToken, cookieOptions)
            .cookie("accessToken", accessToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, newrefreshToken },
                    "Access token refresh successfully"
                )
            );
    } catch (error) {
        throw new ApiError(401, `Invalid refresh token: ${error.message}`);
    }
});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
        throw new ApiError(401, "Old password is incorrect");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: true });
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// forgot password functionality
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    // Generate a reset token (from Mongoose method)
    const resetToken = user.generatePasswordResetToken();

    // Save user with new token + expiry (hashed in DB)
    await user.save({ validateBeforeSave: false });

    //  Prepare password reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email message content
    const message = `
    You requested a password reset.
    Click the link to reset your password:
    ${resetUrl}
    If you didn’t request this, ignore this email.
  `;

    // Send the email
    await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message,
    });

    // Respond success
    res.status(200).json(new ApiResponse(200, {}, "Reset link sent!"));
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

const getCurrentUser = asyncHandler(async (req, res, next) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current user fetched successfully")
        );
});

const updateAccountDetails = asyncHandler(async (req, res, next) => {
    const { userName, age, gender, preferredLocations } = req.body;

    // Ensure at least one field is provided
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

    // Build dynamic update object
    const updateFields = {};

    if (userName?.trim()) updateFields.userName = userName.trim();
    if (age) updateFields.age = age;
    if (gender) updateFields.gender = gender;

    // preferredLocations can be string or array
    if (preferredLocations) {
        if (typeof preferredLocations === "string") {
            // Single value sent as string
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

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedUser,
                "Account details updated successfully"
            )
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

    // Upload new avatar to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar)
        throw new ApiError(500, "Error uploading avatar to Cloudinary");

    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const oldAvatarUrl = user.avatar;

    // Update user avatar
    user.avatar = avatar.url;
    await user.save();

    // Delete old avatar from Cloudinary if exists
    if (oldAvatarUrl) {
        const result = await deleteFromCloudinary(oldAvatarUrl);
        if (result?.result === "ok") {
            console.log("Old avatar deleted from Cloudinary");
        } else {
            console.warn("Old avatar not found or already deleted.");
        }
    }

    const updatedUser = await User.findById(userId).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

// Delete Account Controller (with Cloudinary cleanup)
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

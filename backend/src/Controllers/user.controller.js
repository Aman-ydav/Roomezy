import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cleanupLocalFiles } from "../utils/fileCleanUp.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {v2 as cloudinary} from "cloudinary";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail  from "../utils/sendEmail.js";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken =  user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500, "Error in generating access and refresh token");
    }
}

const registerUser = asyncHandler(async (req, res, next) => {
    const {
        userName,
        email,
        password,
        age,
        phone,
    } = req.body;
    
    
    // validate required fields
    if ([userName, email, password,age].some(f => !f?.trim())) {
        cleanupLocalFiles(req.files);
        throw new ApiError(400, "Required fields missing: userName, email, password, age");
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
    });

    // Fetch user without sensitive fields
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");
    if (!createdUser) {
        cleanupLocalFiles(req.files);
        throw new ApiError(500, "User registration failed");
    }

    return res.status(201).json(
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

    const {email, password} = req.body 
    console.log(email);

    if(!(email)){
        throw new ApiError(400, "email is required to login");
    }

    const user = await User.findOne({
        $or: [{email}]
    }) 
    
    if(!user){
        throw new ApiError(404, "User not found with this email");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Password is invalid");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    if(!accessToken || !refreshToken){
        throw new ApiError(500, "Error in generating access and refresh token");
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true, 
    }

    return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken}, "User logged in successfully")
    );



});

const logoutUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, 
        {
            $set: { refreshToken: undefined }
        }, 
        {new: true})
        .select("-password -refreshToken"
        );

        const options = {
        httpOnly: true,
        secure: true, 
        }
    
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        );

});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefeshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefeshToken){
        throw new ApiError(401, "Unauthorized Access, refresh token is missing");
    }

    try {
        console.log("Incoming refresh token:", incomingRefeshToken);
        console.log("Refresh token secret:", process.env.REFRESH_TOKEN_SECRET);
        
        const decodedToken = jwt.verify(incomingRefeshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id)

    
        if(!user){
            throw new ApiError(401, "Unauthorized Access, user not found"); 
        }
    
        if(user?.refreshToken !== incomingRefeshToken){
            throw new ApiError(401, "Refresh token is expired or mismatched"); 
        }
    
        const {refreshToken: newrefreshToken,accessToken} = await generateAccessAndRefreshToken(user._id);
    
        const options = {
            httpOnly: true,
            secure: true, 
        }
    
        return res
        .status(200)
        .cookie("refreshToken", newrefreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200, {accessToken, newrefreshToken}, "Access token refresh successfully")
        )

    } catch (error) {
        throw new ApiError(401, `Invalid refresh token: ${error.message}`);
    }
    
});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(404, "User not found");
    }
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordValid){
        throw new ApiError(401, "Old password is incorrect");
    }
    user.password = newPassword;
    await user.save({validateBeforeSave: true});
    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    );

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
    
    return res.status(200).json( new ApiResponse(200, req.user, "Current user fetched successfully"));

});


const updateAccountDetails = asyncHandler(async (req, res, next) => { 

    const { userName, age } = req.body;
   if (!userName || !age) {
        throw new ApiError(400, "Fileds name is required");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { userName: userName?.trim(), age: age?.trim() },
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(
            new ApiResponse(200,updatedUser,"Account details updated successfully")
        );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  // If no file was uploaded
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  // Upload new avatar to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Error uploading avatar to Cloudinary");
  }

  const userId = req.user?._id;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const oldAvatarUrl = user.avatar;

  // Update user with new avatar
  user.avatar = avatar.url;
  await user.save();

  // Delete old avatar if it exists
  if (oldAvatarUrl) {
    const oldPublicId = oldAvatarUrl.split("/").pop().split(".")[0];
    cloudinary.uploader.destroy(oldPublicId, (err, result) => {
      if (err) console.error("Error deleting old avatar:", err);
    });
  }

  // Send response without password
  const updatedUser = await User.findById(userId).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

const getUserProfileById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(new ApiResponse(200, user, "User profile fetched"));
});


const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  await User.findByIdAndDelete(req.user._id);
  res.status(200).json(new ApiResponse(200, {}, "Account deleted successfully"));
});




export {registerUser, 
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
    deleteAccount
}; 
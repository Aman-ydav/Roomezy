import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = asyncHandler(async (req, res) => {
  const { id_token } = req.body;
  if (!id_token) throw new ApiError(400, "Google id_token is required");

  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, email_verified, name, picture, sub: googleId } = payload;

  if (!email || !email_verified) {
    throw new ApiError(400, "Google email not verified");
  }

  const userName =
    name?.toLowerCase().replace(/\s+/g, "") || email.split("@")[0];

  let user = await User.findOne({ email });

  if (user) {
    // Update Google fields always
    user.googleId = googleId;
    user.provider = "google";
    if (!user.avatar) user.avatar = picture;
    await user.save();
  } else {
    const randomPassword = crypto.randomBytes(16).toString("hex");

    user = await User.create({
      userName,
      email,
      avatar: picture,
      googleId,
      provider: "google",
      password: randomPassword,
      age: null,
      gender: "",
      phone: "",
      isVerified: true,
      accountType: null,
      preferredLocations: [],
    });
  }

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const userData = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,        
      sameSite: "none",   
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        { user: userData, accessToken, refreshToken },
        "Google login successful"
      )
    );
});

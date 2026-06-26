import { Router } from "express";
import { registerUser,loginUser,
  logoutUser, refreshAccessToken,
  forgotPassword,
  updateAccountDetails,
  updateUserAvatar,
  getCurrentUser,
  changeCurrentPassword,
  resetPassword,
  getUserProfileById,
  updateAccountType,
  verifyEmailCode,
  sendVerificationCode,
  deleteAccount,
  getVerificationStatus} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT}  from '../middlewares/auth.middleware.js';
import { googleLogin } from "../controllers/googleAuth.controller.js";
import { authLimiter } from "../middlewares/rateLimiter.js";


const router = Router();

// routes declaration

router.route("/register").post(authLimiter, upload.single("avatar"), registerUser);
router.route("/login").post(authLimiter, loginUser);

// secure route
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);


router.route("/update-avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
);

router.post("/google", googleLogin);

router.post("/send-verification-code", authLimiter, sendVerificationCode);
router.post("/verify-email", authLimiter, verifyEmailCode);

router.route("/get-current-user").get(verifyJWT, getCurrentUser);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/update-account-details").patch(verifyJWT, updateAccountDetails);

router.route("/update-account-type").patch(verifyJWT, updateAccountType);

router.route("/forgot-password").post(authLimiter, forgotPassword);

router.route("/reset-password/:token").post(authLimiter, resetPassword);

router.route("/get-user-profile/:id").get(verifyJWT, getUserProfileById);
router.route("/:id/verification-status").get(getVerificationStatus);

router.route("/delete-account").delete(verifyJWT, deleteAccount);

export default router;
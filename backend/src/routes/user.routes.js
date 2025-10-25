import { Router } from "express";
import { registerUser,loginUser, logoutUser, refreshAccessToken,forgotPassword,updateAccountDetails,updateUserAvatar,getCurrentUser,changeCurrentPassword,
  resetPassword,
  getUserProfileById,
  updatePreferences,
  deleteAccount} from "../Controllers/user.controller.js"; 
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT}  from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/register").post(
    upload.single("avatar"),
    registerUser
);

router.route("/login").post(loginUser);

// secure route
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/update-avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
);


router.route("/get-current-user").get(verifyJWT, getCurrentUser);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/update-account-details").patch(verifyJWT, updateAccountDetails);



router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/profile/:id", verifyJWT, getUserProfileById);
router.put("/preferences", verifyJWT, updatePreferences);
router.delete("/delete", verifyJWT, deleteAccount);

export default router;
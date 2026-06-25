import { Router } from "express";
import { 
    googleLogin, 
    registerUser, 
    loginUser, 
    logoutUser, 
    forgotPassword, 
    resetPassword, 
    changeCurrentPassword, 
    getCurrentUser,
    refreshAccessToken,
    updateName,
    updatePhone, 
    addAddress,
    editAddress,
    deleteAddress,
    makeAddressDefault
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

router.route("/google-login").post(googleLogin);

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/forgot-password").patch(forgotPassword);

router.route("/reset-password/:token").patch(resetPassword);

router.route("/change-password").patch(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/update-name").patch(verifyJWT, updateName);

router.route("/update-phone").patch(verifyJWT, updatePhone);

router.route("/add-address").patch(verifyJWT, addAddress);

router.route("/edit-address/:addressId").patch(verifyJWT, editAddress);

router.route("/delete-address/:addressId").delete(verifyJWT, deleteAddress);

router.route("/make-default-address/:addressId").patch(verifyJWT, makeAddressDefault);

export default router;

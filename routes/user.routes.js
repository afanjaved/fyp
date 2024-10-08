import express from "express";
const router = express.Router();
import AuthController from "../controllers/Auth.controller.js";
router.post("/signup", AuthController.Signup);
router.post("/login", AuthController.Login);
router.post("/verify", AuthController.verifyUser);
router.post("/resend", AuthController.resendVerificationCode);
router.post("/forgotpassword", AuthController.forgotPassword);
router.post("/resetpassword", AuthController.resetPassword);
export default router;

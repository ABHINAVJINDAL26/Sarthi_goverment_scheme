import express from "express";
import { sendOtp, verifyOtp } from "../controllers/authController.js";
import { otpSendLimiter, otpVerifyLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/otp/send", otpSendLimiter, sendOtp);
router.post("/otp/verify", otpVerifyLimiter, verifyOtp);

export default router;

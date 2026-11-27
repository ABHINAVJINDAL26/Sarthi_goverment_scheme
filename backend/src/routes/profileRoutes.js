import express from "express";
import {
    getProfile,
    getProgress,
    updateProfile,
    updateProfileProgress,
    getProfileCompleteness,
    saveProfileSection,
    getProfileReview,
    submitProfileHandler
} from "../controllers/profileController.js";
import { authenticateToken, checkOwnership } from "../middleware/authMiddleware.js";

const router = express.Router();

// All profile endpoints require a valid JWT token and user ownership check
router.use("/:userId", authenticateToken, checkOwnership);

// Profile and Progress retrieval
router.get("/:userId", getProfile);
router.get("/:userId/progress", getProgress);
router.get("/:userId/completeness", getProfileCompleteness);

// Card 8: Final Review & Submission
router.get("/:userId/review", getProfileReview);
router.post("/:userId/submit", submitProfileHandler);

// Section-wise Autosave & Updates
router.patch("/:userId/sections/:sectionKey", saveProfileSection);
router.patch("/:userId/progress", updateProfileProgress);
router.patch("/:userId", updateProfile);

export default router;

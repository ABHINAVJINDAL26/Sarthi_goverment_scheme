import pool from "../config/db.js";
import {
    getUserProfileWithProgress,
    saveSectionData,
    getProfileReviewData,
    submitProfile
} from "../services/profileService.js";
import { getUserProgress, calculateProfileCompleteness, APPROVED_SECTIONS } from "../services/progressService.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { validateSectionPayload, SECTION_CONFIG } from "../validators/profileValidator.js";

export const getProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        // validate userId
        if (!/^[1-9]\d*$/.test(userId)) {
            return errorResponse(res, 400, "Invalid userId format. Must be a positive integer.");
        }

        const data = await getUserProfileWithProgress(userId);

        if (!data) {
            return errorResponse(res, 404, "User profile not found");
        }

        return successResponse(res, 200, "Profile retrieved successfully", data);
    } catch (err) {
        console.error("Get profile error:", err.message);
        return errorResponse(res, 500, "Unable to retrieve profile");
    }
};

export const getProgress = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!/^[1-9]\d*$/.test(userId)) {
            return errorResponse(res, 400, "Invalid userId format. Must be a positive integer.");
        }

        const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [userId]);
        if (userCheck.rows.length === 0) {
            return errorResponse(res, 404, "User not found");
        }

        const progress = await getUserProgress(userId);

        return successResponse(res, 200, "Profile progress retrieved successfully", {
            userId: Number(userId),
            progress
        });
    } catch (err) {
        console.error("Get progress error:", err.message);
        return errorResponse(res, 500, "Unable to retrieve profile progress");
    }
};

export const updateProfile= async(req, res)=>{
    try{
        const { userId } = req.params;
        const updates = req.body;

        if (!/^[1-9]\d*$/.test(userId)) {
            return errorResponse(res, 400, "Invalid user ID format. Must be a positive integer.");
        }
        // only these profile fields can be updated 
        const allowedFields = [
            "full_name",
            "date_of_birth",
            "gender",
            "state",
            "district",
            "residence_type",
            "annual_household_income",
            "occupation",
            "education_level",
            "social_category",
            "minority_status",
            "disability_status",
            "bpl_card",
            "marital_status",
            "land_holding_acres",
            "family_size"
        ];

        const fields = Object.keys(updates);

        if (fields.length === 0) {
            return errorResponse(res, 400, "Provide at least one field to update");
        }

        const invalidFields = fields.filter(
            field => !allowedFields.includes(field)
        );
        if (invalidFields.length > 0) {
            return errorResponse(res, 400, "Invalid profile fields provided", invalidFields);
        }

        // Build a parameterized UPDATE query
        const values = [];
        const setClauses = fields.map((field, index) => {
            values.push(updates[field]);
            return `${field} = $${index + 1}`;
        });

        values.push(userId);

        const query = `
            UPDATE user_profiles
            SET ${setClauses.join(", ")},
                updated_at = NOW()
            WHERE user_id = $${values.length}
            RETURNING *
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            const userExists = await pool.query("SELECT id FROM users WHERE id = $1", [userId]);
            if (userExists.rows.length === 0) {
                return errorResponse(res, 404, "User not found");
            }
            return errorResponse(res, 404, "Profile not found");
        }

        return successResponse(res, 200, "Profile updated successfully", {
            profile: result.rows[0]
        });

    } catch (error) {
        if (error.code === "23514" || error.code === "22P02") {
            return errorResponse(res, 400, "Invalid value provided for a profile field");
        }

        console.error("Update profile error:", error.message);
        return errorResponse(res, 500, "Unable to update profile");
    }
};


export const updateProfileProgress = async (req, res) => {
    try {
        const { userId } = req.params;
        const { section_key, status } = req.body;

        const allowedSections = APPROVED_SECTIONS;
        const allowedStatuses = ["not_started", "in_progress", "completed"];

        if (!/^[1-9]\d*$/.test(userId)) {
            return errorResponse(res, 400, "Invalid userId format. Must be a positive integer.");
        }

        // Validate section and status
        if (!allowedSections.includes(section_key) || !allowedStatuses.includes(status)) {
            return errorResponse(res, 400, "Invalid section key or status provided");
        }

        // Check whether the user exists
        const userResult = await pool.query("SELECT id FROM users WHERE id = $1", [userId]);
        if (userResult.rows.length === 0) {
            return errorResponse(res, 404, "User not found");
        }

        // Insert progress or update the existing section
        const result = await pool.query(
            `INSERT INTO profile_progress
                (user_id, section_key, status, last_saved_at, completed_at)
             VALUES (
                $1, $2, $3::varchar, NOW(),
                CASE WHEN $3::varchar = 'completed' THEN NOW() ELSE NULL END
             )
             ON CONFLICT (user_id, section_key)
             DO UPDATE SET
                status = EXCLUDED.status,
                last_saved_at = NOW(),
                completed_at = CASE
                    WHEN EXCLUDED.status = 'completed' THEN NOW()
                    ELSE NULL
                END
             RETURNING section_key, status, last_saved_at, completed_at`,
            [userId, section_key, status]
        );

        return successResponse(res, 200, "Profile progress saved successfully", {
            progress: result.rows[0]
        });
    } catch (error) {
        console.error("Update progress error:", error.message);
        return errorResponse(res, 500, "Unable to save profile progress");
    }
};


export const getProfileCompleteness = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!/^[1-9]\d*$/.test(userId)) {
            return errorResponse(res, 400, "Invalid userId format. Must be a positive integer.");
        }

        const completeness = await calculateProfileCompleteness(userId);

        if (!completeness) {
            return errorResponse(res, 404, "User profile not found");
        }

        return successResponse(res, 200, "Profile completeness calculated successfully", completeness);
    } catch (error) {
        console.error("Profile completeness error:", error.message);
        return errorResponse(res, 500, "Unable to calculate profile completeness");
    }
};



export const saveProfileSection = async (req, res) => {
    try {
        const { userId, sectionKey } = req.params;

        // 1. Validate user ID
        if (!/^[1-9]\d*$/.test(userId)) {
            return errorResponse(res, 400, "Invalid userId format. Must be a positive integer.");
        }

        // 2. Check if section key is supported
        if (!SECTION_CONFIG[sectionKey]) {
            return errorResponse(res, 400, `Unsupported profile section: '${sectionKey}'`);
        }

        // 3. Validate request payload against section schema
        const validation = validateSectionPayload(sectionKey, req.body);
        if (!validation.isValid) {
            return errorResponse(res, 400, "Validation failed", validation.errors);
        }

        // 4. Save section data and transition progress status atomically
        const result = await saveSectionData(userId, sectionKey, req.body);
        if (result.notFound) {
            return errorResponse(res, 404, "User profile not found");
        }

        return successResponse(res, 200, `${SECTION_CONFIG[sectionKey].title} saved successfully`, {
            section: result.section,
            status: result.status,
            last_saved_at: result.progress.last_saved_at,
            completed_at: result.progress.completed_at,
            profile: result.profile
        });
    } catch (error) {
        if (error.code === "23514" || error.code === "22007") {
            return errorResponse(res, 400, "A profile value violates a database constraint");
        }

        console.error("Save profile section error:", error.message);
        return errorResponse(res, 500, "Unable to save profile section");
    }
};

/**
 * Controller to fetch structured profile review data (Card 8)
 * GET /api/profile/:userId/review
 */
export const getProfileReview = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!/^[1-9]\d*$/.test(userId)) {
            return errorResponse(res, 400, "Invalid userId format. Must be a positive integer.");
        }

        const reviewData = await getProfileReviewData(userId);
        if (!reviewData) {
            return errorResponse(res, 404, "User profile not found");
        }

        return successResponse(res, 200, "Profile review retrieved successfully", reviewData);
    } catch (error) {
        console.error("Profile review error:", error.message);
        return errorResponse(res, 500, "Unable to retrieve profile review");
    }
};

/**
 * Controller to submit the complete profile
 * POST /api/profile/:userId/submit
 */
export const submitProfileHandler = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!/^[1-9]\d*$/.test(userId)) {
            return errorResponse(res, 400, "Invalid userId format. Must be a positive integer.");
        }

        const result = await submitProfile(userId);

        if (result.notFound) {
            return errorResponse(res, 404, "User profile not found");
        }

        if (result.alreadySubmitted) {
            return errorResponse(res, 409, "Profile has already been submitted", {
                isSubmitted: true,
                submittedAt: result.submittedAt
            });
        }

        if (result.incomplete) {
            return errorResponse(res, 400, "Cannot submit profile: all 7 sections must be completed first", {
                percentage: result.completeness.percentage,
                completedSections: result.completeness.completedSections,
                pendingSections: result.completeness.pendingSections,
                missingFieldsBySection: result.completeness.missingFieldsBySection
            });
        }

        return successResponse(res, 200, "Profile submitted successfully", {
            isSubmitted: result.isSubmitted,
            submittedAt: result.submittedAt
        });
    } catch (error) {
        console.error("Submit profile error:", error.message);
        return errorResponse(res, 500, "Unable to submit profile");
    }
};

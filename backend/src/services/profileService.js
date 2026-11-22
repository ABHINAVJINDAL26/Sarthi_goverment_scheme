import pool from '../config/db.js';
import { getUserProgress, calculateProfileCompleteness, APPROVED_SECTIONS, SECTION_METADATA } from './progressService.js';
import { SECTION_CONFIG } from '../validators/profileValidator.js';

/**
 * Retrieve user profile and associated progress records
 */
export const getUserProfileWithProgress = async (userId) => {
    // 1. Check user existence and fetch profile data
    const profileResult = await pool.query(
        `SELECT
            u.id AS user_id,
            u.mobile_number,
            u.preferred_language,
            p.full_name,
            p.date_of_birth,
            p.gender,
            p.state,
            p.district,
            p.residence_type,
            p.education_level,
            p.occupation,
            p.annual_household_income,
            p.land_holding_acres,
            p.social_category,
            p.minority_status,
            p.disability_status,
            p.bpl_card,
            p.marital_status,
            p.family_size,
            p.is_submitted,
            p.submitted_at,
            p.created_at,
            p.updated_at
        FROM users u
        LEFT JOIN user_profiles p ON u.id = p.user_id
        WHERE u.id = $1`,
        [userId]
    );

    if (profileResult.rows.length === 0) {
        return null;
    }

    // 2. Fetch progress records
    const progress = await getUserProgress(userId);

    return {
        profile: profileResult.rows[0],
        progress
    };
};

/**
 * Save data for an individual profile section in an atomic transaction
 */
export const saveSectionData = async (userId, sectionKey, updates) => {
    const config = SECTION_CONFIG[sectionKey];
    if (!config) {
        throw new Error(`Unsupported section key: ${sectionKey}`);
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Verify user profile exists and lock row
        const profileLock = await client.query(
            `SELECT * FROM user_profiles WHERE user_id = $1 FOR UPDATE`,
            [userId]
        );

        if (profileLock.rows.length === 0) {
            await client.query('ROLLBACK');
            return { notFound: true };
        }

        const existingProfile = profileLock.rows[0];
        const sectionUpdates = { ...updates };

        // Handle dependent field reset: if state changes and district not passed, clear district
        if (
            sectionKey === 'location' &&
            sectionUpdates.state !== undefined &&
            sectionUpdates.state !== existingProfile.state
        ) {
            if (sectionUpdates.district === undefined) {
                sectionUpdates.district = null;
            }
        }

        // 2. Build parameterized UPDATE
        const updateKeys = Object.keys(sectionUpdates);
        const values = [];
        const setClauses = updateKeys.map((key, index) => {
            const rawVal = sectionUpdates[key];
            const cleanVal = typeof rawVal === 'string' ? rawVal.trim() : rawVal;
            values.push(cleanVal);
            return `${key} = $${index + 1}`;
        });

        values.push(userId);

        await client.query(
            `UPDATE user_profiles
             SET ${setClauses.join(', ')}, updated_at = NOW()
             WHERE user_id = $${values.length}`,
            values
        );

        // 3. Fetch latest values to evaluate section completion status
        const latestProfileResult = await client.query(
            `SELECT ${config.allowedFields.join(', ')}
             FROM user_profiles
             WHERE user_id = $1`,
            [userId]
        );
        const latestProfile = latestProfileResult.rows[0];

        // Section is completed ONLY if all required fields are non-null and non-empty
        const isComplete = config.requiredFields.every(field => {
            const val = latestProfile[field];
            return val !== null && val !== undefined && String(val).trim() !== '';
        });

        const status = isComplete ? 'completed' : 'in_progress';

        // 4. Update section progress in profile_progress
        const progressResult = await client.query(
            `INSERT INTO profile_progress (user_id, section_key, status, last_saved_at, completed_at)
             VALUES (
                 $1, $2, $3::varchar, NOW(),
                 CASE WHEN $3::varchar = 'completed' THEN NOW() ELSE NULL END
             )
             ON CONFLICT (user_id, section_key)
             DO UPDATE SET
                 status = EXCLUDED.status,
                 last_saved_at = NOW(),
                 completed_at = CASE
                     WHEN EXCLUDED.status = 'completed' THEN COALESCE(profile_progress.completed_at, NOW())
                     ELSE NULL
                 END
             RETURNING section_key, status, last_saved_at, completed_at`,
            [userId, sectionKey, status]
        );

        await client.query('COMMIT');

        return {
            notFound: false,
            section: sectionKey,
            status,
            profile: latestProfile,
            progress: progressResult.rows[0]
        };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

/**
 * Retrieve complete profile structured for review screen
 */
export const getProfileReviewData = async (userId) => {
    const profileData = await getUserProfileWithProgress(userId);
    if (!profileData) {
        return null;
    }

    const { profile, progress } = profileData;
    const completeness = await calculateProfileCompleteness(userId);

    const progressMap = {};
    for (const p of progress) {
        progressMap[p.section_key] = {
            status: p.status,
            lastSavedAt: p.last_saved_at,
            completedAt: p.completed_at
        };
    }

    // Structure each of the 7 cards with their fields and values
    const cards = APPROVED_SECTIONS.map(key => {
        const config = SECTION_CONFIG[key];
        const meta = SECTION_METADATA[key];
        const cardProgress = progressMap[key] || { status: 'not_started', lastSavedAt: null, completedAt: null };

        const data = {};
        for (const field of config.allowedFields) {
            data[field] = profile[field] !== undefined ? profile[field] : null;
        }

        return {
            key,
            title: meta ? meta.title : config.title,
            status: cardProgress.status,
            lastSavedAt: cardProgress.lastSavedAt,
            completedAt: cardProgress.completedAt,
            data
        };
    });

    return {
        userId: Number(userId),
        mobileNumber: profile.mobile_number,
        preferredLanguage: profile.preferred_language,
        isSubmitted: profile.is_submitted || false,
        submittedAt: profile.submitted_at || null,
        completeness: {
            totalSections: completeness.totalSections,
            completedCount: completeness.completedCount,
            pendingCount: completeness.pendingCount,
            percentage: completeness.percentage,
            isFullyComplete: completeness.isFullyComplete
        },
        canSubmit: completeness.isFullyComplete && !profile.is_submitted,
        cards
    };
};

/**
 * Perform final profile submission (Card 8)
 * Ensures all required sections are completed before submitting
 */
export const submitProfile = async (userId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Lock user profile row
        const profileResult = await client.query(
            `SELECT user_id, is_submitted, submitted_at FROM user_profiles WHERE user_id = $1 FOR UPDATE`,
            [userId]
        );

        if (profileResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return { notFound: true };
        }

        const profile = profileResult.rows[0];

        // 2. Reject duplicate submission
        if (profile.is_submitted) {
            await client.query('ROLLBACK');
            return {
                alreadySubmitted: true,
                submittedAt: profile.submitted_at
            };
        }

        // 3. Validate that profile is 100% complete
        const completeness = await calculateProfileCompleteness(userId);
        if (!completeness || !completeness.isFullyComplete) {
            await client.query('ROLLBACK');
            return {
                incomplete: true,
                completeness
            };
        }

        // 4. Update submission timestamp and status
        const updateResult = await client.query(
            `UPDATE user_profiles
             SET is_submitted = TRUE,
                 submitted_at = NOW(),
                 updated_at = NOW()
             WHERE user_id = $1
             RETURNING is_submitted, submitted_at`,
            [userId]
        );

        await client.query('COMMIT');

        return {
            success: true,
            isSubmitted: updateResult.rows[0].is_submitted,
            submittedAt: updateResult.rows[0].submitted_at
        };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

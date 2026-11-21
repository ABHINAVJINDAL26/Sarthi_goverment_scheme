import pool from '../config/db.js';
import { SECTION_CONFIG } from '../validators/profileValidator.js';

export const APPROVED_SECTIONS = [
    'basics',
    'location',
    'education',
    'employment',
    'income',
    'social_category',
    'family'
];

export const SECTION_METADATA = {
    basics: { title: 'Personal Information', order: 1 },
    location: { title: 'Location Information', order: 2 },
    education: { title: 'Education Information', order: 3 },
    employment: { title: 'Employment Information', order: 4 },
    income: { title: 'Income Information', order: 5 },
    social_category: { title: 'Social Category Information', order: 6 },
    family: { title: 'Family Information', order: 7 }
};

/**
 * Fetch progress records for all 7 profile cards for a user
 * Automatically self-heals by inserting any missing card records as 'not_started'
 */
export const getUserProgress = async (userId, dbClient = pool) => {
    // 1. Fetch current progress records
    const result = await dbClient.query(
        `SELECT section_key, status, last_saved_at, completed_at
         FROM profile_progress
         WHERE user_id = $1
         ORDER BY id ASC`,
        [userId]
    );

    const existingKeys = new Set(result.rows.map(r => r.section_key));
    const missingKeys = APPROVED_SECTIONS.filter(key => !existingKeys.has(key));

    // Self-heal if any section is missing
    if (missingKeys.length > 0) {
        for (const key of missingKeys) {
            await dbClient.query(
                `INSERT INTO profile_progress (user_id, section_key, status)
                 VALUES ($1, $2, 'not_started')
                 ON CONFLICT (user_id, section_key) DO NOTHING`,
                [userId, key]
            );
        }

        const refreshed = await dbClient.query(
            `SELECT section_key, status, last_saved_at, completed_at
             FROM profile_progress
             WHERE user_id = $1
             ORDER BY id ASC`,
            [userId]
        );
        return refreshed.rows;
    }

    return result.rows;
};

/**
 * Calculate centralized profile completeness based on the 7 approved cards
 * Determines completed cards, pending cards, missing required fields, and total percentage
 */
export const calculateProfileCompleteness = async (userId) => {
    // 1. Fetch user profile data
    const profileResult = await pool.query(
        `SELECT * FROM user_profiles WHERE user_id = $1`,
        [userId]
    );

    if (profileResult.rows.length === 0) {
        return null;
    }

    const profile = profileResult.rows[0];

    // 2. Fetch progress records
    const progressList = await getUserProgress(userId);
    const progressMap = {};
    for (const p of progressList) {
        progressMap[p.section_key] = p.status;
    }

    const completedSections = [];
    const pendingSections = [];
    const missingFieldsBySection = {};

    for (const sectionKey of APPROVED_SECTIONS) {
        const config = SECTION_CONFIG[sectionKey];
        if (!config) continue;

        // Find missing required fields
        const missing = config.requiredFields.filter(field => {
            const val = profile[field];
            return val === null || val === undefined || String(val).trim() === '';
        });

        const status = progressMap[sectionKey] || 'not_started';

        if (missing.length === 0 && status === 'completed') {
            completedSections.push(sectionKey);
        } else {
            pendingSections.push(sectionKey);
            if (missing.length > 0) {
                missingFieldsBySection[sectionKey] = missing;
            }
        }
    }

    const totalSections = APPROVED_SECTIONS.length;
    const completedCount = completedSections.length;
    const pendingCount = pendingSections.length;
    const percentage = Math.round((completedCount / totalSections) * 100);
    const isFullyComplete = completedCount === totalSections;

    return {
        totalSections,
        completedCount,
        pendingCount,
        percentage,
        isFullyComplete,
        isSubmitted: profile.is_submitted || false,
        submittedAt: profile.submitted_at || null,
        completedSections,
        pendingSections,
        missingFieldsBySection
    };
};

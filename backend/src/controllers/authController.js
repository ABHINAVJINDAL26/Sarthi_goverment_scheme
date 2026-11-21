import pool from '../config/db.js';
import { generateAndStoreOtp, verifyOtpCode } from '../services/otpService.js';
import { generateToken } from '../middleware/authMiddleware.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Controller to send or generate an OTP
 * POST /api/auth/otp/send
 */
export const sendOtp = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        // Validate mobile number format: 10 digits starting with 6-9
        if (!mobileNumber || !/^[6-9]\d{9}$/.test(String(mobileNumber).trim())) {
            return errorResponse(res, 400, 'Invalid mobile number format. Must be a 10-digit number starting with 6-9.');
        }

        const normalizedMobile = String(mobileNumber).trim();
        const otpResult = await generateAndStoreOtp(normalizedMobile);

        if (!otpResult.success && otpResult.cooldown) {
            return errorResponse(
                res,
                429,
                `Please wait ${otpResult.remainingSeconds} seconds before requesting a new OTP.`
            );
        }

        const responseData = {
            mobileNumber: normalizedMobile,
            expiresInSeconds: 300
        };

        // For local development and automated testing only:
        if (process.env.NODE_ENV !== 'production') {
            responseData.devOtp = otpResult.otp;
        }

        return successResponse(res, 200, 'OTP sent successfully', responseData);
    } catch (err) {
        console.error('Error sending OTP:', err.message);
        return errorResponse(res, 500, 'Internal server error while sending OTP');
    }
};

/**
 * Controller to verify OTP and authenticate user
 * POST /api/auth/otp/verify
 */
export const verifyOtp = async (req, res) => {
    const client = await pool.connect();
    try {
        const { mobileNumber, otp } = req.body;

        // Input validation
        if (!mobileNumber || !/^[6-9]\d{9}$/.test(String(mobileNumber).trim()) || !otp) {
            return errorResponse(res, 400, 'Valid 10-digit mobile number and OTP are required');
        }

        const normalizedMobile = String(mobileNumber).trim();
        const verification = await verifyOtpCode(normalizedMobile, otp);

        if (!verification.valid) {
            if (verification.reason === 'NOT_FOUND') {
                return errorResponse(res, 400, 'No active OTP found for this mobile number. Please request a new OTP.');
            }
            if (verification.reason === 'EXPIRED') {
                return errorResponse(res, 400, 'OTP has expired. Please request a new OTP.');
            }
            if (verification.reason === 'MAX_ATTEMPTS_EXCEEDED') {
                return errorResponse(res, 400, 'Maximum verification attempts exceeded. Please request a new OTP.');
            }
            return errorResponse(
                res,
                400,
                `Invalid OTP. ${verification.attemptsLeft} attempt(s) remaining.`
            );
        }

        // Start database transaction
        await client.query('BEGIN');

        // 1. Find or create user
        const userResult = await client.query(
            `INSERT INTO users (mobile_number, mobile_verified_at)
             VALUES ($1, NOW())
             ON CONFLICT (mobile_number)
             DO UPDATE SET mobile_verified_at = NOW(),
                           updated_at = NOW()
             RETURNING id, mobile_number, mobile_verified_at, preferred_language`,
            [normalizedMobile]
        );

        const user = userResult.rows[0];

        // 2. Ensure empty profile exists
        await client.query(
            `INSERT INTO user_profiles (user_id)
             VALUES ($1)
             ON CONFLICT (user_id) DO NOTHING`,
            [user.id]
        );

        // 3. Initialize progress for all 7 approved profile cards
        const sections = [
            'basics',
            'location',
            'education',
            'employment',
            'income',
            'social_category',
            'family'
        ];

        for (const section of sections) {
            await client.query(
                `INSERT INTO profile_progress (user_id, section_key, status)
                 VALUES ($1, $2, 'not_started')
                 ON CONFLICT (user_id, section_key) DO NOTHING`,
                [user.id, section]
            );
        }

        // Commit transaction
        await client.query('COMMIT');

        // 4. Generate JWT auth token
        const token = generateToken(user);

        return successResponse(res, 200, 'OTP verified successfully', {
            token,
            user: {
                id: user.id,
                mobileNumber: user.mobile_number,
                mobileVerifiedAt: user.mobile_verified_at,
                preferredLanguage: user.preferred_language
            }
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error verifying OTP:', err.message);
        return errorResponse(res, 500, 'Unable to verify OTP. Please try again later.');
    } finally {
        client.release();
    }
};

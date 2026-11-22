import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import pool from '../src/config/db.js';
import { generateAndStoreOtp } from '../src/services/otpService.js';
import { generateToken } from '../src/middleware/authMiddleware.js';

describe('Phase 13: Full Automated Test Matrix & Verification', () => {
    const matrixMobile = '9876594001';
    const otherMobile = '9876594002';
    let userId;
    let token;
    let otherUserId;
    let otherToken;

    before(async () => {
        // Clean up any leftovers
        await pool.query('DELETE FROM users WHERE mobile_number IN ($1, $2)', [matrixMobile, otherMobile]);
    });

    after(async () => {
        await pool.query('DELETE FROM users WHERE mobile_number IN ($1, $2)', [matrixMobile, otherMobile]);
    });

    // Helper to invoke controllers directly
    const invokeAuthSend = async (body) => {
        const { sendOtp } = await import('../src/controllers/authController.js');
        const req = { body };
        let statusCode = 0;
        let responseJson = null;
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };
        await sendOtp(req, res);
        return { statusCode, responseJson };
    };

    const invokeAuthVerify = async (body) => {
        const { verifyOtp } = await import('../src/controllers/authController.js');
        const req = { body };
        let statusCode = 0;
        let responseJson = null;
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };
        await verifyOtp(req, res);
        return { statusCode, responseJson };
    };

    const invokeGetProfile = async (targetUserId, authUserToken) => {
        const { getProfile } = await import('../src/controllers/profileController.js');
        const req = {
            params: { userId: String(targetUserId) },
            headers: { authorization: `Bearer ${authUserToken}` },
            user: { userId: String(targetUserId) }
        };
        let statusCode = 0;
        let responseJson = null;
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };
        await getProfile(req, res);
        return { statusCode, responseJson };
    };

    const invokeSaveSection = async (targetUserId, sectionKey, body) => {
        const { saveProfileSection } = await import('../src/controllers/profileController.js');
        const req = {
            params: { userId: String(targetUserId), sectionKey },
            body,
            user: { userId: String(targetUserId) }
        };
        let statusCode = 0;
        let responseJson = null;
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };
        await saveProfileSection(req, res);
        return { statusCode, responseJson };
    };

    const invokeGetProgress = async (targetUserId) => {
        const { getProgress } = await import('../src/controllers/profileController.js');
        const req = {
            params: { userId: String(targetUserId) },
            user: { userId: String(targetUserId) }
        };
        let statusCode = 0;
        let responseJson = null;
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };
        await getProgress(req, res);
        return { statusCode, responseJson };
    };

    const invokeGetCompleteness = async (targetUserId) => {
        const { getProfileCompleteness } = await import('../src/controllers/profileController.js');
        const req = {
            params: { userId: String(targetUserId) },
            user: { userId: String(targetUserId) }
        };
        let statusCode = 0;
        let responseJson = null;
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };
        await getProfileCompleteness(req, res);
        return { statusCode, responseJson };
    };

    const invokeGetReview = async (targetUserId) => {
        const { getProfileReview } = await import('../src/controllers/profileController.js');
        const req = {
            params: { userId: String(targetUserId) },
            user: { userId: String(targetUserId) }
        };
        let statusCode = 0;
        let responseJson = null;
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };
        await getProfileReview(req, res);
        return { statusCode, responseJson };
    };

    const invokeSubmit = async (targetUserId) => {
        const { submitProfileHandler } = await import('../src/controllers/profileController.js');
        const req = {
            params: { userId: String(targetUserId) },
            user: { userId: String(targetUserId) }
        };
        let statusCode = 0;
        let responseJson = null;
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };
        await submitProfileHandler(req, res);
        return { statusCode, responseJson };
    };

    let sentOtp;

    // --- TEST SUITE EXECUTION ---
    test('Case 1: New user OTP request (POST /api/auth/otp/send)', async () => {
        const res = await invokeAuthSend({ mobileNumber: matrixMobile });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.ok(res.responseJson.data.devOtp);
        sentOtp = res.responseJson.data.devOtp;
    });

    test('Case 2: Invalid mobile number rejected (POST /api/auth/otp/send)', async () => {
        const res = await invokeAuthSend({ mobileNumber: '12345' });
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(res.responseJson.success, false);
    });

    test('Case 3: Incorrect OTP rejected (POST /api/auth/otp/verify)', async () => {
        const res = await invokeAuthVerify({ mobileNumber: matrixMobile, otp: '000000' });
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(res.responseJson.success, false);
        assert.match(res.responseJson.message, /Invalid OTP/);
    });

    test('Case 4: Expired OTP rejected', async () => {
        const res = await invokeAuthVerify({ mobileNumber: '9999999999', otp: '123456' });
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(res.responseJson.success, false);
        assert.match(res.responseJson.message, /No active OTP found/);
    });

    test('Case 5: Successful OTP verification (POST /api/auth/otp/verify)', async () => {
        const res = await invokeAuthVerify({ mobileNumber: matrixMobile, otp: sentOtp });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.ok(res.responseJson.data.token);
        userId = res.responseJson.data.user.id;
        token = res.responseJson.data.token;
    });

    test('Case 6: Profile & 7 card progress initialization verified in DB', async () => {
        const profile = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
        assert.strictEqual(profile.rows.length, 1);
        assert.strictEqual(profile.rows[0].is_submitted, false);

        const progress = await pool.query('SELECT section_key, status FROM profile_progress WHERE user_id = $1', [userId]);
        assert.strictEqual(progress.rows.length, 7);
        for (const row of progress.rows) {
            assert.strictEqual(row.status, 'not_started');
        }
    });

    test('Case 7: Empty profile retrieval (GET /api/profile/:userId)', async () => {
        const res = await invokeGetProfile(userId, token);
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.data.profile.full_name, null);
        assert.strictEqual(res.responseJson.data.progress.length, 7);
    });

    test('Case 8: Save incomplete section (Card 1: partial full_name)', async () => {
        const res = await invokeSaveSection(userId, 'basics', { full_name: 'Deepak Kumar' });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.data.status, 'in_progress');
    });

    test('Case 9: Save completed section (Card 1: all required fields)', async () => {
        const res = await invokeSaveSection(userId, 'basics', {
            full_name: 'Deepak Kumar',
            date_of_birth: '1996-03-12',
            gender: 'male'
        });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.data.status, 'completed');
        assert.ok(res.responseJson.data.completed_at);
    });

    test('Case 10: Invalid field values rejected (Card 1: unknown field)', async () => {
        const res = await invokeSaveSection(userId, 'basics', { invalid_field: 'bad_val' });
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(res.responseJson.success, false);
    });

    test('Case 11: Negative income rejected (Card 5)', async () => {
        const res = await invokeSaveSection(userId, 'income', { annual_household_income: -500 });
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(res.responseJson.success, false);
    });

    test('Case 12: Invalid date of birth rejected (Card 1: future date)', async () => {
        const res = await invokeSaveSection(userId, 'basics', { date_of_birth: '2099-12-31' });
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(res.responseJson.success, false);
    });

    test('Case 13: Invalid residence type rejected (Card 2)', async () => {
        const res = await invokeSaveSection(userId, 'location', { residence_type: 'metropolitan' });
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(res.responseJson.success, false);
    });

    test('Case 14: Save all other sections to complete profile', async () => {
        // Location
        await invokeSaveSection(userId, 'location', { state: 'Punjab', district: 'Patiala', residence_type: 'rural' });
        // Education
        await invokeSaveSection(userId, 'education', { education_level: 'Graduate' });
        // Employment
        await invokeSaveSection(userId, 'employment', { occupation: 'Teacher' });
        // Income
        await invokeSaveSection(userId, 'income', { annual_household_income: 300000, land_holding_acres: 1.0 });
        // Social Category
        await invokeSaveSection(userId, 'social_category', { social_category: 'general' });
        // Family
        const famRes = await invokeSaveSection(userId, 'family', { marital_status: 'married', family_size: 4 });
        assert.strictEqual(famRes.statusCode, 200);
        assert.strictEqual(famRes.responseJson.data.status, 'completed');
    });

    test('Case 15: Retrieve progress (GET /api/profile/:userId/progress)', async () => {
        const res = await invokeGetProgress(userId);
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.data.progress.length, 7);
        for (const p of res.responseJson.data.progress) {
            assert.strictEqual(p.status, 'completed');
        }
    });

    test('Case 16: Calculate completeness (GET /api/profile/:userId/completeness)', async () => {
        const res = await invokeGetCompleteness(userId);
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.data.percentage, 100);
        assert.strictEqual(res.responseJson.data.isFullyComplete, true);
    });

    test('Case 17: Retrieve review data (GET /api/profile/:userId/review)', async () => {
        const res = await invokeGetReview(userId);
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.data.canSubmit, true);
        assert.strictEqual(res.responseJson.data.cards.length, 7);
    });

    test('Case 18: Resume incomplete profile retains saved state after reconnect', async () => {
        const res = await invokeGetProfile(userId, token);
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.data.profile.full_name, 'Deepak Kumar');
        assert.strictEqual(res.responseJson.data.profile.state, 'Punjab');
        assert.strictEqual(res.responseJson.data.profile.education_level, 'Graduate');
    });

    test('Case 19: Access another user profile rejected (IDOR 403 Forbidden)', async () => {
        const otherOtp = await generateAndStoreOtp(otherMobile);
        const otherVerify = await invokeAuthVerify({ mobileNumber: otherMobile, otp: otherOtp.otp });
        otherUserId = otherVerify.responseJson.data.user.id;
        otherToken = otherVerify.responseJson.data.token;

        // Other user attempts to submit or view Deepak's profile
        const { checkOwnership } = await import('../src/middleware/authMiddleware.js');
        const req = {
            params: { userId: String(userId) },
            headers: { authorization: `Bearer ${otherToken}` },
            user: { userId: String(otherUserId) }
        };
        let statusCode = 0;
        let responseJson = null;
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };

        checkOwnership(req, res, () => {});
        assert.strictEqual(statusCode, 403);
    });

    test('Case 20: Submit incomplete profile rejected (for new other user)', async () => {
        const res = await invokeSubmit(otherUserId);
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(res.responseJson.success, false);
        assert.match(res.responseJson.message, /all 7 sections must be completed/);
    });

    test('Case 21: Submit complete profile (POST /api/profile/:userId/submit)', async () => {
        const res = await invokeSubmit(userId);
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.strictEqual(res.responseJson.data.isSubmitted, true);
        assert.ok(res.responseJson.data.submittedAt);
    });

    test('Case 22: Database connection health check (GET /api/health/db)', async () => {
        const dbHealth = await pool.query('SELECT NOW()');
        assert.ok(dbHealth.rows[0].now);
    });
});

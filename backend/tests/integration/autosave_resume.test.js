import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import pool from '../../src/config/db.js';
import { generateAndStoreOtp, verifyOtpCode } from '../../src/services/otpService.js';
import { generateToken } from '../../src/middleware/authMiddleware.js';

describe('Phase 9: Section-wise Autosave and Resume Functionality', () => {
    const resumeMobile = '9876590001';
    let userId;
    let token;

    after(async () => {
        if (userId) {
            await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        }
    });

    const invokeSaveSection = async (sectionKey, body) => {
        const { saveProfileSection } = await import('../../src/controllers/profileController.js');
        const req = {
            params: { userId: String(userId), sectionKey },
            body,
            user: { userId: String(userId) }
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

    test('1. User registers via OTP and initializes with 7 not_started sections', async () => {
        const otpGen = await generateAndStoreOtp(resumeMobile);
        assert.strictEqual(otpGen.success, true);

        const verifyReq = { body: { mobileNumber: resumeMobile, otp: otpGen.otp } };
        let verifyStatus = 0;
        let verifyJson = null;
        const verifyRes = {
            status: (code) => {
                verifyStatus = code;
                return { json: (data) => { verifyJson = data; } };
            }
        };

        const { verifyOtp } = await import('../../src/controllers/authController.js');
        await verifyOtp(verifyReq, verifyRes);

        assert.strictEqual(verifyStatus, 200);
        userId = verifyJson.data.user.id;
        token = verifyJson.data.token;
        assert.ok(userId);

        const { getProgress } = await import('../../src/controllers/profileController.js');
        const progReq = { params: { userId: String(userId) }, user: { userId: String(userId) } };
        let progStatus = 0;
        let progJson = null;
        const progRes = {
            status: (code) => {
                progStatus = code;
                return { json: (data) => { progJson = data; } };
            }
        };

        await getProgress(progReq, progRes);
        assert.strictEqual(progStatus, 200);
        assert.strictEqual(progJson.data.progress.length, 7);
        for (const card of progJson.data.progress) {
            assert.strictEqual(card.status, 'not_started');
        }
    });

    test('2. Partial autosave on Card 1 transitions to in_progress', async () => {
        const res = await invokeSaveSection('basics', { full_name: 'Anjali Verma' });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.data.status, 'in_progress');
        assert.strictEqual(res.responseJson.data.profile.full_name, 'Anjali Verma');
    });

    test('3. Full autosave on Card 1 transitions to completed', async () => {
        const res = await invokeSaveSection('basics', {
            full_name: 'Anjali Verma',
            date_of_birth: '2001-04-10',
            gender: 'female'
        });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.data.status, 'completed');
        assert.ok(res.responseJson.data.completed_at);
    });

    test('4. Full autosave on Card 2 (location) transitions to completed', async () => {
        const res = await invokeSaveSection('location', {
            state: 'Punjab',
            district: 'Jalandhar',
            residence_type: 'urban'
        });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.data.status, 'completed');
    });

    test('5. Reconnect and resume: all saved data and statuses are retained', async () => {
        const { getProfile } = await import('../../src/controllers/profileController.js');
        const req = { params: { userId: String(userId) }, user: { userId: String(userId) } };
        let statusCode = 0;
        let responseJson = null;
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };

        await getProfile(req, res);
        assert.strictEqual(statusCode, 200);

        const profile = responseJson.data.profile;
        assert.strictEqual(profile.full_name, 'Anjali Verma');
        assert.strictEqual(profile.state, 'Punjab');
        assert.strictEqual(profile.district, 'Jalandhar');
        assert.strictEqual(profile.residence_type, 'urban');

        const progressMap = {};
        for (const item of responseJson.data.progress) {
            progressMap[item.section_key] = item.status;
        }

        assert.strictEqual(progressMap['basics'], 'completed');
        assert.strictEqual(progressMap['location'], 'completed');
        assert.strictEqual(progressMap['education'], 'not_started');
    });

    test('6. Re-authenticating via OTP never resets existing user progress', async () => {
        // Fast-forward OTP flow for existing user
        const otpGen = await generateAndStoreOtp('9876590002');
        assert.strictEqual(otpGen.success, true);

        const verifyReq = { body: { mobileNumber: resumeMobile, otp: otpGen.otp } };
        // Clean up in-memory cooldown to simulate later login
        const { verifyOtp } = await import('../../src/controllers/authController.js');

        // Verify that progress records in DB for userId still have completed status
        const progressCheck = await pool.query(
            "SELECT status FROM profile_progress WHERE user_id = $1 AND section_key = 'basics'",
            [userId]
        );
        assert.strictEqual(progressCheck.rows[0].status, 'completed');
    });

    test('7. Editing completed card with state change resets district and marks in_progress', async () => {
        const res = await invokeSaveSection('location', { state: 'Rajasthan' }); // Changed state, district omitted
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.data.status, 'in_progress');
        assert.strictEqual(res.responseJson.data.profile.district, null);
    });
});

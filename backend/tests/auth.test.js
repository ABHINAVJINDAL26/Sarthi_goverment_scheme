import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import pool from '../src/config/db.js';
import { generateAndStoreOtp, verifyOtpCode } from '../src/services/otpService.js';
import { generateToken } from '../src/middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';

describe('Phase 3: Authentication and User Identity', () => {
    const testMobile = '9876500001';

    after(async () => {
        // Clean up test records
        await pool.query('DELETE FROM users WHERE mobile_number = $1', [testMobile]);
        await pool.end();
    });

    test('1. Reject invalid mobile numbers format', async () => {
        const invalidNumbers = ['12345', 'abcdefghij', '5987654321', '98765432101'];
        for (const num of invalidNumbers) {
            const isValid = /^[6-9]\d{9}$/.test(num);
            assert.strictEqual(isValid, false, `Expected ${num} to be invalid`);
        }
    });

    test('2. Generate and store OTP securely with cooldown', async () => {
        const result = await generateAndStoreOtp(testMobile);
        assert.strictEqual(result.success, true);
        assert.match(result.otp, /^\d{6}$/);

        // Immediate retry should trigger cooldown
        const retryResult = await generateAndStoreOtp(testMobile);
        assert.strictEqual(retryResult.success, false);
        assert.strictEqual(retryResult.cooldown, true);
        assert.ok(retryResult.remainingSeconds > 0);
    });

    test('3. Reject incorrect OTP and track remaining attempts', async () => {
        const wrongOtpResult = await verifyOtpCode(testMobile, '000000');
        assert.strictEqual(wrongOtpResult.valid, false);
        assert.strictEqual(wrongOtpResult.reason, 'INVALID');
        assert.strictEqual(wrongOtpResult.attemptsLeft, 2);
    });

    test('4. Lock and reject when max attempts exceeded', async () => {
        await verifyOtpCode(testMobile, '000001'); // 2nd wrong
        const lockedResult = await verifyOtpCode(testMobile, '000002'); // 3rd wrong
        assert.strictEqual(lockedResult.valid, false);
        assert.strictEqual(lockedResult.reason, 'MAX_ATTEMPTS_EXCEEDED');
    });

    test('5. Verify correct OTP and verify JWT creation', async () => {
        const testMobile2 = '9876500002';
        const otpResult = await generateAndStoreOtp(testMobile2);
        assert.strictEqual(otpResult.success, true);

        const verifyResult = await verifyOtpCode(testMobile2, otpResult.otp);
        assert.strictEqual(verifyResult.valid, true);

        // Test token generation and decode
        const mockUser = { id: '99', mobile_number: testMobile2 };
        const token = generateToken(mockUser);
        assert.ok(token);

        const secret = process.env.JWT_SECRET || 'sarthi_secure_jwt_secret_key_2026_dev';
        const decoded = jwt.verify(token, secret);
        assert.strictEqual(decoded.userId, '99');
        assert.strictEqual(decoded.mobileNumber, testMobile2);
    });

    test('6. Full controller integration: send, verify, create user and 7 sections', async () => {
        const testMobile3 = '9876500003';

        // 1. Send OTP via controller simulation
        const sendReq = { body: { mobileNumber: testMobile3 } };
        let sendStatus = 0;
        let sendJson = null;
        const sendRes = {
            status: (code) => {
                sendStatus = code;
                return {
                    json: (data) => { sendJson = data; }
                };
            }
        };

        const { sendOtp, verifyOtp } = await import('../src/controllers/authController.js');
        await sendOtp(sendReq, sendRes);

        assert.strictEqual(sendStatus, 200);
        assert.strictEqual(sendJson.success, true);
        const receivedOtp = sendJson.data.devOtp;
        assert.ok(receivedOtp);

        // 2. Verify OTP via controller
        const verifyReq = { body: { mobileNumber: testMobile3, otp: receivedOtp } };
        let verifyStatus = 0;
        let verifyJson = null;
        const verifyRes = {
            status: (code) => {
                verifyStatus = code;
                return {
                    json: (data) => { verifyJson = data; }
                };
            }
        };

        await verifyOtp(verifyReq, verifyRes);

        assert.strictEqual(verifyStatus, 200);
        assert.strictEqual(verifyJson.success, true);
        assert.ok(verifyJson.data.token);
        const userId = verifyJson.data.user.id;
        assert.ok(userId);

        // 3. Verify PostgreSQL database records
        const profileCheck = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
        assert.strictEqual(profileCheck.rows.length, 1);

        const progressCheck = await pool.query('SELECT section_key, status FROM profile_progress WHERE user_id = $1 ORDER BY section_key', [userId]);
        assert.strictEqual(progressCheck.rows.length, 7);

        const expectedSections = [
            'basics',
            'education',
            'employment',
            'family',
            'income',
            'location',
            'social_category'
        ];
        const actualSections = progressCheck.rows.map(r => r.section_key).sort();
        assert.deepStrictEqual(actualSections, expectedSections);

        // Clean up testMobile3
        await pool.query('DELETE FROM users WHERE mobile_number = $1', [testMobile3]);
    });
});

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import pool from '../src/config/db.js';
import { generateToken } from '../src/middleware/authMiddleware.js';
import app from '../src/app.js';

describe('Phase 4: Profile Initialization and Retrieval', () => {
    let testUser1;
    let testUser2;
    let tokenUser1;
    let tokenUser2;

    before(async () => {
        // Setup two test users in PostgreSQL
        const u1 = await pool.query(
            `INSERT INTO users (mobile_number, mobile_verified_at)
             VALUES ('9876540001', NOW())
             ON CONFLICT (mobile_number) DO UPDATE SET mobile_verified_at = NOW()
             RETURNING id, mobile_number`
        );
        testUser1 = u1.rows[0];
        tokenUser1 = generateToken(testUser1);

        const u2 = await pool.query(
            `INSERT INTO users (mobile_number, mobile_verified_at)
             VALUES ('9876540002', NOW())
             ON CONFLICT (mobile_number) DO UPDATE SET mobile_verified_at = NOW()
             RETURNING id, mobile_number`
        );
        testUser2 = u2.rows[0];
        tokenUser2 = generateToken(testUser2);

        // Ensure user profiles and progress for testUser1
        await pool.query(
            `INSERT INTO user_profiles (user_id, full_name, state)
             VALUES ($1, 'Test User One', 'Punjab')
             ON CONFLICT (user_id) DO UPDATE SET full_name = 'Test User One', state = 'Punjab'`,
            [testUser1.id]
        );

        const sections = ['basics', 'location', 'education', 'employment', 'income', 'social_category', 'family'];
        for (const s of sections) {
            await pool.query(
                `INSERT INTO profile_progress (user_id, section_key, status)
                 VALUES ($1, $2, 'not_started')
                 ON CONFLICT (user_id, section_key) DO NOTHING`,
                [testUser1.id, s]
            );
        }
    });

    after(async () => {
        if (testUser1) {
            await pool.query('DELETE FROM users WHERE id = $1', [testUser1.id]);
        }
        if (testUser2) {
            await pool.query('DELETE FROM users WHERE id = $1', [testUser2.id]);
        }
        await pool.end();
    });

    test('1. Reject profile retrieval without auth token (401)', async () => {
        const { getProfile } = await import('../src/controllers/profileController.js');
        const req = {
            params: { userId: String(testUser1.id) },
            headers: {}
        };
        let statusCode = 0;
        let responseJson = null;
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };

        const { authenticateToken } = await import('../src/middleware/authMiddleware.js');
        authenticateToken(req, res, () => {});

        assert.strictEqual(statusCode, 401);
        assert.strictEqual(responseJson.success, false);
    });

    test('2. Reject user accessing another user profile (403 Forbidden)', async () => {
        const req = {
            params: { userId: String(testUser1.id) },
            headers: { authorization: `Bearer ${tokenUser2}` }, // User 2's token attempting User 1's profile
            user: { userId: String(testUser2.id), mobileNumber: testUser2.mobile_number }
        };
        let statusCode = 0;
        let responseJson = null;
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };

        const { checkOwnership } = await import('../src/middleware/authMiddleware.js');
        checkOwnership(req, res, () => {});

        assert.strictEqual(statusCode, 403);
        assert.strictEqual(responseJson.success, false);
        assert.match(responseJson.message, /Forbidden/i);
    });

    test('3. Retrieve full profile and saved progress (200 OK)', async () => {
        const { getProfile } = await import('../src/controllers/profileController.js');
        const req = {
            params: { userId: String(testUser1.id) },
            user: { userId: String(testUser1.id) }
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

        assert.strictEqual(statusCode, 200);
        assert.strictEqual(responseJson.success, true);
        assert.ok(responseJson.data.profile);
        assert.strictEqual(responseJson.data.profile.full_name, 'Test User One');
        assert.ok(Array.isArray(responseJson.data.progress));
        assert.strictEqual(responseJson.data.progress.length, 7);
    });

    test('4. Retrieve dedicated progress status for all 7 cards (200 OK)', async () => {
        const { getProgress } = await import('../src/controllers/profileController.js');
        const req = {
            params: { userId: String(testUser1.id) },
            user: { userId: String(testUser1.id) }
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

        assert.strictEqual(statusCode, 200);
        assert.strictEqual(responseJson.success, true);
        assert.strictEqual(responseJson.data.userId, Number(testUser1.id));
        assert.strictEqual(responseJson.data.progress.length, 7);

        const cardKeys = responseJson.data.progress.map(p => p.section_key).sort();
        const expectedKeys = ['basics', 'education', 'employment', 'family', 'income', 'location', 'social_category'];
        assert.deepStrictEqual(cardKeys, expectedKeys);
    });
});

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';
import pool from '../../src/config/db.js';
import { generateToken, authenticateToken, checkOwnership } from '../../src/middleware/authMiddleware.js';

describe('Phase 12: Authentication Security and Authorization Checks', () => {
    let victimUser;
    let attackerUser;
    let victimToken;
    let attackerToken;

    before(async () => {
        const u1 = await pool.query(
            `INSERT INTO users (mobile_number, mobile_verified_at)
             VALUES ('9876593001', NOW())
             ON CONFLICT (mobile_number) DO UPDATE SET mobile_verified_at = NOW()
             RETURNING id, mobile_number`
        );
        victimUser = u1.rows[0];
        victimToken = generateToken(victimUser);

        const u2 = await pool.query(
            `INSERT INTO users (mobile_number, mobile_verified_at)
             VALUES ('9876593002', NOW())
             ON CONFLICT (mobile_number) DO UPDATE SET mobile_verified_at = NOW()
             RETURNING id, mobile_number`
        );
        attackerUser = u2.rows[0];
        attackerToken = generateToken(attackerUser);

        await pool.query(
            `INSERT INTO user_profiles (user_id, full_name)
             VALUES ($1, 'Victim User')
             ON CONFLICT (user_id) DO NOTHING`,
            [victimUser.id]
        );
    });

    after(async () => {
        if (victimUser) {
            await pool.query('DELETE FROM users WHERE id = $1', [victimUser.id]);
        }
        if (attackerUser) {
            await pool.query('DELETE FROM users WHERE id = $1', [attackerUser.id]);
        }
    });

    // --- IDOR TESTS ---
    test('1. IDOR: Attacker cannot read victim profile (403 Forbidden)', async () => {
        const req = {
            params: { userId: String(victimUser.id) },
            headers: { authorization: `Bearer ${attackerToken}` },
            user: { userId: String(attackerUser.id) }
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
        assert.strictEqual(responseJson.success, false);
        assert.match(responseJson.message, /Forbidden/i);
    });

    test('2. IDOR: Attacker cannot update or autosave victim profile card (403 Forbidden)', async () => {
        const req = {
            params: { userId: String(victimUser.id), sectionKey: 'basics' },
            headers: { authorization: `Bearer ${attackerToken}` },
            user: { userId: String(attackerUser.id) }
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
        assert.strictEqual(responseJson.success, false);
    });

    test('3. IDOR: Attacker cannot submit victim profile (403 Forbidden)', async () => {
        const req = {
            params: { userId: String(victimUser.id) },
            headers: { authorization: `Bearer ${attackerToken}` },
            user: { userId: String(attackerUser.id) }
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
        assert.strictEqual(responseJson.success, false);
    });

    // --- TOKEN VALIDATION & TAMPERING TESTS ---
    test('4. Token Security: Missing token rejected (401 Unauthorized)', async () => {
        const req = { headers: {} };
        let statusCode = 0;
        let responseJson = null;
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };

        authenticateToken(req, res, () => {});

        assert.strictEqual(statusCode, 401);
        assert.strictEqual(responseJson.success, false);
        assert.match(responseJson.message, /Authentication required/i);
    });

    test('5. Token Security: Tampered / invalid signature token rejected (401)', async () => {
        const fakeToken = jwt.sign({ userId: String(victimUser.id) }, 'wrong_secret_key');
        const req = { headers: { authorization: `Bearer ${fakeToken}` } };
        let statusCode = 0;
        let responseJson = null;
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };

        authenticateToken(req, res, () => {});

        assert.strictEqual(statusCode, 401);
        assert.strictEqual(responseJson.success, false);
        assert.match(responseJson.message, /Invalid or expired/i);
    });

    test('6. Token Security: Expired token rejected (401)', async () => {
        const secret = process.env.JWT_SECRET || 'sarthi_secure_jwt_secret_key_2026_dev';
        const expiredToken = jwt.sign(
            { userId: String(victimUser.id) },
            secret,
            { expiresIn: '0s' }
        );
        const req = { headers: { authorization: `Bearer ${expiredToken}` } };
        let statusCode = 0;
        let responseJson = null;
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };

        authenticateToken(req, res, () => {});

        assert.strictEqual(statusCode, 401);
        assert.strictEqual(responseJson.success, false);
    });

    // --- SQL INJECTION IMMUNITY TEST ---
    test('7. Injection Immunity: SQL injection payload safely stored as literal text', async () => {
        const { saveProfileSection } = await import('../../src/controllers/profileController.js');
        const injectionPayload = "Robert'; DROP TABLE user_profiles; --";

        const req = {
            params: { userId: String(victimUser.id), sectionKey: 'basics' },
            body: { full_name: injectionPayload },
            user: { userId: String(victimUser.id) }
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

        assert.strictEqual(statusCode, 200);
        // Table still exists and user_profiles is unharmed
        const checkTable = await pool.query(
            "SELECT full_name FROM user_profiles WHERE user_id = $1",
            [victimUser.id]
        );
        assert.strictEqual(checkTable.rows[0].full_name, injectionPayload);
    });
});

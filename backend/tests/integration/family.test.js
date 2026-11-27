import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import pool from '../../src/config/db.js';
import { generateToken } from '../../src/middleware/authMiddleware.js';

describe('Phase 8: Family Card', () => {
    let testUser;
    let token;

    before(async () => {
        const u = await pool.query(
            `INSERT INTO users (mobile_number, mobile_verified_at)
             VALUES ('9876580001', NOW())
             ON CONFLICT (mobile_number) DO UPDATE SET mobile_verified_at = NOW()
             RETURNING id, mobile_number`
        );
        testUser = u.rows[0];
        token = generateToken(testUser);

        await pool.query(
            `INSERT INTO user_profiles (user_id)
             VALUES ($1)
             ON CONFLICT (user_id) DO NOTHING`,
            [testUser.id]
        );

        const sections = ['basics', 'location', 'education', 'employment', 'income', 'social_category', 'family'];
        for (const s of sections) {
            await pool.query(
                `INSERT INTO profile_progress (user_id, section_key, status)
                 VALUES ($1, $2, 'not_started')
                 ON CONFLICT (user_id, section_key) DO NOTHING`,
                [testUser.id, s]
            );
        }
    });

    after(async () => {
        if (testUser) {
            await pool.query('DELETE FROM users WHERE id = $1', [testUser.id]);
        }
    });

    const invokeSaveSection = async (sectionKey, body) => {
        const { saveProfileSection } = await import('../../src/controllers/profileController.js');
        const req = {
            params: { userId: String(testUser.id), sectionKey },
            body,
            user: { userId: String(testUser.id) }
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

    test('1. Card 7: Reject invalid marital_status', async () => {
        const res = await invokeSaveSection('family', { marital_status: 'complicated' });
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(res.responseJson.success, false);
        assert.match(res.responseJson.errors[0].message, /Marital status must be one of/i);
    });

    test('2. Card 7: Reject family size less than 1 or non-integer', async () => {
        const zeroRes = await invokeSaveSection('family', { family_size: 0 });
        assert.strictEqual(zeroRes.statusCode, 400);
        assert.strictEqual(zeroRes.responseJson.success, false);
        assert.match(zeroRes.responseJson.errors[0].message, /at least 1/i);

        const decRes = await invokeSaveSection('family', { family_size: 2.5 });
        assert.strictEqual(decRes.statusCode, 400);
        assert.strictEqual(decRes.responseJson.success, false);
        assert.match(decRes.responseJson.errors[0].message, /must be an integer/i);
    });

    test('3. Card 7: Partial save marks section in_progress', async () => {
        const res = await invokeSaveSection('family', { marital_status: 'single' });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.strictEqual(res.responseJson.data.status, 'in_progress');
        assert.strictEqual(res.responseJson.data.profile.marital_status, 'unmarried'); // 'single' is an alias of 'unmarried'
    });

    test('4. Card 7: Complete save marks family completed', async () => {
        const res = await invokeSaveSection('family', {
            marital_status: 'married',
            family_size: 4
        });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.strictEqual(res.responseJson.data.status, 'completed');
        assert.ok(res.responseJson.data.completed_at);
        assert.strictEqual(res.responseJson.data.profile.family_size, 4);
    });

    test('5. Card 7: Reuses existing database columns without creating duplicate tables', async () => {
        const res = await invokeSaveSection('family', {
            marital_status: 'married',
            family_size: 5,
            bpl_card: true,
            land_holding_acres: 2.0
        });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.strictEqual(res.responseJson.data.status, 'completed');

        // Check user_profiles directly
        const dbCheck = await pool.query(
            'SELECT marital_status, family_size, bpl_card, land_holding_acres FROM user_profiles WHERE user_id = $1',
            [testUser.id]
        );
        assert.strictEqual(dbCheck.rows[0].marital_status, 'married');
        assert.strictEqual(dbCheck.rows[0].family_size, 5);
        assert.strictEqual(dbCheck.rows[0].bpl_card, true);
        assert.strictEqual(Number(dbCheck.rows[0].land_holding_acres), 2.0);
    });
});

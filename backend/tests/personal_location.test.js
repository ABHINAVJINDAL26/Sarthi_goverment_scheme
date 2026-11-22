import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import pool from '../src/config/db.js';
import { generateToken } from '../src/middleware/authMiddleware.js';

describe('Phase 5: Personal (basics) and Location Cards', () => {
    let testUser;
    let token;

    before(async () => {
        const u = await pool.query(
            `INSERT INTO users (mobile_number, mobile_verified_at)
             VALUES ('9876550001', NOW())
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
        const { saveProfileSection } = await import('../src/controllers/profileController.js');
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

    // --- CARD 1: BASICS TESTS ---
    test('1. Card 1: Reject invalid date of birth format or future date', async () => {
        const invalid1 = await invokeSaveSection('basics', { date_of_birth: '2099-01-01' });
        assert.strictEqual(invalid1.statusCode, 400);
        assert.strictEqual(invalid1.responseJson.success, false);

        const invalid2 = await invokeSaveSection('basics', { date_of_birth: '2020-02-31' }); // Non-existent date
        assert.strictEqual(invalid2.statusCode, 400);
        assert.strictEqual(invalid2.responseJson.success, false);
    });

    test('2. Card 1: Reject invalid gender value', async () => {
        const res = await invokeSaveSection('basics', { gender: 'alien' });
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(res.responseJson.success, false);
        assert.match(res.responseJson.errors[0].message, /Gender must be one of/);
    });

    test('3. Card 1: Partial save marks section in_progress', async () => {
        const res = await invokeSaveSection('basics', { full_name: 'Priya Sharma' });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.strictEqual(res.responseJson.data.status, 'in_progress');
        assert.strictEqual(res.responseJson.data.profile.full_name, 'Priya Sharma');
    });

    test('4. Card 1: Complete valid save marks section completed', async () => {
        const res = await invokeSaveSection('basics', {
            full_name: 'Priya Sharma',
            date_of_birth: '1998-08-15',
            gender: 'female'
        });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.strictEqual(res.responseJson.data.status, 'completed');
        assert.ok(res.responseJson.data.completed_at);
        assert.strictEqual(res.responseJson.data.profile.gender, 'female');
    });

    // --- CARD 2: LOCATION TESTS ---
    test('5. Card 2: Reject invalid residence_type', async () => {
        const res = await invokeSaveSection('location', { residence_type: 'metro' });
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(res.responseJson.success, false);
        assert.match(res.responseJson.errors[0].message, /Residence type must be one of: rural, urban/);
    });

    test('6. Card 2: Partial save marks section in_progress', async () => {
        const res = await invokeSaveSection('location', { state: 'Punjab' });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.strictEqual(res.responseJson.data.status, 'in_progress');
    });

    test('7. Card 2: Complete save marks location completed', async () => {
        const res = await invokeSaveSection('location', {
            state: 'Punjab',
            district: 'Amritsar',
            residence_type: 'rural'
        });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.strictEqual(res.responseJson.data.status, 'completed');
        assert.ok(res.responseJson.data.completed_at);
    });

    test('8. Card 2: Changing state resets district and transitions to in_progress', async () => {
        const res = await invokeSaveSection('location', {
            state: 'Haryana' // State changed, no district passed
        });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.strictEqual(res.responseJson.data.status, 'in_progress');
        assert.strictEqual(res.responseJson.data.profile.state, 'Haryana');
        assert.strictEqual(res.responseJson.data.profile.district, null);
    });
});

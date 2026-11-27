import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import pool from '../../src/config/db.js';
import { generateToken } from '../../src/middleware/authMiddleware.js';

describe('Phase 7: Income and Social Category Cards', () => {
    let testUser;
    let token;

    before(async () => {
        const u = await pool.query(
            `INSERT INTO users (mobile_number, mobile_verified_at)
             VALUES ('9876570001', NOW())
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

    // --- CARD 5: INCOME TESTS ---
    test('1. Card 5: Reject negative income and negative land holding', async () => {
        const negIncome = await invokeSaveSection('income', { annual_household_income: -1000 });
        assert.strictEqual(negIncome.statusCode, 400);
        assert.strictEqual(negIncome.responseJson.success, false);
        assert.match(negIncome.responseJson.errors[0].message, /non-negative number/i);

        const negLand = await invokeSaveSection('income', { land_holding_acres: -0.5 });
        assert.strictEqual(negLand.statusCode, 400);
        assert.strictEqual(negLand.responseJson.success, false);
        assert.match(negLand.responseJson.errors[0].message, /non-negative number/i);
    });

    test('2. Card 5: Accept zero for income and save completed status', async () => {
        const res = await invokeSaveSection('income', {
            annual_household_income: 0,
            land_holding_acres: 0
        });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.strictEqual(res.responseJson.data.status, 'completed');
        assert.ok(res.responseJson.data.completed_at);
        assert.strictEqual(Number(res.responseJson.data.profile.annual_household_income), 0);
    });

    test('3. Card 5: Save standard non-zero income and land holding', async () => {
        const res = await invokeSaveSection('income', {
            annual_household_income: 75000.50,
            land_holding_acres: 2.50
        });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.strictEqual(res.responseJson.data.status, 'completed');
        assert.strictEqual(Number(res.responseJson.data.profile.annual_household_income), 75000.50);
        assert.strictEqual(Number(res.responseJson.data.profile.land_holding_acres), 2.50);
    });

    // --- CARD 6: SOCIAL CATEGORY TESTS ---
    test('4. Card 6: Reject invalid category and non-boolean flags', async () => {
        const catRes = await invokeSaveSection('social_category', { social_category: 'martian' });
        assert.strictEqual(catRes.statusCode, 400);
        assert.strictEqual(catRes.responseJson.success, false);
        assert.match(catRes.responseJson.errors[0].message, /Social category must be one of/i);

        const boolRes = await invokeSaveSection('social_category', {
            social_category: 'general',
            bpl_card: 'yes' // string instead of boolean
        });
        assert.strictEqual(boolRes.statusCode, 400);
        assert.strictEqual(boolRes.responseJson.success, false);
        assert.match(boolRes.responseJson.errors[0].message, /must be a boolean/i);
    });

    test('5. Card 6: Valid save preserves null unanswered flags (never coerced to false)', async () => {
        const res = await invokeSaveSection('social_category', {
            social_category: 'obc'
            // minority_status, disability_status, bpl_card are omitted/unanswered
        });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.strictEqual(res.responseJson.data.status, 'completed');
        assert.strictEqual(res.responseJson.data.profile.social_category, 'OBC'); // stored in canonical form

        // Verify in database that omitted flags are null, NOT false
        const dbCheck = await pool.query(
            'SELECT minority_status, disability_status, bpl_card FROM user_profiles WHERE user_id = $1',
            [testUser.id]
        );
        assert.strictEqual(dbCheck.rows[0].minority_status, null);
        assert.strictEqual(dbCheck.rows[0].disability_status, null);
        assert.strictEqual(dbCheck.rows[0].bpl_card, null);
    });

    test('6. Card 6: Save explicit boolean values correctly', async () => {
        const res = await invokeSaveSection('social_category', {
            social_category: 'sc',
            minority_status: false,
            disability_status: true,
            bpl_card: true
        });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.strictEqual(res.responseJson.data.profile.minority_status, false);
        assert.strictEqual(res.responseJson.data.profile.disability_status, true);
        assert.strictEqual(res.responseJson.data.profile.bpl_card, true);
    });
});

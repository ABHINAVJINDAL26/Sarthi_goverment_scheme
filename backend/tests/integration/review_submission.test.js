import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import pool from '../../src/config/db.js';
import { generateToken } from '../../src/middleware/authMiddleware.js';

describe('Phase 11: Review and Final Submission', () => {
    let testUser;
    let token;

    before(async () => {
        const u = await pool.query(
            `INSERT INTO users (mobile_number, mobile_verified_at)
             VALUES ('9876592001', NOW())
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

    const getReview = async () => {
        const { getProfileReview } = await import('../../src/controllers/profileController.js');
        const req = { params: { userId: String(testUser.id) }, user: { userId: String(testUser.id) } };
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

    const submit = async () => {
        const { submitProfileHandler } = await import('../../src/controllers/profileController.js');
        const req = { params: { userId: String(testUser.id) }, user: { userId: String(testUser.id) } };
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

    const saveSection = async (sectionKey, body) => {
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

    test('1. Review on incomplete profile returns structured cards and canSubmit: false', async () => {
        const { statusCode, responseJson } = await getReview();
        assert.strictEqual(statusCode, 200);
        assert.strictEqual(responseJson.success, true);

        const data = responseJson.data;
        assert.strictEqual(data.isSubmitted, false);
        assert.strictEqual(data.canSubmit, false);
        assert.strictEqual(data.cards.length, 7);
        assert.strictEqual(data.completeness.percentage, 0);
    });

    test('2. Reject submission on incomplete profile with 400 and pending details', async () => {
        const { statusCode, responseJson } = await submit();
        assert.strictEqual(statusCode, 400);
        assert.strictEqual(responseJson.success, false);
        assert.match(responseJson.message, /all 7 sections must be completed first/i);
        assert.strictEqual(responseJson.errors.pendingSections.length, 7);

        // Verify in DB that is_submitted is still false
        const dbCheck = await pool.query('SELECT is_submitted FROM user_profiles WHERE user_id = $1', [testUser.id]);
        assert.strictEqual(dbCheck.rows[0].is_submitted, false);
    });

    test('3. Complete all 7 cards and verify review canSubmit becomes true', async () => {
        await saveSection('basics', { full_name: 'Vikram Patel', date_of_birth: '1992-06-25', gender: 'male' });
        await saveSection('location', { state: 'Gujarat', district: 'Ahmedabad', residence_type: 'urban' });
        await saveSection('education', { education_level: 'Graduate' });
        await saveSection('employment', { occupation: 'Self-Employed' });
        await saveSection('income', { annual_household_income: 450000 });
        await saveSection('social_category', { social_category: 'general' });
        await saveSection('family', { marital_status: 'married', family_size: 3 });

        const { statusCode, responseJson } = await getReview();
        assert.strictEqual(statusCode, 200);
        assert.strictEqual(responseJson.data.canSubmit, true);
        assert.strictEqual(responseJson.data.completeness.percentage, 100);
        assert.strictEqual(responseJson.data.completeness.isFullyComplete, true);
    });

    test('4. Submit fully completed profile successfully (200 OK)', async () => {
        const { statusCode, responseJson } = await submit();
        assert.strictEqual(statusCode, 200);
        assert.strictEqual(responseJson.success, true);
        assert.strictEqual(responseJson.data.isSubmitted, true);
        assert.ok(responseJson.data.submittedAt);

        // Verify in DB
        const dbCheck = await pool.query('SELECT is_submitted, submitted_at FROM user_profiles WHERE user_id = $1', [testUser.id]);
        assert.strictEqual(dbCheck.rows[0].is_submitted, true);
        assert.ok(dbCheck.rows[0].submitted_at);
    });

    test('5. Reject duplicate submission with 409 Conflict', async () => {
        const { statusCode, responseJson } = await submit();
        assert.strictEqual(statusCode, 409);
        assert.strictEqual(responseJson.success, false);
        assert.match(responseJson.message, /already been submitted/i);
    });
});

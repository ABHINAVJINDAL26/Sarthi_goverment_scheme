import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import pool from '../../src/config/db.js';
import { generateToken } from '../../src/middleware/authMiddleware.js';

describe('Phase 10: Progress Tracking and Completion Calculation', () => {
    let testUser;
    let token;

    before(async () => {
        const u = await pool.query(
            `INSERT INTO users (mobile_number, mobile_verified_at)
             VALUES ('9876591001', NOW())
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

    const getCompleteness = async () => {
        const { getProfileCompleteness } = await import('../../src/controllers/profileController.js');
        const req = { params: { userId: String(testUser.id) }, user: { userId: String(testUser.id) } };
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

    test('1. Initial profile completeness is 0% with 7 pending cards and missing fields', async () => {
        const { statusCode, responseJson } = await getCompleteness();
        assert.strictEqual(statusCode, 200);
        assert.strictEqual(responseJson.success, true);

        const comp = responseJson.data;
        assert.strictEqual(comp.totalSections, 7);
        assert.strictEqual(comp.completedCount, 0);
        assert.strictEqual(comp.pendingCount, 7);
        assert.strictEqual(comp.percentage, 0);
        assert.strictEqual(comp.isFullyComplete, false);
        assert.strictEqual(comp.completedSections.length, 0);
        assert.strictEqual(comp.pendingSections.length, 7);
        assert.deepStrictEqual(comp.missingFieldsBySection.basics, ['full_name', 'date_of_birth', 'gender']);
    });

    test('2. Completing Card 1 increases percentage to 14%', async () => {
        await saveSection('basics', {
            full_name: 'Rahul Sharma',
            date_of_birth: '1995-11-20',
            gender: 'male'
        });

        const { statusCode, responseJson } = await getCompleteness();
        assert.strictEqual(statusCode, 200);
        const comp = responseJson.data;

        assert.strictEqual(comp.completedCount, 1);
        assert.strictEqual(comp.pendingCount, 6);
        assert.strictEqual(comp.percentage, 14); // 1/7 = 14%
        assert.deepStrictEqual(comp.completedSections, ['basics']);
    });

    test('3. Completing Cards 2 & 3 increases percentage to 43%', async () => {
        await saveSection('location', {
            state: 'Punjab',
            district: 'Ludhiana',
            residence_type: 'urban'
        });

        await saveSection('education', {
            education_level: 'Graduate'
        });

        const { statusCode, responseJson } = await getCompleteness();
        assert.strictEqual(statusCode, 200);
        const comp = responseJson.data;

        assert.strictEqual(comp.completedCount, 3);
        assert.strictEqual(comp.percentage, 43); // 3/7 = 43%
        assert.deepStrictEqual(comp.completedSections, ['basics', 'location', 'education']);
    });

    test('4. Completing all 7 cards yields 100% and isFullyComplete: true', async () => {
        await saveSection('employment', { occupation: 'salaried' });
        await saveSection('income', { annual_household_income: 600000 });
        await saveSection('social_category', { social_category: 'general' }); // optional flags left null
        await saveSection('family', { marital_status: 'single', family_size: 3 });

        const { statusCode, responseJson } = await getCompleteness();
        assert.strictEqual(statusCode, 200);
        const comp = responseJson.data;

        assert.strictEqual(comp.totalSections, 7);
        assert.strictEqual(comp.completedCount, 7);
        assert.strictEqual(comp.pendingCount, 0);
        assert.strictEqual(comp.percentage, 100);
        assert.strictEqual(comp.isFullyComplete, true);
        assert.deepStrictEqual(comp.pendingSections, []);
        assert.deepStrictEqual(comp.missingFieldsBySection, {});
    });
});

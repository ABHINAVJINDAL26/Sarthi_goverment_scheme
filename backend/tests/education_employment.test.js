import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import pool from '../src/config/db.js';
import { generateToken } from '../src/middleware/authMiddleware.js';

describe('Phase 6: Education and Employment Cards', () => {
    let testUser;
    let token;

    before(async () => {
        const u = await pool.query(
            `INSERT INTO users (mobile_number, mobile_verified_at)
             VALUES ('9876560001', NOW())
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

    // --- CARD 3: EDUCATION TESTS ---
    test('1. Card 3: Reject empty education_level or non-string', async () => {
        const emptyRes = await invokeSaveSection('education', { education_level: '   ' });
        assert.strictEqual(emptyRes.statusCode, 400);
        assert.strictEqual(emptyRes.responseJson.success, false);
        assert.match(emptyRes.responseJson.errors[0].message, /non-empty string/i);

        const typeRes = await invokeSaveSection('education', { education_level: 12345 });
        assert.strictEqual(typeRes.statusCode, 400);
        assert.strictEqual(typeRes.responseJson.success, false);
    });

    test('2. Card 3: Reject unknown field in education card', async () => {
        const res = await invokeSaveSection('education', { school_name: 'Govt High School' });
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(res.responseJson.success, false);
        assert.match(res.responseJson.errors[0].message, /not a valid field for section 'education'/);
    });

    test('3. Card 3: Valid save marks education completed', async () => {
        const res = await invokeSaveSection('education', { education_level: 'Higher Secondary (12th Pass)' });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.strictEqual(res.responseJson.data.status, 'completed');
        assert.ok(res.responseJson.data.completed_at);
        assert.strictEqual(res.responseJson.data.profile.education_level, 'Higher Secondary (12th Pass)');
    });

    // --- CARD 4: EMPLOYMENT TESTS ---
    test('4. Card 4: Reject empty occupation or exceeding 100 characters', async () => {
        const emptyRes = await invokeSaveSection('employment', { occupation: '' });
        assert.strictEqual(emptyRes.statusCode, 400);
        assert.strictEqual(emptyRes.responseJson.success, false);
        assert.match(emptyRes.responseJson.errors[0].message, /non-empty string/i);

        const longRes = await invokeSaveSection('employment', { occupation: 'A'.repeat(101) });
        assert.strictEqual(longRes.statusCode, 400);
        assert.strictEqual(longRes.responseJson.success, false);
        assert.match(longRes.responseJson.errors[0].message, /cannot exceed 100 characters/i);
    });

    test('5. Card 4: Valid save marks employment completed', async () => {
        const res = await invokeSaveSection('employment', { occupation: 'Farmer' });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.responseJson.success, true);
        assert.strictEqual(res.responseJson.data.status, 'completed');
        assert.ok(res.responseJson.data.completed_at);
        assert.strictEqual(res.responseJson.data.profile.occupation, 'Farmer');
    });

    test('6. Verify both education and employment track progress independently', async () => {
        const { getProgress } = await import('../src/controllers/profileController.js');
        const req = {
            params: { userId: String(testUser.id) },
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

        await getProgress(req, res);
        assert.strictEqual(statusCode, 200);

        const progressMap = {};
        for (const p of responseJson.data.progress) {
            progressMap[p.section_key] = p.status;
        }

        assert.strictEqual(progressMap['education'], 'completed');
        assert.strictEqual(progressMap['employment'], 'completed');
        assert.strictEqual(progressMap['income'], 'not_started');
        assert.strictEqual(progressMap['family'], 'not_started');
    });
});

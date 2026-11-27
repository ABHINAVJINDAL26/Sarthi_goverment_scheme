import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import pool from '../../src/config/db.js';
import { saveSectionData } from '../../src/services/profileService.js';
import { calculateProfileCompleteness } from '../../src/services/progressService.js';
import { validateSectionPayload } from '../../src/validators/profileValidator.js';
import { profileToFacts } from '../../src/eligibility/profileFacts.js';

// End-to-end through the real database: the new scheme fields save, "prefer not to say"
// stays UNKNOWN but completes the card, and the saved row feeds the eligibility facts.
describe('Scheme-rule fields and prefer-not-to-say', () => {
    const mobile = '9876597001';
    let userId;

    const save = async (section, body) => {
        const v = validateSectionPayload(section, body);
        assert.ok(v.isValid, JSON.stringify(v.errors));
        return saveSectionData(userId, section, v.values, v.declined);
    };

    before(async () => {
        await pool.query('DELETE FROM users WHERE mobile_number = $1', [mobile]);
        const u = await pool.query('INSERT INTO users (mobile_number) VALUES ($1) RETURNING id', [mobile]);
        userId = u.rows[0].id;
        await pool.query('INSERT INTO user_profiles (user_id) VALUES ($1)', [userId]);
    });

    after(async () => {
        await pool.query('DELETE FROM users WHERE mobile_number = $1', [mobile]);
        await pool.end();
    });

    test('new fields used by scheme rules are saved in canonical form', async () => {
        await save('social_category', { social_category: 'sc', ration_card_type: 'phh', disability_percent: 45, in_secc_list: true });
        await save('income', { annual_household_income: 180000, has_bank_account: true, income_tax_payer: false, land_holding_acres: 4.94 });
        const row = (await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId])).rows[0];
        assert.equal(row.social_category, 'SC');
        assert.equal(row.ration_card_type, 'PHH');
        assert.equal(row.disability_percent, 45);
        const facts = profileToFacts(row);
        assert.equal(facts.caste, 'SC');
        assert.equal(facts.nfsa_ration_card, true);
        assert.equal(facts.land_hectares, 2);
        assert.equal(facts.income_tax_payer, false);
    });

    test('"prefer not to say" stores NULL, completes the card and stays UNKNOWN for rules', async () => {
        const r = await save('basics', { full_name: 'Asha Devi', date_of_birth: '1980-05-01', gender: 'prefer_not_to_say' });
        assert.equal(r.status, 'completed');
        const row = (await pool.query('SELECT gender, declined_fields FROM user_profiles WHERE user_id = $1', [userId])).rows[0];
        assert.equal(row.gender, null);
        assert.deepEqual(row.declined_fields, ['gender']);
        assert.equal(profileToFacts(row).gender, null);
        const c = await calculateProfileCompleteness(userId);
        assert.ok(c.completedSections.includes('basics'));
    });

    test('answering a declined field later removes it from the declined list', async () => {
        await save('basics', { gender: 'female' });
        const row = (await pool.query('SELECT gender, declined_fields FROM user_profiles WHERE user_id = $1', [userId])).rows[0];
        assert.equal(row.gender, 'female');
        assert.deepEqual(row.declined_fields, []);
    });
});

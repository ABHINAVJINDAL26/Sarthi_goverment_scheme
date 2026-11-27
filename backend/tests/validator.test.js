import './helpers/env.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PROFILE_VALUES, RULE_FIELD_SOURCES } from '../src/eligibility/profileFacts.js';
import {
    EDITABLE_FIELDS, FIELD_RULES, PREFER_NOT_TO_SAY, SECTION_CONFIG, normalizeEnum, validateSectionPayload,
} from '../src/validators/profileValidator.js';

// Guards against the validator, the database CHECK lists and the scheme rules drifting apart again.

test('every column a scheme rule reads can be saved through some profile section', () => {
    const readable = new Set(Object.values(RULE_FIELD_SOURCES).flat());
    const missing = [...readable].filter((c) => !EDITABLE_FIELDS.includes(c));
    assert.deepEqual(missing, [], `add to SECTION_CONFIG: ${missing.join(', ')}`);
});

test('every editable field has a validation rule', () => {
    assert.deepEqual(EDITABLE_FIELDS.filter((f) => !FIELD_RULES[f]), []);
});

test('enum options are exactly the database values', () => {
    const map = { gender: 'gender', residence_type: 'residence_type', social_category: 'social_category',
        marital_status: 'marital_status', occupation: 'occupation', ration_card_type: 'ration_card_type' };
    for (const [field, key] of Object.entries(map)) assert.deepEqual(FIELD_RULES[field].values, PROFILE_VALUES[key], field);
});

test('input is case-insensitive and common aliases map to database values', () => {
    assert.equal(normalizeEnum('social_category', 'sc'), 'SC');
    assert.equal(normalizeEnum('social_category', 'general'), 'General');
    assert.equal(normalizeEnum('marital_status', 'Single'), 'unmarried');
    assert.equal(normalizeEnum('marital_status', 'widowed'), 'widow');
    assert.equal(normalizeEnum('gender', 'Female'), 'female');
    assert.equal(normalizeEnum('occupation', 'Self-Employed'), 'entrepreneur');
    assert.equal(normalizeEnum('ration_card_type', 'aay'), 'AAY');
    assert.equal(normalizeEnum('gender', 'alien'), undefined);
});

test('a section save returns canonical values ready for the database', () => {
    const r = validateSectionPayload('social_category', { social_category: 'obc', bpl_card: true, ration_card_type: 'phh', disability_percent: 40 });
    assert.ok(r.isValid, JSON.stringify(r.errors));
    assert.deepEqual(r.values, { social_category: 'OBC', bpl_card: true, ration_card_type: 'PHH', disability_percent: 40 });
});

test('"prefer not to say" is stored as NULL and remembered as declined', () => {
    const r = validateSectionPayload('basics', { gender: PREFER_NOT_TO_SAY, full_name: 'Asha' });
    assert.ok(r.isValid);
    assert.equal(r.values.gender, null);
    assert.deepEqual(r.declined, ['gender']);
    const name = validateSectionPayload('basics', { full_name: PREFER_NOT_TO_SAY });
    assert.equal(name.values.full_name, PREFER_NOT_TO_SAY, 'full name cannot be declined');
});

test('bad values are rejected with a clear message', () => {
    const r = validateSectionPayload('family', { marital_status: 'complicated', family_size: 0 });
    assert.equal(r.isValid, false);
    assert.match(r.errors.find((e) => e.field === 'marital_status').message, /Marital status must be one of/);
    assert.match(r.errors.find((e) => e.field === 'family_size').message, /at least 1/);
    assert.equal(validateSectionPayload('education', { current_class: 13 }).isValid, false);
    assert.equal(validateSectionPayload('income', { income_tax_payer: 'yes' }).isValid, false);
    assert.equal(validateSectionPayload('income', { unknown_field: 1 }).isValid, false);
});

test('each required field is also an allowed field of its section', () => {
    for (const [key, c] of Object.entries(SECTION_CONFIG)) {
        assert.deepEqual(c.requiredFields.filter((f) => !c.allowedFields.includes(f)), [], key);
    }
});

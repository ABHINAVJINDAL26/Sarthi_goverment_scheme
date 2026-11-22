import './helpers/env.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { POST_SCHOOL_CLASS, PROFILE_VALUES, RULE_FIELD_SOURCES, ageOn, profileToFacts } from '../src/eligibility/profileFacts.js';
import { loadSchemes } from '../src/services/schemeService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
const { schemes } = loadSchemes();
const allCriteria = schemes.flatMap((s) => s.criteria.map((c) => ({ ...c, scheme: s.id })));

/** Columns of user_profiles as written in schema.sql. */
function profileColumns() {
    const body = schemaSql.split('CREATE TABLE IF NOT EXISTS user_profiles')[1].split(/\n\);/)[0];
    return new Set([...body.matchAll(/^\s{4}([a-z_]+)\s+(?:BIGINT|VARCHAR|DATE|BOOLEAN|NUMERIC|INTEGER|SMALLINT|TIMESTAMPTZ)/gm)].map((m) => m[1]));
}

test('every rule field used by a scheme can be computed from the profile', () => {
    const missing = [...new Set(allCriteria.map((c) => c.field))].filter((f) => !(f in RULE_FIELD_SOURCES));
    assert.deepEqual(missing, [], `add these rule fields to RULE_FIELD_SOURCES: ${missing.join(', ')}`);
});

test('every profile column the mapping reads exists in schema.sql', () => {
    const columns = profileColumns();
    const missing = [...new Set(Object.values(RULE_FIELD_SOURCES).flat())].filter((c) => !columns.has(c));
    assert.deepEqual(missing, []);
});

test('profileToFacts returns a fact for every rule field', () => {
    const facts = profileToFacts({});
    assert.deepEqual(Object.keys(facts).sort(), Object.keys(RULE_FIELD_SOURCES).sort());
    // An empty profile is all UNKNOWN, never "no".
    assert.ok(Object.values(facts).every((v) => v === null), JSON.stringify(facts));
});

const VOCAB = {
    occupation: PROFILE_VALUES.occupation,
    caste: PROFILE_VALUES.social_category,
    marital_status: PROFILE_VALUES.marital_status,
    gender: PROFILE_VALUES.gender,
    residence: PROFILE_VALUES.residence_type,
};

test('values in scheme rules are values the profile can hold', () => {
    const bad = [];
    for (const c of allCriteria) {
        const allowed = VOCAB[c.field];
        if (!allowed || (c.op !== 'eq' && c.op !== 'in')) continue;
        for (const v of [c.value].flat()) if (!allowed.includes(v)) bad.push(`${c.scheme}: ${c.field}=${v}`);
    }
    assert.deepEqual(bad, []);
});

test('schema.sql CHECK lists match PROFILE_VALUES', () => {
    for (const [column, values] of Object.entries(PROFILE_VALUES)) {
        const check = schemaSql.match(new RegExp(`${column} IS NULL\\s+OR ${column} IN \\(([^)]*)\\)`, 's'));
        assert.ok(check, `no CHECK constraint for ${column}`);
        const inSql = [...check[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
        assert.deepEqual(inSql, values, column);
    }
});

test('the 002 migration adds every new column that schema.sql has', () => {
    const migration = fs.readFileSync(path.join(__dirname, '../database/migrations/002_profile_fields_for_schemes.sql'), 'utf8');
    const added = [
        'has_pucca_house', 'owns_house', 'has_electricity_connection', 'is_student', 'current_class',
        'govt_employee_in_family', 'epfo_esic_nps_member', 'monthly_personal_income', 'income_tax_payer',
        'has_bank_account', 'disability_percent', 'ration_card_type', 'in_secc_list', 'pregnant_or_lactating',
    ];
    const columns = profileColumns();
    for (const col of added) {
        assert.ok(columns.has(col), `${col} missing from schema.sql`);
        assert.match(migration, new RegExp(`ADD COLUMN IF NOT EXISTS ${col}\\b`), `${col} missing from migration 002`);
    }
});

test('age is computed from the date of birth, birthday-aware', () => {
    const today = new Date('2026-11-22T00:00:00Z');
    assert.equal(ageOn('1990-11-22', today), 36);
    assert.equal(ageOn('1990-11-23', today), 35);
    assert.equal(ageOn(null, today), null);
});

test('land is converted from acres to hectares', () => {
    const facts = profileToFacts({ land_holding_acres: '4.94' });
    assert.equal(facts.land_hectares, 2);
    assert.equal(facts.owns_agri_land, true);
    assert.equal(profileToFacts({ land_holding_acres: 0 }).owns_agri_land, false);
});

test('ration card type sets the NFSA and BPL facts', () => {
    assert.equal(profileToFacts({ ration_card_type: 'PHH' }).nfsa_ration_card, true);
    assert.equal(profileToFacts({ ration_card_type: 'NONE' }).nfsa_ration_card, false);
    assert.equal(profileToFacts({ ration_card_type: 'AAY' }).bpl, true);
    assert.equal(profileToFacts({ ration_card_type: 'PHH' }).bpl, null, 'PHH alone does not prove BPL');
    assert.equal(profileToFacts({ bpl_card: false, ration_card_type: 'AAY' }).bpl, false, 'an explicit answer wins');
});

test('student class: school class, college, or not a student', () => {
    assert.equal(profileToFacts({ current_class: 9 }).student_class, 9);
    assert.equal(profileToFacts({ is_student: true, education_level: 'Graduate' }).student_class, POST_SCHOOL_CLASS);
    assert.equal(profileToFacts({ is_student: false }).student_class, 0);
});

test('"no disability" means 0%, an unknown percentage stays unknown', () => {
    assert.equal(profileToFacts({ disability_status: false }).disability_percent, 0);
    assert.equal(profileToFacts({ disability_status: true }).disability_percent, null);
    assert.equal(profileToFacts({ disability_status: true, disability_percent: 60 }).disability_percent, 60);
});

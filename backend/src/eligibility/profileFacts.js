/**
 * Turns a user_profiles row into the "facts" that scheme rules read.
 *
 * Scheme rules live in public/data/schemes.json (`criteria`: field, op, value).
 * Every rule field must appear in RULE_FIELD_SOURCES below; the test
 * tests/profileFacts.test.js fails if a scheme uses a field that has no profile column.
 *
 * A fact is `null` when the person did not answer or chose "prefer not to say".
 * The rule engine treats null as UNKNOWN, never as "no".
 */

export const ACRES_PER_HECTARE = 2.47105;

/** Allowed values of the profile's text fields (same lists as the CHECK constraints in schema.sql). */
export const PROFILE_VALUES = Object.freeze({
    gender: ['female', 'male', 'transgender'],
    residence_type: ['rural', 'urban'],
    social_category: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    marital_status: ['unmarried', 'married', 'widow', 'divorced', 'separated', 'destitute'],
    occupation: [
        'farmer', 'student', 'entrepreneur', 'artisan', 'street_vendor',
        'unorganised_worker', 'construction_worker', 'salaried', 'unemployed',
        'homemaker', 'retired', 'other',
    ],
    ration_card_type: ['AAY', 'PHH', 'NON_NFSA', 'NONE'],
});

/** Education levels that mean the student is past Class 12 (post-matric, college). */
const POST_SCHOOL_LEVELS = new Set(['diploma', 'iti', 'graduate', 'undergraduate', 'postgraduate', 'phd', 'college']);
/** current_class value used for students past Class 12. */
export const POST_SCHOOL_CLASS = 13;

/** Rule field -> the profile column(s) it is computed from (also shown to the wizard). */
export const RULE_FIELD_SOURCES = Object.freeze({
    age: ['date_of_birth'],
    gender: ['gender'],
    state: ['state'],
    residence: ['residence_type'],
    income_annual: ['annual_household_income'],
    income_monthly: ['monthly_personal_income'],
    occupation: ['occupation'],
    caste: ['social_category'],
    marital_status: ['marital_status'],
    bpl: ['bpl_card', 'ration_card_type'],
    nfsa_ration_card: ['ration_card_type'],
    secc_listed: ['in_secc_list'],
    disability_percent: ['disability_percent', 'disability_status'],
    land_hectares: ['land_holding_acres'],
    owns_agri_land: ['land_holding_acres'],
    income_tax_payer: ['income_tax_payer'],
    govt_employee: ['govt_employee_in_family'],
    epfo_esic_nps_member: ['epfo_esic_nps_member'],
    has_bank_account: ['has_bank_account'],
    has_pucca_house: ['has_pucca_house'],
    pregnant_or_lactating: ['pregnant_or_lactating'],
    student_class: ['current_class', 'is_student', 'education_level'],
    owns_house: ['owns_house'],
    has_electricity_connection: ['has_electricity_connection'],
});

const isSet = (v) => v !== null && v !== undefined && v !== '';
const toNumber = (v) => (isSet(v) ? Number(v) : null);
const toBool = (v) => (isSet(v) ? Boolean(v) : null);

/** Whole years between a date of birth and `today`. */
export function ageOn(dateOfBirth, today = new Date()) {
    if (!isSet(dateOfBirth)) return null;
    const dob = dateOfBirth instanceof Date ? dateOfBirth : new Date(`${String(dateOfBirth).slice(0, 10)}T00:00:00Z`);
    if (Number.isNaN(dob.getTime())) return null;
    let age = today.getUTCFullYear() - dob.getUTCFullYear();
    const beforeBirthday =
        today.getUTCMonth() < dob.getUTCMonth() ||
        (today.getUTCMonth() === dob.getUTCMonth() && today.getUTCDate() < dob.getUTCDate());
    if (beforeBirthday) age -= 1;
    return age;
}

function studentClass(p) {
    if (isSet(p.current_class)) return Number(p.current_class);
    if (p.is_student === false) return 0; // not studying: class rules fail instead of staying unknown
    if (p.is_student === true && POST_SCHOOL_LEVELS.has(String(p.education_level ?? '').toLowerCase())) {
        return POST_SCHOOL_CLASS;
    }
    return null;
}

function bpl(p) {
    if (isSet(p.bpl_card)) return Boolean(p.bpl_card);
    if (p.ration_card_type === 'AAY') return true; // Antyodaya cards go to the poorest households
    return null;
}

function nfsaCard(p) {
    if (!isSet(p.ration_card_type)) return null;
    return p.ration_card_type === 'AAY' || p.ration_card_type === 'PHH';
}

function disabilityPercent(p) {
    if (isSet(p.disability_percent)) return Number(p.disability_percent);
    if (p.disability_status === false) return 0;
    return null; // has a disability but percentage unknown, or not answered
}

/**
 * Facts for one profile, keyed by rule field. `today` is injectable for tests.
 * @param {Record<string, unknown>} p a user_profiles row
 */
export function profileToFacts(p, today = new Date()) {
    const acres = toNumber(p.land_holding_acres);
    return {
        age: ageOn(p.date_of_birth, today),
        gender: p.gender ?? null,
        state: p.state ?? null,
        residence: p.residence_type ?? null,
        income_annual: toNumber(p.annual_household_income),
        income_monthly: toNumber(p.monthly_personal_income),
        occupation: p.occupation ?? null,
        caste: p.social_category ?? null,
        marital_status: p.marital_status ?? null,
        bpl: bpl(p),
        nfsa_ration_card: nfsaCard(p),
        secc_listed: toBool(p.in_secc_list),
        disability_percent: disabilityPercent(p),
        land_hectares: acres === null ? null : Math.round((acres / ACRES_PER_HECTARE) * 100) / 100,
        owns_agri_land: acres === null ? null : acres > 0,
        income_tax_payer: toBool(p.income_tax_payer),
        govt_employee: toBool(p.govt_employee_in_family),
        epfo_esic_nps_member: toBool(p.epfo_esic_nps_member),
        has_bank_account: toBool(p.has_bank_account),
        has_pucca_house: toBool(p.has_pucca_house),
        pregnant_or_lactating: toBool(p.pregnant_or_lactating),
        student_class: studentClass(p),
        owns_house: toBool(p.owns_house),
        has_electricity_connection: toBool(p.has_electricity_connection),
    };
}

/**
 * Profile Section Validation Rules and Logic
 *
 * Allowed values come from PROFILE_VALUES (src/eligibility/profileFacts.js), which a test keeps
 * identical to the CHECK constraints in database/schema.sql. Input is case-insensitive and a few
 * everyday aliases are accepted ("single" -> "unmarried", "sc" -> "SC"); the canonical value is stored.
 *
 * "prefer_not_to_say" is accepted for every field except full_name. It is stored as NULL (the
 * eligibility engine treats it as UNKNOWN, never as "no") and recorded in user_profiles.declined_fields,
 * so a declined required field still counts as answered for section completion.
 */
import { PROFILE_VALUES } from '../eligibility/profileFacts.js';

export const PREFER_NOT_TO_SAY = 'prefer_not_to_say';

export const GENDER_OPTIONS = PROFILE_VALUES.gender;
export const RESIDENCE_OPTIONS = PROFILE_VALUES.residence_type;
export const SOCIAL_CATEGORY_OPTIONS = PROFILE_VALUES.social_category;
export const MARITAL_STATUS_OPTIONS = PROFILE_VALUES.marital_status;
export const OCCUPATION_OPTIONS = PROFILE_VALUES.occupation;
export const RATION_CARD_OPTIONS = PROFILE_VALUES.ration_card_type;

/** Everyday words people type -> canonical stored value (keys are lower-case, spaces/hyphens as "_"). */
const ALIASES = {
    gender: { f: 'female', woman: 'female', m: 'male', man: 'male', third_gender: 'transgender', tg: 'transgender' },
    social_category: { gen: 'General', unreserved: 'General', open: 'General', bc: 'OBC' },
    marital_status: { single: 'unmarried', never_married: 'unmarried', widowed: 'widow', widower: 'widow', divorcee: 'divorced' },
    occupation: {
        farming: 'farmer', kisan: 'farmer', agriculture: 'farmer',
        self_employed: 'entrepreneur', business: 'entrepreneur', businessman: 'entrepreneur', shopkeeper: 'entrepreneur',
        vendor: 'street_vendor', hawker: 'street_vendor',
        labour: 'unorganised_worker', labourer: 'unorganised_worker', laborer: 'unorganised_worker', daily_wage: 'unorganised_worker',
        unorganized_worker: 'unorganised_worker', construction: 'construction_worker',
        craftsman: 'artisan', karigar: 'artisan',
        employee: 'salaried', employed: 'salaried', job: 'salaried', private_job: 'salaried', government_job: 'salaried',
        housewife: 'homemaker', house_wife: 'homemaker', pensioner: 'retired', jobless: 'unemployed',
    },
    ration_card_type: { antyodaya: 'AAY', priority: 'PHH', priority_household: 'PHH', apl: 'NON_NFSA', no: 'NONE', none: 'NONE' },
    residence_type: { village: 'rural', city: 'urban', town: 'urban' },
};

/** Validation rule for every editable profile column. */
export const FIELD_RULES = {
    full_name: { type: 'string', max: 150, label: 'Full name', declinable: false },
    date_of_birth: { type: 'date', label: 'Date of birth' },
    gender: { type: 'enum', values: GENDER_OPTIONS, label: 'Gender' },
    state: { type: 'string', max: 100, label: 'State' },
    district: { type: 'string', max: 100, label: 'District' },
    residence_type: { type: 'enum', values: RESIDENCE_OPTIONS, label: 'Residence type' },
    has_pucca_house: { type: 'boolean' },
    owns_house: { type: 'boolean' },
    has_electricity_connection: { type: 'boolean' },
    education_level: { type: 'string', max: 100, label: 'Education level' },
    is_student: { type: 'boolean' },
    current_class: { type: 'integer', min: 1, max: 12, label: 'Current class' },
    occupation: { type: 'enum', values: OCCUPATION_OPTIONS, max: 100, label: 'Occupation' },
    govt_employee_in_family: { type: 'boolean' },
    epfo_esic_nps_member: { type: 'boolean' },
    annual_household_income: { type: 'number', min: 0, max: 9999999999.99, label: 'Annual household income' },
    monthly_personal_income: { type: 'number', min: 0, max: 9999999999.99, label: 'Monthly personal income' },
    income_tax_payer: { type: 'boolean' },
    has_bank_account: { type: 'boolean' },
    land_holding_acres: { type: 'number', min: 0, max: 99999999.99, label: 'Land holding in acres' },
    social_category: { type: 'enum', values: SOCIAL_CATEGORY_OPTIONS, label: 'Social category' },
    minority_status: { type: 'boolean' },
    disability_status: { type: 'boolean' },
    disability_percent: { type: 'integer', min: 0, max: 100, label: 'Disability percentage' },
    bpl_card: { type: 'boolean' },
    ration_card_type: { type: 'enum', values: RATION_CARD_OPTIONS, label: 'Ration card type' },
    in_secc_list: { type: 'boolean' },
    marital_status: { type: 'enum', values: MARITAL_STATUS_OPTIONS, label: 'Marital status' },
    family_size: { type: 'integer', min: 1, max: 100, label: 'Family size' },
    pregnant_or_lactating: { type: 'boolean' },
};

export const SECTION_CONFIG = {
    basics: {
        title: 'Personal Information',
        allowedFields: ['full_name', 'date_of_birth', 'gender'],
        requiredFields: ['full_name', 'date_of_birth', 'gender']
    },
    location: {
        title: 'Location Information',
        allowedFields: ['state', 'district', 'residence_type', 'has_pucca_house', 'owns_house', 'has_electricity_connection'],
        requiredFields: ['state', 'district', 'residence_type']
    },
    education: {
        title: 'Education Information',
        allowedFields: ['education_level', 'is_student', 'current_class'],
        requiredFields: ['education_level']
    },
    employment: {
        title: 'Employment Information',
        allowedFields: ['occupation', 'govt_employee_in_family', 'epfo_esic_nps_member'],
        requiredFields: ['occupation']
    },
    income: {
        title: 'Income Information',
        allowedFields: ['annual_household_income', 'monthly_personal_income', 'income_tax_payer', 'has_bank_account', 'land_holding_acres'],
        requiredFields: ['annual_household_income']
    },
    social_category: {
        title: 'Social Category Information',
        allowedFields: ['social_category', 'minority_status', 'disability_status', 'disability_percent', 'bpl_card', 'ration_card_type', 'in_secc_list'],
        requiredFields: ['social_category']
    },
    family: {
        title: 'Family Information',
        allowedFields: ['marital_status', 'family_size', 'pregnant_or_lactating', 'land_holding_acres', 'bpl_card'],
        requiredFields: ['marital_status', 'family_size']
    }
};

/** Every column a profile section can write. */
export const EDITABLE_FIELDS = [...new Set(Object.values(SECTION_CONFIG).flatMap((c) => c.allowedFields))];

/**
 * Validate Date string in YYYY-MM-DD format and check it's not in the future
 */
export const isValidDateOfBirth = (dob) => {
    if (typeof dob !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
        return false;
    }

    const date = new Date(`${dob}T00:00:00Z`);
    if (isNaN(date.getTime())) {
        return false;
    }

    // Ensure format matches parsed value (e.g., rejecting Feb 31st)
    if (date.toISOString().slice(0, 10) !== dob) {
        return false;
    }

    const today = new Date().toISOString().slice(0, 10);
    return dob <= today && dob >= `${Number(today.slice(0, 4)) - 120}${today.slice(4)}`;
};

const aliasKey = (s) => s.trim().toLowerCase().replace(/[\s-]+/g, '_');

/** Canonical enum value for any casing / alias, or undefined. */
export const normalizeEnum = (field, raw) => {
    const values = FIELD_RULES[field].values;
    const key = aliasKey(raw);
    const direct = values.find((v) => v.toLowerCase() === key || v.toLowerCase() === raw.trim().toLowerCase());
    return direct ?? ALIASES[field]?.[key];
};

const isPreferNotToSay = (v) => typeof v === 'string' && aliasKey(v) === PREFER_NOT_TO_SAY;

/**
 * Validate one field. Returns { value } (canonical) or { error }.
 * A value of null clears the field.
 */
export const validateField = (field, raw) => {
    const rule = FIELD_RULES[field];
    if (raw === null) return { value: null };
    const label = rule.label ?? field;

    switch (rule.type) {
        case 'string': {
            if (typeof raw !== 'string' || raw.trim().length === 0) return { error: `${label} must be a non-empty string` };
            if (raw.trim().length > rule.max) return { error: `${label} cannot exceed ${rule.max} characters` };
            return { value: raw.trim() };
        }
        case 'date':
            if (!isValidDateOfBirth(raw)) {
                return { error: `${label} must be a valid date in YYYY-MM-DD format and cannot be in the future` };
            }
            return { value: raw };
        case 'enum': {
            if (typeof raw !== 'string' || raw.trim().length === 0) return { error: `${label} must be a non-empty string` };
            if (rule.max && raw.trim().length > rule.max) return { error: `${label} cannot exceed ${rule.max} characters` };
            const value = normalizeEnum(field, raw);
            if (!value) return { error: `${label} must be one of: ${rule.values.join(', ')}, ${PREFER_NOT_TO_SAY}` };
            return { value };
        }
        case 'boolean':
            if (typeof raw !== 'boolean') return { error: `${field} must be a boolean (true or false) or null` };
            return { value: raw };
        case 'integer': {
            const n = Number(raw);
            if (!Number.isInteger(n) || n < rule.min) return { error: `${label} must be an integer of at least ${rule.min}` };
            if (n > rule.max) return { error: `${label} cannot exceed ${rule.max}` };
            return { value: n };
        }
        case 'number': {
            const n = Number(raw);
            if (raw === '' || typeof raw === 'boolean' || !Number.isFinite(n) || n < rule.min) {
                return { error: `${label} must be a valid non-negative number` };
            }
            if (n > rule.max) return { error: `${label} exceeds maximum supported limit` };
            return { value: n };
        }
        default:
            return { error: `Unsupported field '${field}'` };
    }
};

/**
 * Validate a set of fields (any section). Returns
 *   { isValid, errors: [{ field, message }], values: { field: canonicalValue }, declined: [field] }.
 */
export const validateFields = (data, allowedFields, sectionKey) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { isValid: false, errors: [{ field: 'body', message: 'Request body must be a JSON object' }] };
    }

    const fields = Object.keys(data);
    if (fields.length === 0) {
        return { isValid: false, errors: [{ field: 'body', message: 'Provide at least one field to save' }] };
    }

    const unknown = fields.filter((f) => !allowedFields.includes(f));
    if (unknown.length > 0) {
        return {
            isValid: false,
            errors: unknown.map((field) => ({
                field,
                message: sectionKey
                    ? `'${field}' is not a valid field for section '${sectionKey}'`
                    : `'${field}' is not a valid profile field`
            }))
        };
    }

    const errors = [];
    const values = {};
    const declined = [];
    for (const field of fields) {
        const raw = data[field];
        if (isPreferNotToSay(raw) && FIELD_RULES[field].declinable !== false) {
            values[field] = null;
            declined.push(field);
            continue;
        }
        const result = validateField(field, raw);
        if (result.error) errors.push({ field, message: result.error });
        else values[field] = result.value;
    }

    return { isValid: errors.length === 0, errors, values, declined };
};

/**
 * Validates the payload of one profile card (section).
 */
export const validateSectionPayload = (sectionKey, data) => {
    const config = SECTION_CONFIG[sectionKey];
    if (!config) {
        return {
            isValid: false,
            errors: [{ field: 'sectionKey', message: `Unknown section key: ${sectionKey}` }]
        };
    }
    return validateFields(data, config.allowedFields, sectionKey);
};

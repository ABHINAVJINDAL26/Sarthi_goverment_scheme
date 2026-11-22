import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PROFILE_VALUES, RULE_FIELD_SOURCES } from '../eligibility/profileFacts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * The verified scheme dataset is shared with the website: one file, public/data/schemes.json,
 * so the API and the frontend can never disagree about a scheme.
 */
export const SCHEMES_FILE = process.env.SCHEMES_FILE || path.resolve(__dirname, '../../../public/data/schemes.json');

let cache = null;

export function loadSchemes() {
    if (!cache) {
        const payload = JSON.parse(fs.readFileSync(SCHEMES_FILE, 'utf8'));
        cache = { ...payload, byId: new Map(payload.schemes.map((s) => [s.id, s])) };
    }
    return cache;
}

/** Schemes filtered the same way as the website's Explore page. */
export function listSchemes({ state, category, benefit, scope } = {}) {
    return loadSchemes().schemes.filter((s) =>
        (!state || s.scope === 'central' || s.states.includes(state)) &&
        (!category || s.categories.includes(category)) &&
        (!benefit || s.benefit_types.includes(benefit)) &&
        (!scope || s.scope === scope));
}

export function getScheme(id) {
    return loadSchemes().byId.get(id) ?? null;
}

/**
 * Profile fields for the wizard: which profile columns feed each rule field, the allowed
 * values, and how many schemes use it (so the wizard can say "add land size to check 3 more schemes").
 */
export function profileFieldGuide() {
    const usage = new Map();
    for (const s of loadSchemes().schemes) {
        for (const field of new Set(s.criteria.map((c) => c.field))) {
            if (!usage.has(field)) usage.set(field, []);
            usage.get(field).push(s.id);
        }
    }
    const fields = Object.entries(RULE_FIELD_SOURCES).map(([field, columns]) => ({
        field,
        columns,
        schemes: usage.get(field)?.length ?? 0,
        scheme_ids: usage.get(field) ?? [],
    }));
    fields.sort((a, b) => b.schemes - a.schemes);
    return { values: PROFILE_VALUES, fields };
}

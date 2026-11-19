/**
 * Data checks for public/data/schemes.json. Run before every commit that touches the data:
 *   node src/features/explore/data.test.ts
 *
 * Every scheme must be complete, bilingual where the UI needs it, and backed by at least
 * one official source. Rules must use known fields and operators so the rule engine can read them.
 */
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import type { BenefitType, CriterionField, CriterionOp, Scheme, SchemesPayload } from './types.ts'
import { CATEGORY_HI, DOCUMENT_HI, STATE_HI } from '../../i18n/dataTerms.ts'

const data: SchemesPayload = JSON.parse(readFileSync(new URL('../../../public/data/schemes.json', import.meta.url), 'utf8'))

const BENEFITS: BenefitType[] = ['cash', 'pension', 'insurance', 'loan', 'subsidy', 'scholarship', 'savings', 'in_kind', 'training']
const FIELDS: CriterionField[] = [
  'age', 'gender', 'state', 'residence', 'income_annual', 'income_monthly', 'occupation', 'caste', 'marital_status', 'bpl',
  'nfsa_ration_card', 'secc_listed', 'disability_percent', 'land_hectares', 'owns_agri_land', 'income_tax_payer',
  'govt_employee', 'epfo_esic_nps_member', 'has_bank_account', 'has_pucca_house', 'pregnant_or_lactating', 'student_class',
  'owns_house', 'has_electricity_connection',
]
const OPS: CriterionOp[] = ['gte', 'lte', 'eq', 'neq', 'in', 'not_in', 'between', 'is_true', 'is_false']
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const DEVANAGARI = /[ऀ-ॿ]/
/** Government domains, plus official portals that are not on .gov.in (PM-SYM, Stand-Up India / SIDBI, PFRDA). */
const OFFICIAL_HOST = /(\.gov\.in|\.nic\.in|(^|\.)maandhan\.in|(^|\.)standupmitra\.in|(^|\.)pfrda\.org\.in)$/

let passed = 0
function check(name: string, fn: () => void) {
  fn()
  passed++
  console.log('ok -', name)
}

function each(fn: (s: Scheme) => void) {
  for (const s of data.schemes) {
    try {
      fn(s)
    } catch (err) {
      throw new Error(`${s.id}: ${(err as Error).message}`)
    }
  }
}

check('payload header matches the schemes', () => {
  assert.equal(data.version, 2)
  assert.match(data.as_of, ISO_DATE)
  assert.equal(data.count, data.schemes.length)
  assert.ok(data.schemes.length >= 30, 'at least 30 schemes')
})

check('ids are unique, lowercase slugs', () => {
  const seen = new Set<string>()
  each((s) => {
    assert.match(s.id, /^[a-z0-9-]+$/)
    assert.ok(!seen.has(s.id), 'duplicate id')
    seen.add(s.id)
  })
})

check('names and summaries exist in English and Hindi', () => {
  each((s) => {
    assert.ok(s.name.trim() && s.summary.trim(), 'English name / summary')
    assert.ok(DEVANAGARI.test(s.name_hi), 'name_hi must be in Hindi')
    assert.ok(DEVANAGARI.test(s.summary_hi), 'summary_hi must be in Hindi')
    assert.ok(s.ministry.trim(), 'ministry')
  })
})

check('categories, states and benefit types use the known vocabulary', () => {
  each((s) => {
    assert.ok(s.categories.includes(s.category), 'category must be in categories')
    for (const c of s.categories) assert.ok(c in CATEGORY_HI, `unknown category ${c}`)
    for (const st of s.states) assert.ok(st in STATE_HI, `unknown state ${st}`)
    assert.equal(s.scope === 'state', s.states.length > 0, 'state schemes list their states; central schemes list none')
    assert.ok(s.benefit_types.length > 0)
    for (const b of s.benefit_types) assert.ok(BENEFITS.includes(b), `unknown benefit type ${b}`)
  })
})

check('every scheme has benefits, eligibility and a way to apply', () => {
  each((s) => {
    assert.ok(s.benefits.length > 0, 'benefits')
    assert.ok(s.eligibility.length > 0, 'eligibility')
    assert.ok(s.application.online.length + s.application.offline.length > 0, 'application steps')
    if (s.application.mode === 'online') assert.ok(s.application.online.length > 0)
    if (s.application.mode === 'offline') assert.ok(s.application.offline.length > 0)
  })
})

check('documents have Hindi labels', () => {
  each((s) => {
    for (const d of s.documents) assert.ok(d in DOCUMENT_HI, `add a Hindi label for "${d}" in dataTerms.ts`)
  })
})

check('rules use known fields and operators', () => {
  each((s) => {
    assert.ok(s.criteria.length > 0, 'criteria')
    for (const c of s.criteria) {
      assert.ok(FIELDS.includes(c.field), `unknown field ${c.field}`)
      assert.ok(OPS.includes(c.op), `unknown op ${c.op}`)
      assert.ok(c.label.trim(), 'criterion label')
      assert.ok(c.weight > 0, 'weight > 0')
      if (c.op === 'between') assert.ok(Array.isArray(c.value) && c.value.length === 2, 'between needs [min, max]')
      if (c.op === 'in' || c.op === 'not_in') assert.ok(Array.isArray(c.value) && c.value.length > 0, 'in needs a list')
      if (c.op === 'is_true' || c.op === 'is_false') assert.equal(c.value, undefined, 'boolean ops take no value')
    }
  })
})

check('every scheme cites an official source and a check date', () => {
  each((s) => {
    assert.ok(s.sources.length > 0, 'sources')
    for (const src of s.sources) {
      const url = new URL(src.url)
      assert.ok(OFFICIAL_HOST.test(url.hostname), `not an official host: ${url.hostname}`)
      assert.ok(src.title.trim(), 'source title')
      if (src.date) assert.match(src.date, ISO_DATE)
    }
    assert.match(s.verified, ISO_DATE)
    if (s.apply_url) assert.ok(OFFICIAL_HOST.test(new URL(s.apply_url).hostname), `apply_url host: ${s.apply_url}`)
  })
})

check('"needs re-check" schemes say why', () => {
  each((s) => {
    assert.ok(s.status === 'verified' || s.status === 'needs_recheck')
    if (s.status === 'needs_recheck') assert.ok(s.notes.length > 0, 'add a note explaining what to re-check')
  })
})

check('deadlines are well formed', () => {
  each((s) => {
    if (s.deadline.type === 'date') assert.match(s.deadline.date ?? '', ISO_DATE)
    if (s.deadline.type === 'relative') assert.ok(s.deadline.text?.trim(), 'relative deadline needs text')
  })
})

console.log(`\n${passed} data checks passed (${data.schemes.length} schemes)`)

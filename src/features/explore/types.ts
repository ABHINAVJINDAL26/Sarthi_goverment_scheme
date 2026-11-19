/**
 * One scheme in the curated dataset (public/data/schemes.json).
 *
 * The dataset is written by hand from official sources (ministry / scheme portals,
 * PIB releases, official guideline PDFs). Every scheme lists its sources and the
 * date they were checked. See README "Scheme data" for how to add or update one.
 */

export type BenefitType =
  | 'cash'
  | 'pension'
  | 'insurance'
  | 'loan'
  | 'subsidy'
  | 'scholarship'
  | 'savings'
  | 'in_kind'
  | 'training'

/** Profile fields the rule engine (F4) will read. Units are in the field name. */
export type CriterionField =
  | 'age'
  | 'gender'
  | 'state'
  | 'residence' // 'rural' | 'urban'
  | 'income_annual' // household, ₹ per year
  | 'income_monthly' // individual, ₹ per month
  | 'occupation'
  | 'caste' // 'SC' | 'ST' | 'OBC' | 'EWS' | 'General'
  | 'marital_status' // 'widow' | 'unmarried' | ...
  | 'bpl'
  | 'nfsa_ration_card'
  | 'secc_listed'
  | 'disability_percent'
  | 'land_hectares'
  | 'owns_agri_land'
  | 'income_tax_payer'
  | 'govt_employee'
  | 'epfo_esic_nps_member'
  | 'has_bank_account'
  | 'has_pucca_house'
  | 'pregnant_or_lactating'
  | 'student_class'
  | 'owns_house'
  | 'has_electricity_connection'

export type CriterionOp = 'gte' | 'lte' | 'eq' | 'neq' | 'in' | 'not_in' | 'between' | 'is_true' | 'is_false'

/** One machine-readable eligibility rule. `mandatory` rules gate "Eligible"; `weight` feeds ranking (F5). */
export interface Criterion {
  field: CriterionField
  op: CriterionOp
  value?: number | string | boolean | Array<number | string>
  mandatory: boolean
  weight: number
  /** Plain-language version shown to people, e.g. "Age 18 to 40 years". */
  label: string
}

export interface Source {
  title: string
  url: string
  /** Date printed on the page or document, if any (ISO). */
  date?: string | null
}

export interface Scheme {
  id: string
  name: string
  name_hi: string
  short_name: string | null
  ministry: string
  scope: 'central' | 'state'
  /** Empty for central schemes (= all India). */
  states: string[]
  category: string
  categories: string[]
  benefit_types: BenefitType[]

  summary: string
  summary_hi: string
  benefits: string[]
  eligibility: string[]
  exclusions: string[]
  criteria: Criterion[]
  documents: string[]
  application: { mode: 'online' | 'offline' | 'both'; online: string[]; offline: string[] }
  faqs: Array<{ q: string; a: string }>
  apply_url: string | null
  helpline: string | null
  sources: Source[]
  deadline: { type: 'ongoing' | 'date' | 'relative'; date: string | null; text: string | null }

  /** Quick filter fields, kept in sync with `criteria`. null / empty = no rule. */
  age_min: number | null
  age_max: number | null
  gender: 'female' | null
  income_max: number | null
  castes: string[]
  occupations: string[]
  requires_bpl: boolean
  requires_disability: boolean

  /** Date the sources were last checked (ISO). */
  verified: string
  /** needs_recheck = official pages conflict or are incomplete; `notes` says what. */
  status: 'verified' | 'needs_recheck'
  notes: string[]
}

export interface SchemesPayload {
  version: number
  as_of: string
  count: number
  schemes: Scheme[]
}

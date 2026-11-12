/** One scheme as exported by the AI pipeline (ai/sarthi_ai/pipeline.py -> public/data/schemes.json). */
export interface Scheme {
  id: string
  name: string
  category: string
  categories: string[]
  scope: 'central' | 'state'
  /** Empty for central schemes (= all India). */
  states: string[]
  /** null = no rule recorded (the rule engine treats it as UNKNOWN). */
  age_min: number | null
  age_max: number | null
  gender: string | null
  income_max: number | null
  /** Empty = open to all categories. */
  castes: string[]
  /** Empty = any occupation. */
  occupations: string[]
  requires_bpl: boolean
  requires_disability: boolean
  documents: string[]
  other_documents: string[]
  deadline: { type: 'ongoing' | 'date' | 'relative'; date: string | null; text: string | null }
  apply_url: string | null
  source_url: string | null
  verified: string
  stale: boolean
  flags: string[]
}

export interface SchemesPayload {
  as_of: string
  count: number
  schemes: Scheme[]
}

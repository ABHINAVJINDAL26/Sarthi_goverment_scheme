import type { I18n } from '../../i18n'
import type { BenefitType, Scheme } from './types'

/** "Who is it for" groups. Labels come from i18n (AUDIENCE_TERMS). */
export const AUDIENCES: Array<{ id: string; test: (s: Scheme) => boolean }> = [
  { id: 'women', test: (s) => s.gender === 'female' || s.categories.includes('Women & Child Development') },
  { id: 'students', test: (s) => s.occupations.includes('student') || s.categories.includes('Education & Learning') },
  { id: 'farmers', test: (s) => s.occupations.includes('farmer') || s.categories.includes('Agriculture & Farming') },
  {
    id: 'workers',
    test: (s) => ['unorganised_worker', 'street_vendor', 'artisan'].some((o) => s.occupations.includes(o)),
  },
  { id: 'business', test: (s) => s.occupations.includes('entrepreneur') || s.categories.includes('Business & Entrepreneurship') },
  { id: 'disability', test: (s) => s.requires_disability || s.categories.includes('Disability & Rehabilitation') },
  { id: 'senior', test: (s) => s.categories.includes('Senior Citizens') || (s.age_min !== null && s.age_min >= 58) },
  { id: 'scst', test: (s) => s.castes.some((c) => c === 'SC' || c === 'ST') },
  { id: 'bpl', test: (s) => s.requires_bpl },
]

export const BENEFIT_TYPES: BenefitType[] = [
  'cash', 'pension', 'insurance', 'loan', 'subsidy', 'scholarship', 'savings', 'in_kind', 'training',
]

/** Scheme name in the current language. */
export function schemeName(s: Scheme, i: I18n): string {
  return i.lang === 'hi' ? s.name_hi : s.name
}

/** One-line summary in the current language. */
export function schemeSummary(s: Scheme, i: I18n): string {
  return i.lang === 'hi' ? s.summary_hi : s.summary
}

export function placeLabel(s: Scheme, i: I18n): string {
  return s.scope === 'state' ? s.states.map(i.stateName).join(', ') : i.t('place.allIndia')
}

/** Up to `max` short tags for a card: who it is for, then the kind of benefit. */
export function cardTags(s: Scheme, i: I18n, max = 3): string[] {
  const tags: string[] = []
  if (s.gender === 'female') tags.push(i.audience('women'))
  tags.push(...s.occupations.map(i.occupation))
  if (s.castes.length) tags.push(s.castes.join('/'))
  if (s.requires_disability) tags.push(i.audience('disability'))
  if (s.requires_bpl) tags.push('BPL')
  if (s.age_min !== null && s.age_min >= 58) tags.push(`${s.age_min}+`)
  tags.push(...s.benefit_types.map(i.benefit))
  return [...new Set(tags)].slice(0, max)
}

export function deadlineLabel(s: Scheme, i: I18n): string {
  if (s.deadline.type === 'ongoing') return i.t('deadline.ongoing')
  if (s.deadline.type === 'date' && s.deadline.date) {
    const date = i.date(s.deadline.date)
    const today = new Date().toISOString().slice(0, 10)
    return i.t(s.deadline.date < today ? 'deadline.closed' : 'deadline.until', { date })
  }
  return s.deadline.text ?? i.t('deadline.seeOfficial')
}

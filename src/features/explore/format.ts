import type { I18n } from '../../i18n'
import type { Scheme } from './types'

/** "Who is it for" groups. Labels come from i18n (AUDIENCE_TERMS). */
export const AUDIENCES: Array<{ id: string; test: (s: Scheme) => boolean }> = [
  { id: 'women', test: (s) => s.gender === 'female' || s.categories.includes('Women & Child Development') },
  { id: 'students', test: (s) => s.occupations.includes('student') || s.categories.includes('Education & Learning') },
  { id: 'farmers', test: (s) => s.occupations.includes('farmer') || s.categories.includes('Agriculture & Farming') },
  { id: 'workers', test: (s) => s.occupations.includes('construction_worker') },
  { id: 'business', test: (s) => s.occupations.includes('entrepreneur') || s.categories.includes('Business & Entrepreneurship') },
  { id: 'disability', test: (s) => s.requires_disability || s.categories.includes('Disability & Rehabilitation') },
  { id: 'senior', test: (s) => s.categories.includes('Senior Citizens') || (s.age_min !== null && s.age_min >= 60) },
  { id: 'scst', test: (s) => s.castes.some((c) => c === 'SC' || c === 'ST') },
  { id: 'bpl', test: (s) => s.requires_bpl },
]

const rupee = (n: number) => '₹' + n.toLocaleString('en-IN')

export function placeLabel(s: Scheme, i: I18n): string {
  return s.scope === 'state' ? s.states.map(i.stateName).join(', ') : i.t('place.allIndia')
}

/** Plain-language eligibility lines built from the structured rules. */
export function eligibilityLines(s: Scheme, i: I18n): string[] {
  const lines: string[] = []
  if (s.age_min !== null && s.age_max !== null) lines.push(i.t('rule.ageRange', { min: s.age_min, max: s.age_max }))
  else if (s.age_min !== null) lines.push(i.t('rule.ageMin', { min: s.age_min }))
  else if (s.age_max !== null) lines.push(i.t('rule.ageMax', { max: s.age_max }))
  if (s.gender === 'female') lines.push(i.t('rule.women'))
  if (s.income_max !== null) {
    const monthly = s.flags.includes('income_possibly_monthly')
    lines.push(i.t(monthly ? 'rule.incomeMonthly' : 'rule.income', { amount: rupee(s.income_max) }))
  }
  if (s.castes.length) lines.push(i.t('rule.castes', { castes: s.castes.join(', ') }))
  if (s.occupations.length) lines.push(i.t('rule.occupations', { list: s.occupations.map(i.occupation).join(', ') }))
  if (s.requires_bpl) lines.push(i.t('rule.bpl'))
  if (s.requires_disability) lines.push(i.t('rule.disability'))
  lines.push(s.scope === 'state'
    ? i.t('rule.residents', { states: s.states.map(i.stateName).join(', ') })
    : i.t('rule.allIndia'))
  return lines
}

/** Up to `max` short tags for a card. */
export function cardTags(s: Scheme, i: I18n, max = 3): string[] {
  const tags: string[] = []
  if (s.gender === 'female') tags.push(i.audience('women'))
  tags.push(...s.occupations.map(i.occupation))
  if (s.castes.length) tags.push(s.castes.join('/'))
  if (s.requires_disability) tags.push(i.audience('disability'))
  if (s.requires_bpl) tags.push('BPL')
  if (s.age_min !== null && s.age_min >= 60) tags.push('60+')
  return [...new Set(tags)].slice(0, max)
}

export function deadlineLabel(s: Scheme, i: I18n): string {
  if (s.deadline.type === 'ongoing') return i.t('deadline.ongoing')
  if (s.deadline.type === 'date' && s.deadline.date) {
    const date = i.date(s.deadline.date)
    return i.t(s.flags.includes('deadline_passed') ? 'deadline.closed' : 'deadline.applyBy', { date })
  }
  return s.deadline.text ?? i.t('deadline.seeOfficial')
}

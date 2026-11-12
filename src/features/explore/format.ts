import type { Scheme } from './types'

export const OCCUPATION_LABELS: Record<string, string> = {
  student: 'Students',
  farmer: 'Farmers',
  entrepreneur: 'Entrepreneurs',
  unemployed: 'Job seekers',
  artisan: 'Artisans',
  construction_worker: 'Construction workers',
}

/** "Who is it for" quick filters. */
export const AUDIENCES: Array<{ id: string; label: string; test: (s: Scheme) => boolean }> = [
  { id: 'women', label: 'Women & girls', test: (s) => s.gender === 'female' || s.categories.includes('Women & Child Development') },
  { id: 'students', label: 'Students', test: (s) => s.occupations.includes('student') || s.categories.includes('Education & Learning') },
  { id: 'farmers', label: 'Farmers', test: (s) => s.occupations.includes('farmer') || s.categories.includes('Agriculture & Farming') },
  { id: 'workers', label: 'Construction workers', test: (s) => s.occupations.includes('construction_worker') },
  { id: 'business', label: 'Entrepreneurs', test: (s) => s.occupations.includes('entrepreneur') || s.categories.includes('Business & Entrepreneurship') },
  { id: 'disability', label: 'Persons with disability', test: (s) => s.requires_disability || s.categories.includes('Disability & Rehabilitation') },
  { id: 'senior', label: 'Senior citizens', test: (s) => s.categories.includes('Senior Citizens') || (s.age_min !== null && s.age_min >= 60) },
  { id: 'scst', label: 'SC / ST', test: (s) => s.castes.some((c) => c === 'SC' || c === 'ST') },
  { id: 'bpl', label: 'BPL families', test: (s) => s.requires_bpl },
]

const rupee = (n: number) => '₹' + n.toLocaleString('en-IN')

export function placeLabel(s: Scheme): string {
  return s.scope === 'state' ? s.states.join(', ') : 'All India'
}

/** Plain-language eligibility lines built from the structured rules. */
export function eligibilityLines(s: Scheme): string[] {
  const lines: string[] = []
  if (s.age_min !== null && s.age_max !== null) lines.push(`Age ${s.age_min} to ${s.age_max} years`)
  else if (s.age_min !== null) lines.push(`Age ${s.age_min} years or more`)
  else if (s.age_max !== null) lines.push(`Age up to ${s.age_max} years`)
  if (s.gender === 'female') lines.push('Women and girls only')
  if (s.income_max !== null) {
    const monthly = s.flags.includes('income_possibly_monthly')
    lines.push(`Family income up to ${rupee(s.income_max)}${monthly ? ' (may be a monthly limit; check the official page)' : ' a year'}`)
  }
  if (s.castes.length) lines.push(`For ${s.castes.join(', ')} category`)
  if (s.occupations.length) lines.push(`For ${s.occupations.map((o) => OCCUPATION_LABELS[o] ?? o).join(', ')}`)
  if (s.requires_bpl) lines.push('BPL / ration card holders')
  if (s.requires_disability) lines.push('Persons with disability (certificate needed)')
  lines.push(s.scope === 'state' ? `Residents of ${s.states.join(', ')}` : 'Open across India')
  return lines
}

/** Up to `max` short tags for a card. */
export function cardTags(s: Scheme, max = 3): string[] {
  const tags: string[] = []
  if (s.gender === 'female') tags.push('Women')
  if (s.occupations.length) tags.push(...s.occupations.map((o) => OCCUPATION_LABELS[o] ?? o))
  if (s.castes.length) tags.push(s.castes.join('/'))
  if (s.requires_disability) tags.push('Disability')
  if (s.requires_bpl) tags.push('BPL')
  if (s.age_min !== null && s.age_min >= 60) tags.push('60+')
  return tags.slice(0, max)
}

export function deadlineLabel(s: Scheme): string {
  if (s.deadline.type === 'ongoing') return 'Open all year'
  if (s.deadline.type === 'date' && s.deadline.date) {
    const d = new Date(s.deadline.date + 'T00:00:00')
    const text = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    return s.flags.includes('deadline_passed') ? `Closed on ${text}` : `Apply by ${text}`
  }
  return s.deadline.text ?? 'See official page'
}

export function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

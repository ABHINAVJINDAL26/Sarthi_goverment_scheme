/**
 * Smart scheme search that runs fully in the browser (no backend needed).
 *
 *  - Hindi / Hinglish / English: query words are expanded with a synonym
 *    dictionary ("kisan", "किसान" -> farmer, agriculture ...).
 *  - Typo tolerance: unknown words are matched to the closest indexed word
 *    (edit distance 1, or 2 for long words) and by prefix.
 *  - Ranking: TF-IDF style score, weighted by field (name > category > ...),
 *    with a bonus when every query word matched.
 *  - Explainable: each result lists the words that matched, so the UI can
 *    show "Matched: scholarship, girl".
 *
 * Pure TypeScript with no React or DOM, so the future Express backend can reuse it.
 */
import type { Scheme } from './types'

// ---------------------------------------------------------------------------
// Text normalisation
// ---------------------------------------------------------------------------

// Letters, combining marks (Devanagari matras) and digits.
const TOKEN_RE = /[\p{L}\p{M}\p{N}]+/gu

export function normalize(text: string): string {
  // Drop the Devanagari nukta so "मज़दूर" and "मजदूर" match (people type both).
  return text.normalize('NFKC').toLowerCase().replace(/़/g, '')
}

export function tokenize(text: string): string[] {
  return normalize(text).match(TOKEN_RE) ?? []
}

const STOPWORDS = new Set([
  // English
  'a', 'an', 'the', 'of', 'for', 'to', 'and', 'or', 'in', 'on', 'with', 'by', 'is', 'my', 'me', 'i',
  'scheme', 'schemes', 'yojana', 'yojna', 'programme', 'program',
  // Hinglish
  'ke', 'ki', 'ka', 'ko', 'liye', 'lie', 'hai', 'hain', 'mein', 'me', 'aur', 'se', 'wala', 'wali',
  'mujhe', 'mera', 'meri', 'kya', 'koi', 'chahiye',
  // Hindi
  'के', 'की', 'का', 'को', 'लिए', 'है', 'हैं', 'में', 'और', 'से', 'योजना', 'मुझे', 'मेरा', 'मेरी', 'क्या', 'कोई', 'चाहिए',
])

// ---------------------------------------------------------------------------
// Synonyms: Hindi / Hinglish / everyday words -> words used in scheme data
// ---------------------------------------------------------------------------

const SYNONYM_GROUPS: Array<[string[], string[]]> = [
  [['padhai', 'padhna', 'shiksha', 'शिक्षा', 'पढ़ाई', 'पढ़ाई', 'vidyarthi', 'chhatra', 'छात्र', 'विद्यार्थी', 'chhatravriti', 'छात्रवृत्ति', 'vazifa', 'study', 'studies'],
    ['scholarship', 'education', 'student', 'students', 'school', 'college', 'fellowship', 'chhatravriti']],
  [['kisan', 'किसान', 'krishi', 'कृषि', 'kheti', 'खेती', 'fasal', 'फसल', 'farming', 'kisaan'],
    ['farmer', 'farmers', 'agriculture', 'krishi', 'crop', 'farm', 'kisan', 'irrigation']],
  [['beti', 'बेटी', 'ladki', 'लड़की', 'लड़की', 'kanya', 'कन्या', 'mahila', 'महिला', 'aurat', 'औरत', 'stree', 'स्त्री', 'nari', 'नारी', 'female'],
    ['girl', 'girls', 'daughter', 'daughters', 'women', 'woman', 'mahila', 'kanya', 'female']],
  [['vidhwa', 'vidhva', 'विधवा'], ['widow', 'widows']],
  [['budhapa', 'बुढ़ापा', 'vridh', 'vriddh', 'वृद्ध', 'वृद्धावस्था', 'buzurg', 'बुजुर्ग', 'old', 'elderly'],
    ['old', 'senior', 'citizen', 'elderly', 'aged', 'vriddh', 'pension']],
  [['viklang', 'विकलांग', 'divyang', 'दिव्यांग', 'handicap', 'handicapped', 'apang'],
    ['disabled', 'disability', 'disabilities', 'differently', 'abled', 'divyang', 'divyangjan']],
  [['ghar', 'घर', 'makan', 'मकान', 'awas', 'आवास', 'home'], ['house', 'housing', 'awas', 'construction']],
  [['naukri', 'नौकरी', 'rozgar', 'रोजगार', 'रोज़गार', 'berozgar', 'बेरोजगार', 'kaam', 'job', 'jobs'],
    ['employment', 'job', 'skill', 'training', 'unemployed', 'self', 'rozgar']],
  [['ilaj', 'ilaaj', 'इलाज', 'dawai', 'दवाई', 'aspatal', 'अस्पताल', 'swasthya', 'स्वास्थ्य', 'bimari', 'बीमारी', 'medical'],
    ['health', 'medical', 'treatment', 'hospital', 'disease', 'insurance']],
  [['vyapar', 'व्यापार', 'dhandha', 'धंधा', 'karobar', 'udyog', 'उद्योग', 'karz', 'karza', 'कर्ज', 'rin', 'ऋण', 'startup', 'dukan', 'दुकान'],
    ['business', 'entrepreneur', 'entrepreneurs', 'loan', 'enterprise', 'industry', 'industries', 'credit', 'subsidy']],
  [['shaadi', 'shadi', 'शादी', 'vivah', 'विवाह'], ['marriage', 'vivah']],
  [['pension', 'पेंशन', 'pensan'], ['pension']],
  [['paisa', 'पैसा', 'sahayata', 'सहायता', 'madad', 'मदद', 'arthik', 'आर्थिक', 'money'],
    ['financial', 'assistance', 'grant', 'aid']],
  [['maut', 'mrityu', 'मृत्यु', 'antim', 'अंतिम'], ['death', 'funeral']],
  [['mazdoor', 'majdoor', 'मजदूर', 'shramik', 'श्रमिक', 'labour', 'labor', 'nirman', 'निर्माण'],
    ['construction', 'worker', 'workers', 'labour', 'shramik', 'bocw']],
  [['machhua', 'machhuara', 'मछुआरा', 'machli', 'मछली', 'fisherman'], ['fish', 'fisher', 'fishermen', 'fishing', 'fisheries']],
  [['garbhvati', 'गर्भवती', 'prasav', 'प्रसव', 'pregnant', 'pregnancy'], ['maternity', 'pregnant', 'mother']],
  [['bachcha', 'bachche', 'बच्चा', 'बच्चे', 'shishu', 'शिशु', 'baccha'], ['child', 'children']],
  [['dalit', 'दलित'], ['sc', 'scheduled', 'caste', 'castes']],
  [['adivasi', 'आदिवासी', 'janjati', 'जनजाति', 'tribal'], ['st', 'scheduled', 'tribe', 'tribes', 'tribal']],
  [['pashu', 'पशु', 'gaay', 'gay', 'गाय', 'bhains', 'dairy', 'doodh', 'दूध'], ['cattle', 'dairy', 'livestock', 'milk', 'animal']],
  [['kalakar', 'कलाकार', 'artist'], ['artist', 'artists', 'artisan', 'artisans', 'culture']],
  [['khel', 'खेल', 'khiladi', 'खिलाड़ी'], ['sports', 'sport', 'games']],
]

// Hindi names of states, so "राजस्थान" finds Rajasthan schemes.
const STATE_ALIASES: Record<string, string[]> = {
  'उत्तर': ['uttar'], 'प्रदेश': ['pradesh'], 'up': ['uttar', 'pradesh'], 'mp': ['madhya', 'pradesh'],
  'बिहार': ['bihar'], 'राजस्थान': ['rajasthan'], 'महाराष्ट्र': ['maharashtra'], 'गुजरात': ['gujarat'],
  'केरल': ['kerala'], 'पंजाब': ['punjab'], 'हरियाणा': ['haryana'], 'मध्य': ['madhya'], 'दिल्ली': ['delhi'],
  'तमिलनाडु': ['tamil', 'nadu'], 'कर्नाटक': ['karnataka'], 'ओडिशा': ['odisha'], 'असम': ['assam'], 'गोवा': ['goa'],
}

const SYNONYMS = new Map<string, string[]>()
for (const [keys, targets] of SYNONYM_GROUPS) {
  for (const key of keys) {
    const k = normalize(key)
    SYNONYMS.set(k, [...new Set([...(SYNONYMS.get(k) ?? []), ...targets])])
  }
}
for (const [key, targets] of Object.entries(STATE_ALIASES)) SYNONYMS.set(normalize(key), targets)

// ---------------------------------------------------------------------------
// Index
// ---------------------------------------------------------------------------

/** How much a word counts depending on where it appears in a scheme. */
const FIELD_WEIGHTS = { name: 3, category: 2, occupation: 1.6, state: 1.6, caste: 1.2, document: 0.4 } as const

interface IndexedScheme {
  scheme: Scheme
  terms: Map<string, number> // token -> best field weight
  nameNorm: string
}

export interface SearchIndex {
  docs: IndexedScheme[]
  idf: Map<string, number>
  vocab: string[]
}

function addTerms(terms: Map<string, number>, text: string, weight: number) {
  for (const t of tokenize(text)) {
    if (STOPWORDS.has(t)) continue
    if ((terms.get(t) ?? 0) < weight) terms.set(t, weight)
  }
}

export function buildIndex(schemes: Scheme[]): SearchIndex {
  const docs = schemes.map((scheme) => {
    const terms = new Map<string, number>()
    addTerms(terms, scheme.name, FIELD_WEIGHTS.name)
    addTerms(terms, scheme.categories.join(' '), FIELD_WEIGHTS.category)
    addTerms(terms, scheme.occupations.join(' ').replace(/_/g, ' '), FIELD_WEIGHTS.occupation)
    addTerms(terms, scheme.states.join(' '), FIELD_WEIGHTS.state)
    addTerms(terms, scheme.castes.join(' '), FIELD_WEIGHTS.caste)
    addTerms(terms, [...scheme.documents, ...scheme.other_documents].join(' '), FIELD_WEIGHTS.document)
    if (scheme.gender === 'female') addTerms(terms, 'women female', FIELD_WEIGHTS.occupation)
    if (scheme.requires_disability) addTerms(terms, 'disability disabled', FIELD_WEIGHTS.occupation)
    return { scheme, terms, nameNorm: normalize(scheme.name) }
  })
  const df = new Map<string, number>()
  for (const d of docs) for (const t of d.terms.keys()) df.set(t, (df.get(t) ?? 0) + 1)
  const n = docs.length
  const idf = new Map<string, number>()
  for (const [t, count] of df) idf.set(t, Math.log(1 + (n - count + 0.5) / (count + 0.5)))
  return { docs, idf, vocab: [...df.keys()] }
}

// ---------------------------------------------------------------------------
// Query expansion
// ---------------------------------------------------------------------------

/** Damerau-Levenshtein distance with an early exit above `max`. */
export function editDistance(a: string, b: string, max = 2): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  const prev2 = new Array(b.length + 1).fill(0)
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1)
      cur.push(v)
      rowMin = Math.min(rowMin, v)
    }
    if (rowMin > max) return max + 1
    prev2.splice(0, prev2.length, ...prev)
    prev = cur
  }
  return prev[b.length]
}

/** One query word and the index words it may match, each with a confidence (0-1). */
export interface QueryGroup {
  word: string
  variants: Map<string, number>
}

export function expandQuery(query: string, index: SearchIndex): QueryGroup[] {
  const idfHas = (t: string) => index.idf.has(t)
  const groups: QueryGroup[] = []
  for (const word of tokenize(query)) {
    if (STOPWORDS.has(word)) continue
    const variants = new Map<string, number>()
    const add = (t: string, w: number) => { if (idfHas(t) && (variants.get(t) ?? 0) < w) variants.set(t, w) }

    add(word, 1)
    for (const syn of SYNONYMS.get(word) ?? []) add(syn, 0.9)

    if (variants.size === 0 && word.length >= 3) {
      // Typo tolerance and prefix ("scholar" -> "scholarship").
      const maxDist = word.length >= 8 ? 2 : word.length >= 4 ? 1 : 0
      for (const v of index.vocab) {
        if (v.startsWith(word) && v.length > word.length) add(v, 0.8)
        else if (maxDist > 0 && editDistance(word, v, maxDist) <= maxDist) add(v, 0.75)
      }
      // A typo of a synonym key ("kissan" -> "kisan").
      for (const [key, targets] of SYNONYMS) {
        if (word.length >= 4 && editDistance(word, key, 1) <= 1) for (const t of targets) add(t, 0.7)
      }
    }
    groups.push({ word, variants })
  }
  return groups
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface SearchHit {
  scheme: Scheme
  score: number
  /** Index words that matched, for "Matched: ..." chips. */
  matched: string[]
  /** True when every query word found a match in this scheme. */
  matchedAll: boolean
}

/** If at least this many schemes match every query word, partial matches are dropped. */
const MIN_FULL_MATCHES = 5

export function search(index: SearchIndex, query: string, limit = Infinity): SearchHit[] {
  const groups = expandQuery(query, index).filter((g) => g.variants.size > 0)
  if (groups.length === 0) return []
  const phrase = normalize(query).trim()
  const hits: SearchHit[] = []

  for (const doc of index.docs) {
    let score = 0
    let groupsMatched = 0
    const matched: string[] = []
    for (const g of groups) {
      let best = 0
      let bestTerm = ''
      for (const [term, conf] of g.variants) {
        const fieldWeight = doc.terms.get(term)
        if (!fieldWeight) continue
        const s = conf * fieldWeight * (index.idf.get(term) ?? 0)
        if (s > best) { best = s; bestTerm = term }
      }
      if (best > 0) { score += best; groupsMatched++; matched.push(bestTerm) }
    }
    if (score === 0) continue
    score *= 0.5 + 0.5 * (groupsMatched / groups.length) // prefer schemes matching every word
    if (phrase.length > 3 && doc.nameNorm.includes(phrase)) score *= 1.5
    hits.push({ scheme: doc.scheme, score, matched: [...new Set(matched)], matchedAll: groupsMatched === groups.length })
  }
  hits.sort((a, b) => b.score - a.score || a.scheme.name.localeCompare(b.scheme.name))
  // "beti ki padhai" should list girls' education schemes, not every education scheme.
  const full = hits.filter((h) => h.matchedAll)
  return (full.length >= MIN_FULL_MATCHES ? full : hits).slice(0, limit)
}

/**
 * Search checks on the real dataset. No test framework needed (Node 22.18+ runs TypeScript):
 *   node src/features/explore/search.test.ts
 */
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { buildIndex, editDistance, search, tokenize } from './search.ts'
import type { SchemesPayload } from './types.ts'

const data: SchemesPayload = JSON.parse(readFileSync(new URL('../../../public/data/schemes.json', import.meta.url), 'utf8'))
const index = buildIndex(data.schemes)
let passed = 0

function check(name: string, fn: () => void) {
  fn()
  passed++
  console.log('ok -', name)
}

const ids = (query: string, k = 5) => search(index, query, k).map((h) => h.scheme.id)

/** Share of the top-k results that satisfy `pred`. */
function topShare(query: string, pred: (cats: string[], id: string) => boolean, k = 5) {
  const hits = search(index, query, k)
  assert.ok(hits.length > 0, `no results for "${query}"`)
  return hits.filter((h) => pred(h.scheme.categories, h.scheme.id)).length / hits.length
}

check('tokenizer keeps Devanagari matras together and drops the nukta', () => {
  assert.deepEqual(tokenize('बेटी की पढ़ाई'), ['बेटी', 'की', 'पढाई'])
})

check('edit distance handles typos and transpositions', () => {
  assert.equal(editDistance('scholarship', 'scholarhsip'), 1)
  assert.equal(editDistance('kisan', 'kissan'), 1)
  assert.ok(editDistance('pension', 'tractor') > 2)
})

check('English query: "scholarship" returns education schemes', () => {
  assert.ok(topShare('scholarship', (c) => c.includes('Education & Learning'), 2) === 1)
})

check('short name: "pm kisan" puts PM-KISAN first', () => {
  assert.equal(ids('pm kisan')[0], 'pm-kisan')
})

check('Hindi: "किसान" finds farmer schemes', () => {
  assert.ok(topShare('किसान', (c) => c.includes('Agriculture & Farming'), 4) >= 0.75)
})

check('Hindi: "विधवा पेंशन" finds widow pension', () => {
  const top = ids('विधवा पेंशन', 3)
  assert.ok(top.includes('ignwps') || top.includes('pb-widow-destitute'), top.join(' | '))
})

check('Hindi scheme name: "आयुष्मान" finds the Ayushman schemes', () => {
  const top = ids('आयुष्मान', 3)
  assert.ok(top.includes('ab-pmjay') && top.includes('ayushman-vay-vandana'), top.join(' | '))
})

check('typo: "scholarhsip" still finds scholarships', () => {
  assert.ok(topShare('scholarhsip', (c) => c.includes('Education & Learning'), 2) === 1)
})

check('typo in Hinglish key: "kissan" behaves like "kisan"', () => {
  assert.ok(topShare('kissan', (c) => c.includes('Agriculture & Farming'), 4) >= 0.75)
})

check('Hinglish: "ilaj" finds health cover', () => {
  assert.ok(topShare('ilaj', (c) => c.includes('Health & Wellness'), 3) >= 0.66)
})

check('Hinglish: "gas connection" finds Ujjwala', () => {
  assert.equal(ids('gas connection')[0], 'pmuy')
})

check('Hinglish: "rehdi loan" finds PM SVANidhi', () => {
  assert.equal(ids('rehdi loan')[0], 'pm-svanidhi')
})

check('Hinglish: "bijli" finds rooftop solar', () => {
  assert.ok(ids('bijli', 3).includes('pm-surya-ghar'))
})

check('state words: "punjab pension" ranks Punjab schemes first', () => {
  const [top] = search(index, 'punjab pension', 1)
  assert.ok(top.scheme.states.includes('Punjab'), top.scheme.name)
})

check('nukta-insensitive: "मज़दूर" and "मजदूर" give the same results', () => {
  const a = ids('मज़दूर', 10)
  const b = ids('मजदूर', 10)
  assert.ok(a.length > 0)
  assert.deepEqual(a, b)
})

check('results explain what matched', () => {
  const [hit] = search(index, 'kisan', 1)
  assert.ok(hit.matched.length > 0)
})

check('stopword-only or empty query returns nothing', () => {
  assert.equal(search(index, '').length, 0)
  assert.equal(search(index, 'ke liye').length, 0)
})

console.log(`\n${passed} search checks passed`)

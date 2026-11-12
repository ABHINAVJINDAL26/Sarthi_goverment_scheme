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

/** Share of the top-k results that satisfy `pred`. */
function topShare(query: string, pred: (name: string, cats: string[]) => boolean, k = 10) {
  const hits = search(index, query, k)
  assert.ok(hits.length > 0, `no results for "${query}"`)
  return hits.filter((h) => pred(h.scheme.name.toLowerCase(), h.scheme.categories)).length / hits.length
}

check('tokenizer keeps Devanagari matras together', () => {
  assert.deepEqual(tokenize('बेटी की पढ़ाई'), ['बेटी', 'की', 'पढ़ाई'])
})

check('edit distance handles typos and transpositions', () => {
  assert.equal(editDistance('scholarship', 'scholarhsip'), 1)
  assert.equal(editDistance('kisan', 'kissan'), 1)
  assert.ok(editDistance('pension', 'tractor') > 2)
})

check('English query: "scholarship" returns education schemes', () => {
  assert.ok(topShare('scholarship', (_, c) => c.includes('Education & Learning')) >= 0.9)
})

check('Hinglish: "beti ki padhai" finds girl / education schemes', () => {
  assert.ok(topShare('beti ki padhai', (n, c) => /girl|daughter|women|kanya|beti/.test(n) || c.includes('Education & Learning')) >= 0.8)
})

check('Hindi: "किसान" finds farmer schemes', () => {
  assert.ok(topShare('किसान', (_, c) => c.includes('Agriculture & Farming')) >= 0.8)
})

check('Hindi: "विधवा पेंशन" finds widow pension', () => {
  const top = search(index, 'विधवा पेंशन', 3).map((h) => h.scheme.name.toLowerCase())
  assert.ok(top.some((n) => n.includes('widow') && n.includes('pension')), top.join(' | '))
})

check('typo: "scholarhsip" still finds scholarships', () => {
  assert.ok(topShare('scholarhsip', (n) => n.includes('scholarship')) >= 0.8)
})

check('typo in Hinglish key: "kissan" behaves like "kisan"', () => {
  assert.ok(topShare('kissan', (_, c) => c.includes('Agriculture & Farming')) >= 0.8)
})

check('state words: "rajasthan pension" ranks Rajasthan schemes first', () => {
  const top = search(index, 'rajasthan pension', 5)
  assert.ok(top[0].scheme.states.includes('Rajasthan') || top[0].scheme.name.includes('Rajasthan'), top[0].scheme.name)
})

check('construction workers: "mazdoor" finds labour board schemes', () => {
  const hits = search(index, 'mazdoor', 10)
  const isWorkerScheme = (h: (typeof hits)[number]) =>
    h.scheme.occupations.includes('construction_worker') || /labour|shramik|worker|construction/i.test(h.scheme.name)
  assert.ok(hits.filter(isWorkerScheme).length >= 9)
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

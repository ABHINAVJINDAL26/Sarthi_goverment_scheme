import { useCallback, useEffect, useMemo, useState } from 'react'
import './explore.css'
import { search } from './search'
import type { Scheme } from './types'
import { useSchemes } from './useSchemes'
import { AUDIENCES, cardTags, deadlineLabel, formatDate, placeLabel } from './format'
import SchemeDetail from './SchemeDetail'
import { navigate } from '../../lib/router'

const PAGE_SIZE = 24
const EXAMPLES = ['beti ki padhai', 'kisan', 'विधवा पेंशन', 'mazdoor', 'ghar ke liye loan', 'scholarship']

type Sort = 'relevance' | 'name' | 'verified'

interface Filters {
  q: string
  category: string
  state: string
  who: string
  scope: '' | 'central' | 'state'
}

function readFilters(search: string): Filters {
  const p = new URLSearchParams(search)
  const scope = p.get('scope')
  return {
    q: p.get('q') ?? p.get('search') ?? '',
    category: p.get('category') ?? '',
    state: p.get('state') ?? '',
    who: p.get('who') ?? '',
    scope: scope === 'central' || scope === 'state' ? scope : '',
  }
}

function writeFilters(f: Filters) {
  const p = new URLSearchParams()
  if (f.q) p.set('q', f.q)
  if (f.category) p.set('category', f.category)
  if (f.state) p.set('state', f.state)
  if (f.who) p.set('who', f.who)
  if (f.scope) p.set('scope', f.scope)
  const qs = p.toString()
  navigate('/explore' + (qs ? `?${qs}` : ''), { replace: true })
}

export default function ExplorePage({ initialSearch }: { initialSearch: string }) {
  const schemes = useSchemes()
  const [filters, setFilters] = useState<Filters>(() => readFilters(initialSearch))
  const [draft, setDraft] = useState(filters.q)
  const [sort, setSort] = useState<Sort>('relevance')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [selected, setSelected] = useState<Scheme | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false) // phones only; always open on desktop

  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch }
    setFilters(next)
    setVisible(PAGE_SIZE)
    writeFilters(next)
  }

  // Keep the box in sync when the query changes from outside (example chips, back button).
  useEffect(() => setDraft(filters.q), [filters.q])

  const all = schemes.status === 'ready' ? schemes.data.schemes : []

  // 1) text search (or everything), 2) filters, 3) sort
  const { results, matchedById, categoryCounts } = useMemo(() => {
    const matchedById = new Map<string, string[]>()
    let base: Scheme[]
    if (filters.q.trim() && schemes.index) {
      const hits = search(schemes.index, filters.q)
      hits.forEach((h) => matchedById.set(h.scheme.id, h.matched))
      base = hits.map((h) => h.scheme)
    } else {
      base = all
    }
    const audience = AUDIENCES.find((a) => a.id === filters.who)
    const passesNonCategory = (s: Scheme) =>
      (!filters.state || s.scope === 'central' || s.states.includes(filters.state)) &&
      (!filters.scope || s.scope === filters.scope) &&
      (!audience || audience.test(s))

    const beforeCategory = base.filter(passesNonCategory)
    const categoryCounts = new Map<string, number>()
    for (const s of beforeCategory) for (const c of s.categories) categoryCounts.set(c, (categoryCounts.get(c) ?? 0) + 1)

    let results = filters.category ? beforeCategory.filter((s) => s.categories.includes(filters.category)) : beforeCategory
    const effectiveSort = sort === 'relevance' && !filters.q.trim() ? 'name' : sort
    if (effectiveSort === 'name') results = [...results].sort((a, b) => a.name.localeCompare(b.name))
    if (effectiveSort === 'verified') results = [...results].sort((a, b) => b.verified.localeCompare(a.verified))
    return { results, matchedById, categoryCounts }
  }, [all, schemes.index, filters, sort])

  const states = useMemo(
    () => [...new Set(all.flatMap((s) => s.states))].sort((a, b) => a.localeCompare(b)),
    [all],
  )
  const closeDetail = useCallback(() => setSelected(null), [])
  const activeFilterCount = [filters.category, filters.state, filters.who, filters.scope].filter(Boolean).length

  return (
    <div className="ex-page">
      <section className="ex-hero">
        <div className="ex-container">
          <p className="ex-eyebrow">Explore schemes</p>
          <h1 className="ex-title">Find government schemes in your language</h1>
          <p className="ex-subtitle">
            Search in Hindi, English or Hinglish. Spelling mistakes are fine.
          </p>
          <form
            className="ex-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              update({ q: draft.trim() })
            }}
          >
            <input
              type="search"
              className="ex-search__input"
              placeholder='Try "beti ki padhai" or "किसान"'
              aria-label="Search schemes"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value)
                if (e.target.value === '') update({ q: '' })
              }}
            />
            <button type="submit" className="ex-search__btn">Search</button>
          </form>
          <div className="ex-examples" aria-label="Example searches">
            {EXAMPLES.map((ex) => (
              <button key={ex} type="button" className="ex-example" onClick={() => update({ q: ex })}>
                {ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="ex-container ex-layout">
        <button
          type="button"
          className="ex-filters-toggle"
          aria-expanded={filtersOpen}
          aria-controls="ex-filters"
          onClick={() => setFiltersOpen((o) => !o)}
        >
          {filtersOpen ? 'Hide filters' : 'Filters'}
          {activeFilterCount > 0 && <span className="ex-filters-toggle__badge">{activeFilterCount}</span>}
        </button>

        <aside id="ex-filters" className={`ex-filters ${filtersOpen ? 'is-open' : ''}`} aria-label="Filters">
          <div className="ex-filter">
            <label className="ex-filter__label" htmlFor="ex-state">Your state</label>
            <select id="ex-state" className="ex-select" value={filters.state} onChange={(e) => update({ state: e.target.value })}>
              <option value="">All states</option>
              {states.map((st) => <option key={st} value={st}>{st}</option>)}
            </select>
            <p className="ex-filter__hint">Shows central schemes plus that state's schemes.</p>
          </div>

          <div className="ex-filter">
            <span className="ex-filter__label">Scheme type</span>
            <div className="ex-segment" role="group" aria-label="Scheme type">
              {([['', 'All'], ['central', 'Central'], ['state', 'State']] as const).map(([v, label]) => (
                <button key={label} type="button" aria-pressed={filters.scope === v}
                  className={`ex-segment__btn ${filters.scope === v ? 'is-active' : ''}`} onClick={() => update({ scope: v })}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="ex-filter">
            <span className="ex-filter__label">Who is it for</span>
            <div className="ex-pills">
              {AUDIENCES.map((a) => (
                <button key={a.id} type="button" aria-pressed={filters.who === a.id}
                  className={`ex-pill ${filters.who === a.id ? 'is-active' : ''}`}
                  onClick={() => update({ who: filters.who === a.id ? '' : a.id })}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button type="button" className="ex-link-btn" onClick={() => update({ category: '', state: '', who: '', scope: '' })}>
              Clear filters ({activeFilterCount})
            </button>
          )}
        </aside>

        <section className="ex-results" aria-live="polite">
          <div className="ex-cats" role="group" aria-label="Categories">
            <button type="button" className={`ex-cat ${!filters.category ? 'is-active' : ''}`} aria-pressed={!filters.category}
              onClick={() => update({ category: '' })}>
              All
            </button>
            {[...categoryCounts.entries()].sort((a, b) => b[1] - a[1]).map(([c, n]) => (
              <button key={c} type="button" aria-pressed={filters.category === c}
                className={`ex-cat ${filters.category === c ? 'is-active' : ''}`}
                onClick={() => update({ category: filters.category === c ? '' : c })}>
                {c} <span className="ex-cat__count">{n}</span>
              </button>
            ))}
          </div>

          <div className="ex-toolbar">
            <p className="ex-count">
              {schemes.status === 'ready'
                ? <><strong>{results.length}</strong> scheme{results.length === 1 ? '' : 's'}{filters.q ? <> for “{filters.q}”</> : null}</>
                : ' '}
            </p>
            <label className="ex-sort">
              <span>Sort</span>
              <select className="ex-select ex-select--sm" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="relevance">Best match</option>
                <option value="name">Name A–Z</option>
                <option value="verified">Recently verified</option>
              </select>
            </label>
          </div>

          {schemes.status === 'loading' && (
            <div className="ex-grid" aria-busy="true">
              {Array.from({ length: 6 }, (_, i) => <div key={i} className="ex-card ex-card--skeleton" />)}
            </div>
          )}

          {schemes.status === 'error' && (
            <div className="ex-empty">
              <p>Could not load schemes ({schemes.message}).</p>
              <button type="button" className="ex-btn ex-btn--primary" onClick={schemes.retry}>Try again</button>
            </div>
          )}

          {schemes.status === 'ready' && results.length === 0 && (
            <div className="ex-empty">
              <p className="ex-empty__title">No schemes match.</p>
              <p className="ex-muted">Try fewer words, another spelling, or remove a filter.</p>
              {activeFilterCount > 0 && (
                <button type="button" className="ex-btn" onClick={() => update({ category: '', state: '', who: '', scope: '' })}>
                  Clear filters
                </button>
              )}
            </div>
          )}

          {schemes.status === 'ready' && results.length > 0 && (
            <>
              <ul className="ex-grid">
                {results.slice(0, visible).map((s) => {
                  const matched = matchedById.get(s.id)
                  const tags = cardTags(s)
                  return (
                    <li key={s.id}>
                      <article className="ex-card">
                        <div className="ex-card__top">
                          <span className="ex-chip">{s.category}</span>
                          <span className={`ex-scope ex-scope--${s.scope}`}>{s.scope === 'state' ? 'State' : 'Central'}</span>
                        </div>
                        <h3 className="ex-card__title">{s.name}</h3>
                        <p className="ex-card__place">{placeLabel(s)} · {deadlineLabel(s)}</p>
                        {tags.length > 0 && (
                          <div className="ex-chip-row">
                            {tags.map((t) => <span key={t} className="ex-tag">{t}</span>)}
                          </div>
                        )}
                        {matched && matched.length > 0 && (
                          <p className="ex-matched">Matched: {matched.join(', ')}</p>
                        )}
                        <div className="ex-card__footer">
                          <span className={`ex-verified ${s.stale ? 'is-stale' : ''}`}>
                            {s.stale ? 'Needs re-check' : 'Verified'} · {formatDate(s.verified)}
                          </span>
                          <button type="button" className="ex-btn ex-btn--sm" onClick={() => setSelected(s)}>
                            View details
                          </button>
                        </div>
                      </article>
                    </li>
                  )
                })}
              </ul>
              {visible < results.length && (
                <div className="ex-more">
                  <button type="button" className="ex-btn" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Show more ({results.length - visible} left)
                  </button>
                </div>
              )}
            </>
          )}

          {schemes.status === 'ready' && (
            <p className="ex-footnote">
              {schemes.data.count} schemes, cleaned by the Sarthi AI pipeline on {formatDate(schemes.data.as_of)}.
              Results are preliminary; always confirm on the official page.
            </p>
          )}
        </section>
      </div>

      {selected && <SchemeDetail scheme={selected} onClose={closeDetail} />}
    </div>
  )
}

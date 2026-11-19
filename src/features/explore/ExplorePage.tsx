import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './explore.css'
import { search } from './search'
import type { Scheme } from './types'
import { useSchemes } from './useSchemes'
import { AUDIENCES, BENEFIT_TYPES, cardTags, deadlineLabel, placeLabel, schemeName, schemeSummary } from './format'
import SchemeDetail from './SchemeDetail'
import { navigate } from '../../lib/router'
import { useI18n } from '../../i18n'

const PAGE_SIZE = 24
const EXAMPLES = {
  en: ['kisan', 'old age pension', 'beti ki padhai', 'ilaj', 'gas connection', 'rehdi loan'],
  hi: ['किसान', 'विधवा पेंशन', 'छात्रवृत्ति', 'इलाज', 'बीमा', 'दिव्यांग'],
}

type Sort = 'relevance' | 'name' | 'verified'

interface Filters {
  q: string
  category: string
  state: string
  who: string
  benefit: string
  scope: '' | 'central' | 'state'
  /** Open scheme (shareable link: /explore?scheme=pm-kisan). */
  scheme: string
}

function readFilters(search: string): Filters {
  const p = new URLSearchParams(search)
  const scope = p.get('scope')
  return {
    q: p.get('q') ?? p.get('search') ?? '',
    category: p.get('category') ?? '',
    state: p.get('state') ?? '',
    who: p.get('who') ?? '',
    benefit: p.get('benefit') ?? '',
    scope: scope === 'central' || scope === 'state' ? scope : '',
    scheme: p.get('scheme') ?? '',
  }
}

function writeFilters(f: Filters) {
  const p = new URLSearchParams()
  if (f.q) p.set('q', f.q)
  if (f.category) p.set('category', f.category)
  if (f.state) p.set('state', f.state)
  if (f.who) p.set('who', f.who)
  if (f.benefit) p.set('benefit', f.benefit)
  if (f.scope) p.set('scope', f.scope)
  if (f.scheme) p.set('scheme', f.scheme)
  const qs = p.toString()
  navigate('/explore' + (qs ? `?${qs}` : ''), { replace: true })
}

export default function ExplorePage({ initialSearch }: { initialSearch: string }) {
  const i = useI18n()
  const { t, num } = i
  const schemes = useSchemes()
  const [filters, setFilters] = useState<Filters>(() => readFilters(initialSearch))
  const [draft, setDraft] = useState(filters.q)
  const [sort, setSort] = useState<Sort>('relevance')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [filtersOpen, setFiltersOpen] = useState(false) // phones only; always open on desktop

  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch }
    setFilters(next)
    if (!('scheme' in patch && Object.keys(patch).length === 1)) setVisible(PAGE_SIZE)
    writeFilters(next)
  }

  // Keep the box in sync when the query changes from outside (example chips, back button).
  useEffect(() => setDraft(filters.q), [filters.q])

  const all = schemes.status === 'ready' ? schemes.data.schemes : []
  const selected = useMemo(() => all.find((s) => s.id === filters.scheme) ?? null, [all, filters.scheme])
  const openScheme = (s: Scheme) => update({ scheme: s.id })

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
      (!filters.benefit || s.benefit_types.includes(filters.benefit as Scheme['benefit_types'][number])) &&
      (!audience || audience.test(s))

    const beforeCategory = base.filter(passesNonCategory)
    const categoryCounts = new Map<string, number>()
    for (const s of beforeCategory) for (const c of s.categories) categoryCounts.set(c, (categoryCounts.get(c) ?? 0) + 1)

    let results = filters.category ? beforeCategory.filter((s) => s.categories.includes(filters.category)) : beforeCategory
    const effectiveSort = sort === 'relevance' && !filters.q.trim() ? 'name' : sort
    if (effectiveSort === 'name') {
      const key = (s: Scheme) => (i.lang === 'hi' ? s.name_hi : s.name)
      results = [...results].sort((a, b) => key(a).localeCompare(key(b), i.lang === 'hi' ? 'hi' : 'en'))
    }
    if (effectiveSort === 'verified') results = [...results].sort((a, b) => b.verified.localeCompare(a.verified))
    return { results, matchedById, categoryCounts }
  }, [all, schemes.index, filters.q, filters.state, filters.scope, filters.benefit, filters.who, filters.category, sort, i.lang])

  const states = useMemo(
    () => [...new Set(all.flatMap((s) => s.states))].sort((a, b) => i.stateName(a).localeCompare(i.stateName(b))),
    [all, i],
  )
  // `update` closes over the latest filters; keep a stable callback for the modal's effect.
  const updateRef = useRef(update)
  updateRef.current = update
  const closeDetail = useCallback(() => updateRef.current({ scheme: '' }), [])
  const activeFilterCount = [filters.category, filters.state, filters.who, filters.scope, filters.benefit].filter(Boolean).length
  const clearFilters = () => update({ category: '', state: '', who: '', scope: '', benefit: '' })

  const countText = results.length === 1 ? t('ex.resultCountOne') : t('ex.resultCount', { count: num(results.length) })

  return (
    <div className="ex-page">
      <section className="ex-hero">
        <div className="ex-container">
          <p className="ex-eyebrow">{t('ex.eyebrow')}</p>
          <h1 className="ex-title">{t('ex.title')}</h1>
          <p className="ex-subtitle">{t('ex.subtitle')}</p>
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
              data-testid="explore-search-input"
              placeholder={t('ex.placeholder')}
              aria-label={t('home.searchLabel')}
              value={draft}
              enterKeyHint="search"
              onChange={(e) => {
                setDraft(e.target.value)
                if (e.target.value === '') update({ q: '' })
              }}
            />
            <button type="submit" className="ex-search__btn" data-testid="explore-search-submit">{t('ex.search')}</button>
          </form>
          <div className="ex-examples" aria-label={t('ex.examples')}>
            {EXAMPLES[i.lang].map((ex) => (
              <button key={ex} type="button" className="ex-example" data-testid="example-chip" onClick={() => update({ q: ex })}>
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
          data-testid="filters-toggle"
          aria-expanded={filtersOpen}
          aria-controls="ex-filters"
          onClick={() => setFiltersOpen((o) => !o)}
        >
          {filtersOpen ? t('ex.hideFilters') : t('ex.filters')}
          {activeFilterCount > 0 && <span className="ex-filters-toggle__badge">{activeFilterCount}</span>}
        </button>

        <aside id="ex-filters" className={`ex-filters ${filtersOpen ? 'is-open' : ''}`} aria-label={t('ex.filters')}>
          <div className="ex-filter">
            <label className="ex-filter__label" htmlFor="ex-state">{t('ex.yourState')}</label>
            <select id="ex-state" data-testid="state-select" className="ex-select" value={filters.state} onChange={(e) => update({ state: e.target.value })}>
              <option value="">{t('ex.allStates')}</option>
              {states.map((st) => <option key={st} value={st}>{i.stateName(st)}</option>)}
            </select>
            <p className="ex-filter__hint">{t('ex.stateHint')}</p>
          </div>

          <div className="ex-filter">
            <span className="ex-filter__label">{t('ex.schemeType')}</span>
            <div className="ex-segment" role="group" aria-label={t('ex.schemeType')}>
              {([['', 'ex.typeAll'], ['central', 'ex.typeCentral'], ['state', 'ex.typeState']] as const).map(([v, label]) => (
                <button key={label} type="button" aria-pressed={filters.scope === v} data-testid={`scope-${v || 'all'}`}
                  className={`ex-segment__btn ${filters.scope === v ? 'is-active' : ''}`} onClick={() => update({ scope: v })}>
                  {t(label)}
                </button>
              ))}
            </div>
          </div>

          <div className="ex-filter">
            <span className="ex-filter__label">{t('ex.whoFor')}</span>
            <div className="ex-pills">
              {AUDIENCES.map((a) => (
                <button key={a.id} type="button" aria-pressed={filters.who === a.id} data-testid={`who-pill-${a.id}`}
                  className={`ex-pill ${filters.who === a.id ? 'is-active' : ''}`}
                  onClick={() => update({ who: filters.who === a.id ? '' : a.id })}>
                  {i.audience(a.id)}
                </button>
              ))}
            </div>
          </div>

          <div className="ex-filter">
            <span className="ex-filter__label">{t('ex.benefitType')}</span>
            <div className="ex-pills">
              {BENEFIT_TYPES.filter((b) => all.some((s) => s.benefit_types.includes(b))).map((b) => (
                <button key={b} type="button" aria-pressed={filters.benefit === b} data-testid={`benefit-pill-${b}`}
                  className={`ex-pill ${filters.benefit === b ? 'is-active' : ''}`}
                  onClick={() => update({ benefit: filters.benefit === b ? '' : b })}>
                  {i.benefit(b)}
                </button>
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button type="button" className="ex-link-btn" data-testid="clear-filters" onClick={clearFilters}>
              {t('ex.clearFilters', { count: activeFilterCount })}
            </button>
          )}
        </aside>

        <section className="ex-results" aria-live="polite">
          <div className="ex-cats" role="group" aria-label={t('ex.categories')}>
            <button type="button" className={`ex-cat ${!filters.category ? 'is-active' : ''}`} aria-pressed={!filters.category}
              onClick={() => update({ category: '' })}>
              {t('ex.all')}
            </button>
            {[...categoryCounts.entries()].sort((a, b) => b[1] - a[1]).map(([c, n]) => (
              <button key={c} type="button" aria-pressed={filters.category === c} data-testid="category-chip"
                className={`ex-cat ${filters.category === c ? 'is-active' : ''}`}
                onClick={() => update({ category: filters.category === c ? '' : c })}>
                {i.category(c, true)} <span className="ex-cat__count">{num(n)}</span>
              </button>
            ))}
          </div>

          <div className="ex-toolbar">
            <p className="ex-count" data-testid="result-count">
              {schemes.status === 'ready'
                ? <><strong>{countText}</strong>{filters.q ? <> {t('ex.resultFor', { q: filters.q })}</> : null}</>
                : ' '}
            </p>
            <label className="ex-sort">
              <span>{t('ex.sort')}</span>
              <select className="ex-select ex-select--sm" data-testid="sort-select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="relevance">{t('ex.sortBest')}</option>
                <option value="name">{t('ex.sortName')}</option>
                <option value="verified">{t('ex.sortVerified')}</option>
              </select>
            </label>
          </div>

          {schemes.status === 'loading' && (
            <div className="ex-grid" aria-busy="true" data-testid="loading">
              {Array.from({ length: 6 }, (_, k) => <div key={k} className="ex-card ex-card--skeleton" />)}
            </div>
          )}

          {schemes.status === 'error' && (
            <div className="ex-empty" data-testid="load-error">
              <p>{t('ex.loadError', { error: schemes.message })}</p>
              <button type="button" className="ex-btn ex-btn--primary" data-testid="retry-button" onClick={schemes.retry}>{t('ex.retry')}</button>
            </div>
          )}

          {schemes.status === 'ready' && results.length === 0 && (
            <div className="ex-empty" data-testid="no-results">
              <p className="ex-empty__title">{t('ex.noResults')}</p>
              <p className="ex-muted">{t('ex.noResultsHint')}</p>
              {activeFilterCount > 0 && (
                <button type="button" className="ex-btn" onClick={clearFilters}>
                  {t('ex.clearFilters', { count: activeFilterCount })}
                </button>
              )}
            </div>
          )}

          {schemes.status === 'ready' && results.length > 0 && (
            <>
              <ul className="ex-grid">
                {results.slice(0, visible).map((s) => {
                  const matched = matchedById.get(s.id)
                  const tags = cardTags(s, i)
                  const recheck = s.status === 'needs_recheck'
                  return (
                    <li key={s.id}>
                      <article className="ex-card" data-testid="scheme-card" data-scheme-id={s.id} data-scope={s.scope} data-verified={s.verified} data-stale={recheck}>
                        <div className="ex-card__top">
                          <span className="ex-chip">{i.category(s.category, true)}</span>
                          <span className={`ex-scope ex-scope--${s.scope}`}>{s.scope === 'state' ? t('ex.state') : t('ex.central')}</span>
                        </div>
                        <h3 className="ex-card__title">
                          <button type="button" className="ex-card__open" data-testid="scheme-card-title" onClick={() => openScheme(s)}>{schemeName(s, i)}</button>
                        </h3>
                        <p className="ex-card__summary">{schemeSummary(s, i)}</p>
                        <p className="ex-card__place">{placeLabel(s, i)} · {deadlineLabel(s, i)}</p>
                        {tags.length > 0 && (
                          <div className="ex-chip-row">
                            {tags.map((tag) => <span key={tag} className="ex-tag">{tag}</span>)}
                          </div>
                        )}
                        {matched && matched.length > 0 && (
                          <p className="ex-matched">{t('ex.matched', { words: matched.join(', ') })}</p>
                        )}
                        <div className="ex-card__footer">
                          <span className={`ex-verified ${recheck ? 'is-stale' : ''}`}>
                            {t(recheck ? 'ex.needsRecheck' : 'ex.verified', { date: i.date(s.verified) })}
                          </span>
                          <button type="button" className="ex-btn ex-btn--sm" data-testid="scheme-card-details" onClick={() => openScheme(s)} aria-label={`${t('ex.viewDetails')}: ${schemeName(s, i)}`}>
                            {t('ex.viewDetails')}
                          </button>
                        </div>
                      </article>
                    </li>
                  )
                })}
              </ul>
              {visible < results.length && (
                <div className="ex-more">
                  <button type="button" className="ex-btn" data-testid="show-more" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    {t('ex.showMore', { count: num(results.length - visible) })}
                  </button>
                </div>
              )}
            </>
          )}

          {schemes.status === 'ready' && (
            <p className="ex-footnote">
              {t('ex.footnote', { count: num(schemes.data.count), date: i.date(schemes.data.as_of) })}
            </p>
          )}
        </section>
      </div>

      {selected && <SchemeDetail scheme={selected} onClose={closeDetail} />}
    </div>
  )
}

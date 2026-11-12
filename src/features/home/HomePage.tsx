import { useMemo, useState } from 'react'
import './home.css'
import { useI18n } from '../../i18n'
import { navigate } from '../../lib/router'
import { onInternalLink } from '../../components/layout/AppHeader'
import {
  AccessibleIcon, ElderlyIcon, EcoIcon, FamilyIcon, GovernmentBuildingIcon, LockIcon, PolicyIcon,
  SchoolIcon, SearchIcon, StorefrontIcon, VerifiedShieldIcon, WorkIcon,
} from '../../components/ui/icons'
import { useSchemes } from '../explore/useSchemes'
import { AUDIENCES } from '../explore/format'

const AUDIENCE_TILES: Array<{ id: string; Icon: typeof SchoolIcon; tone: string }> = [
  { id: 'students', Icon: SchoolIcon, tone: 'blue' },
  { id: 'farmers', Icon: EcoIcon, tone: 'green' },
  { id: 'women', Icon: FamilyIcon, tone: 'pink' },
  { id: 'senior', Icon: ElderlyIcon, tone: 'amber' },
  { id: 'disability', Icon: AccessibleIcon, tone: 'violet' },
  { id: 'workers', Icon: WorkIcon, tone: 'slate' },
  { id: 'business', Icon: StorefrontIcon, tone: 'teal' },
  { id: 'scst', Icon: GovernmentBuildingIcon, tone: 'saffron' },
]

const EXAMPLES = {
  en: ['kisan', 'beti ki padhai', 'old age pension', 'scholarship'],
  hi: ['किसान', 'बेटी की पढ़ाई', 'विधवा पेंशन', 'छात्रवृत्ति'],
}

const exploreUrl = (params: Record<string, string>) => '/explore?' + new URLSearchParams(params).toString()

export default function HomePage() {
  const i = useI18n()
  const { t, num } = i
  const schemes = useSchemes()
  const [query, setQuery] = useState('')

  const stats = useMemo(() => {
    if (schemes.status !== 'ready') return null
    const all = schemes.data.schemes
    const byAudience = new Map(AUDIENCES.map((a) => [a.id, all.filter(a.test).length]))
    const byCategory = new Map<string, number>()
    for (const s of all) byCategory.set(s.category, (byCategory.get(s.category) ?? 0) + 1)
    return {
      total: all.length,
      central: all.filter((s) => s.scope === 'central').length,
      state: all.filter((s) => s.scope === 'state').length,
      states: new Set(all.flatMap((s) => s.states)).size,
      byAudience,
      categories: [...byCategory.entries()].sort((a, b) => b[1] - a[1]),
    }
  }, [schemes])

  const total = stats ? num(stats.total) : '…'
  const submit = (q: string) => {
    const trimmed = q.trim()
    navigate(trimmed ? exploreUrl({ q: trimmed }) : '/explore')
  }

  return (
    <div className="h-page">
      {/* ---------- Hero: the one main job, find schemes ---------- */}
      <section className="h-hero">
        <div className="s-container h-hero__inner">
          <div className="h-hero__copy">
            <p className="h-badge">{t('home.badge')}</p>
            <h1 className="h-hero__title">{t('home.title')}</h1>
            <p className="h-hero__subtitle">{t('home.subtitle', { count: total })}</p>

            <form
              className="h-search"
              role="search"
              onSubmit={(e) => {
                e.preventDefault()
                submit(query)
              }}
            >
              <label htmlFor="h-search-input" className="sr-only">{t('home.searchLabel')}</label>
              <SearchIcon width={22} height={22} className="h-search__icon" />
              <input
                id="h-search-input"
                type="search"
                className="h-search__input"
                placeholder={t('home.searchPlaceholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                enterKeyHint="search"
              />
              <button type="submit" className="s-btn s-btn--primary h-search__btn">{t('home.searchButton')}</button>
            </form>

            <div className="h-examples">
              <span className="h-examples__label">{t('home.examples')}:</span>
              {EXAMPLES[i.lang].map((ex) => (
                <a key={ex} href={exploreUrl({ q: ex })} onClick={onInternalLink(exploreUrl({ q: ex }))} className="h-example">
                  {ex}
                </a>
              ))}
            </div>

            <a href="/explore" onClick={onInternalLink('/explore')} className="h-hero__browse">
              {t('home.browseAll', { count: total })} →
            </a>
          </div>

          <div className="h-hero__art" aria-hidden="false">
            <img
              src="/assets/header/HowImage2.jpg"
              alt={t('home.heroImageAlt')}
              width={1024}
              height={765}
            />
          </div>
        </div>
      </section>

      {/* ---------- Who are you: biggest, simplest entry point ---------- */}
      <section className="h-section" aria-labelledby="h-who-title">
        <div className="s-container">
          <h2 id="h-who-title" className="s-section-title">{t('home.whoTitle')}</h2>
          <p className="s-section-sub">{t('home.whoSubtitle')}</p>
          <ul className="h-who">
            {AUDIENCE_TILES.map(({ id, Icon, tone }) => {
              const href = exploreUrl({ who: id })
              const count = stats?.byAudience.get(id)
              return (
                <li key={id}>
                  <a href={href} onClick={onInternalLink(href)} className={`h-who__tile h-tone--${tone}`}>
                    <span className="h-who__icon"><Icon width={28} height={28} /></span>
                    <span className="h-who__label">{i.audience(id)}</span>
                    <span className="h-who__count">
                      {count === undefined ? '…' : t('home.schemesCount', { count: num(count) })}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ---------- Topics ---------- */}
      <section className="h-section h-section--tight" aria-labelledby="h-topics-title">
        <div className="s-container">
          <h2 id="h-topics-title" className="h-subtitle">{t('home.topicsTitle')}</h2>
          <ul className="h-topics">
            {(stats?.categories ?? []).map(([cat, count]) => {
              const href = exploreUrl({ category: cat })
              return (
                <li key={cat}>
                  <a href={href} onClick={onInternalLink(href)} className="h-topic">
                    {i.category(cat, true)} <span className="h-topic__count">{num(count)}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ---------- How it works: 3 steps that match what the site does today ---------- */}
      <section className="h-section h-section--soft" aria-labelledby="h-how-title">
        <div className="s-container">
          <h2 id="h-how-title" className="s-section-title">{t('home.howTitle')}</h2>
          <ol className="h-steps">
            {([1, 2, 3] as const).map((n) => (
              <li key={n} className="h-step">
                <span className="h-step__num" aria-hidden="true">{n}</span>
                <p className="h-step__label">{t('home.step', { n })}</p>
                <h3 className="h-step__title">{t(`home.how${n}Title`)}</h3>
                <p className="h-step__text">{t(`home.how${n}Text`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Real numbers + trust ---------- */}
      <section className="h-section" aria-labelledby="h-numbers-title">
        <div className="s-container">
          <h2 id="h-numbers-title" className="s-section-title">{t('home.numbersTitle')}</h2>
          <dl className="h-stats">
            {[
              [stats?.total, 'home.statSchemes'],
              [stats?.central, 'home.statCentral'],
              [stats?.state, 'home.statState'],
              [stats?.states, 'home.statStates'],
            ].map(([value, label]) => (
              <div key={label as string} className="h-stat">
                <dt>{t(label as 'home.statSchemes')}</dt>
                <dd>{value === undefined ? '…' : num(value as number)}</dd>
              </div>
            ))}
          </dl>

          <ul className="h-trust">
            {([
              [VerifiedShieldIcon, 'home.trust1Title', 'home.trust1Text'],
              [PolicyIcon, 'home.trust2Title', 'home.trust2Text'],
              [LockIcon, 'home.trust3Title', 'home.trust3Text'],
            ] as const).map(([Icon, title, text]) => (
              <li key={title} className="h-trust__item">
                <span className="h-trust__icon"><Icon width={22} height={22} /></span>
                <div>
                  <h3 className="h-trust__title">{t(title)}</h3>
                  <p className="h-trust__text">{t(text)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

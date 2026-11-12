import { useI18n } from '../../i18n'
import type { MessageKey } from '../../i18n/en'
import { navigate } from '../../lib/router'
import Logo from './Logo'

export interface NavItem {
  id: string
  path: string
  label: MessageKey
  shortLabel: MessageKey
}

/** Only pages that exist. Unbuilt features stay out of the menu (no dead links). */
export const NAV_ITEMS: NavItem[] = [
  { id: 'home', path: '/', label: 'nav.home', shortLabel: 'nav.home' },
  { id: 'explore', path: '/explore', label: 'nav.explore', shortLabel: 'nav.exploreShort' },
  { id: 'help', path: '/help', label: 'nav.help', shortLabel: 'nav.help' },
]

/** Internal link that uses the client-side router (keeps modifier-click working). */
export function onInternalLink(path: string) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(path)
  }
}

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n()
  const next = lang === 'hi' ? 'en' : 'hi'
  return (
    <button
      type="button"
      className="s-lang"
      onClick={() => setLang(next)}
      lang={next}
      aria-label={t('lang.switchTo')}
    >
      <span aria-hidden="true" className="s-lang__icon">अ/A</span>
      <span>{next === 'hi' ? 'हिंदी' : 'English'}</span>
    </button>
  )
}

export default function AppHeader({ active }: { active: string }) {
  const { t } = useI18n()
  return (
    <header className="s-header">
      <div className="s-container s-header__inner">
        <a href="/" className="s-header__brand" onClick={onInternalLink('/')} aria-label={t('app.name')}>
          <Logo />
        </a>

        <nav className="s-header__nav" aria-label={t('nav.primary')}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.path}
              onClick={onInternalLink(item.path)}
              className={`s-header__link ${active === item.id ? 'is-active' : ''}`}
              aria-current={active === item.id ? 'page' : undefined}
            >
              {t(item.label)}
            </a>
          ))}
        </nav>

        <LanguageToggle />
      </div>
    </header>
  )
}

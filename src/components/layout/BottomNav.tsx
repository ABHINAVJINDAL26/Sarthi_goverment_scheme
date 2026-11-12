import { useI18n } from '../../i18n'
import { ExploreIcon, HelpOutlineIcon, HomeIcon } from '../ui/icons'
import { NAV_ITEMS, onInternalLink } from './AppHeader'

const ICONS: Record<string, typeof HomeIcon> = { home: HomeIcon, explore: ExploreIcon, help: HelpOutlineIcon }

/** Phone-only bottom navigation with large touch targets. */
export default function BottomNav({ active }: { active: string }) {
  const { t } = useI18n()
  return (
    <nav className="s-bottom-nav" aria-label={t('nav.mobile')}>
      {NAV_ITEMS.map((item) => {
        const Icon = ICONS[item.id]
        const isActive = active === item.id
        return (
          <a
            key={item.id}
            href={item.path}
            onClick={onInternalLink(item.path)}
            className={`s-bottom-nav__item ${isActive ? 'is-active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon width={24} height={24} />
            <span>{t(item.shortLabel)}</span>
          </a>
        )
      })}
    </nav>
  )
}

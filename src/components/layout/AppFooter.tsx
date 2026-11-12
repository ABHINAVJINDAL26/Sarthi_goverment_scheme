import { useI18n } from '../../i18n'
import { useSchemes } from '../../features/explore/useSchemes'
import { NAV_ITEMS, onInternalLink } from './AppHeader'
import Logo from './Logo'

export default function AppFooter() {
  const { t, date } = useI18n()
  const schemes = useSchemes()

  return (
    <footer className="s-footer">
      <div className="s-container s-footer__grid">
        <div className="s-footer__about">
          <Logo inverted />
          <p>{t('footer.about')}</p>
          <p className="s-footer__disclaimer">{t('footer.disclaimer')}</p>
        </div>

        <div>
          <h2 className="s-footer__heading">{t('footer.links')}</h2>
          <ul className="s-footer__links">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={item.path} onClick={onInternalLink(item.path)}>{t(item.label)}</a>
              </li>
            ))}
            <li>
              <a href="https://www.myscheme.gov.in/" target="_blank" rel="noopener noreferrer">
                {t('footer.official')} ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="s-container s-footer__bottom">
        <span>© 2026 {t('app.name')}</span>
        {schemes.status === 'ready' && <span>{t('footer.dataNote', { date: date(schemes.data.as_of) })}</span>}
      </div>
    </footer>
  )
}

import './help.css'
import { useI18n } from '../../i18n'
import type { MessageKey } from '../../i18n/en'
import { onInternalLink } from '../../components/layout/AppHeader'

const FAQ_COUNT = 6

/** Help centre (spec F17, simplified): plain answers about trust, cost and how to apply. */
export default function HelpPage() {
  const { t } = useI18n()
  return (
    <div className="hp-page">
      <div className="s-container hp-inner">
        <h1 className="s-section-title">{t('help.title')}</h1>
        <p className="s-section-sub">{t('help.subtitle')}</p>

        <div className="hp-faq">
          {Array.from({ length: FAQ_COUNT }, (_, idx) => idx + 1).map((n) => (
            <details key={n} className="hp-item" open={n === 1}>
              <summary className="hp-q">{t(`help.q${n}` as MessageKey)}</summary>
              <p className="hp-a">{t(`help.a${n}` as MessageKey)}</p>
            </details>
          ))}
        </div>

        <a href="/explore" onClick={onInternalLink('/explore')} className="s-btn s-btn--primary hp-cta">
          {t('help.cta')} →
        </a>
      </div>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import type { Scheme } from './types'
import { deadlineLabel, eligibilityLines, placeLabel } from './format'
import { useI18n } from '../../i18n'

interface Props {
  scheme: Scheme
  onClose: () => void
}

/** Scheme detail panel (spec F6, simplified): rules, documents, links, freshness. */
export default function SchemeDetail({ scheme: s, onClose }: Props) {
  const i = useI18n()
  const { t } = i
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previouslyFocused?.focus()
    }
  }, [onClose])

  const genericSource = s.flags.includes('source_url_generic')
  const docs = [...s.documents.map(i.document), ...s.other_documents]

  return (
    <div className="ex-modal" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ex-modal__panel" role="dialog" aria-modal="true" aria-labelledby="ex-detail-title">
        <header className="ex-modal__header">
          <div>
            <div className="ex-chip-row">
              {s.categories.map((c) => <span key={c} className="ex-chip">{i.category(c, true)}</span>)}
            </div>
            <h2 id="ex-detail-title" className="ex-modal__title">{s.name}</h2>
            <p className="ex-modal__meta">
              {s.scope === 'state' ? t('detail.stateScheme') : t('detail.centralScheme')} · {placeLabel(s, i)} · {deadlineLabel(s, i)}
            </p>
          </div>
          <button ref={closeRef} type="button" className="ex-icon-btn" onClick={onClose} aria-label={t('detail.close')}>
            ✕
          </button>
        </header>

        <div className="ex-modal__body">
          <p className="ex-notice">{t('detail.preliminary')}</p>
          {s.stale && <p className="ex-notice ex-notice--warn">{t('detail.stale', { date: i.date(s.verified) })}</p>}

          <section className="ex-section">
            <h3 className="ex-section__title">{t('detail.whoCanApply')}</h3>
            <ul className="ex-list">
              {eligibilityLines(s, i).map((line) => <li key={line}>{line}</li>)}
            </ul>
          </section>

          <section className="ex-section">
            <h3 className="ex-section__title">{t('detail.documents', { count: docs.length })}</h3>
            {docs.length ? (
              <ul className="ex-checklist">
                {docs.map((d) => <li key={d}>{d}</li>)}
              </ul>
            ) : (
              <p className="ex-muted">{t('detail.noDocuments')}</p>
            )}
          </section>

          <section className="ex-section">
            <h3 className="ex-section__title">{t('detail.links')}</h3>
            <div className="ex-links">
              {s.apply_url && (
                <a className="ex-btn ex-btn--primary" href={s.apply_url} target="_blank" rel="noopener noreferrer">
                  {t('detail.apply')}
                </a>
              )}
              {s.source_url && (
                <a className="ex-btn" href={s.source_url} target="_blank" rel="noopener noreferrer">
                  {genericSource ? t('detail.myscheme') : t('detail.source')}
                </a>
              )}
            </div>
            <p className="ex-muted">{t('detail.lastVerified', { date: i.date(s.verified) })}</p>
          </section>
        </div>
      </div>
    </div>
  )
}

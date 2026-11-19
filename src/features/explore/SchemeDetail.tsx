import { useEffect, useRef, useState } from 'react'
import type { Scheme } from './types'
import { deadlineLabel, placeLabel, schemeName, schemeSummary } from './format'
import { useI18n } from '../../i18n'
import type { MessageKey } from '../../i18n/en'

interface Props {
  scheme: Scheme
  onClose: () => void
}

const SECTIONS: Array<{ id: string; label: MessageKey }> = [
  { id: 'overview', label: 'detail.tabOverview' },
  { id: 'eligibility', label: 'detail.tabEligibility' },
  { id: 'documents', label: 'detail.tabDocuments' },
  { id: 'apply', label: 'detail.tabApply' },
  { id: 'sources', label: 'detail.tabSources' },
]

/**
 * Scheme detail panel (spec F6): one panel with the five sections the spec asks for
 * (overview, eligibility, documents, how to apply, sources & FAQs), a section menu,
 * official links, freshness and any data notes.
 */
export default function SchemeDetail({ scheme: s, onClose }: Props) {
  const i = useI18n()
  const { t } = i
  const closeRef = useRef<HTMLButtonElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

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

  const jump = (id: string) => {
    bodyRef.current?.querySelector(`#detail-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const share = async () => {
    const url = `${window.location.origin}/explore?scheme=${encodeURIComponent(s.id)}`
    try {
      if (navigator.share) await navigator.share({ title: s.name, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // share sheet closed or clipboard blocked: nothing to do
    }
  }

  const docs = s.documents
  const hasApplySteps = s.application.online.length > 0 || s.application.offline.length > 0

  return (
    <div className="ex-modal" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ex-modal__panel" data-testid="scheme-detail" data-scheme-id={s.id} role="dialog" aria-modal="true" aria-labelledby="ex-detail-title">
        <header className="ex-modal__header">
          <div>
            <div className="ex-chip-row">
              {s.categories.map((c) => <span key={c} className="ex-chip">{i.category(c, true)}</span>)}
              {s.status === 'needs_recheck' && <span className="ex-chip ex-chip--warn">{t('detail.needsRecheckBadge')}</span>}
            </div>
            <h2 id="ex-detail-title" className="ex-modal__title">{schemeName(s, i)}</h2>
            {i.lang === 'hi' && <p className="ex-modal__alt">{s.name}{s.short_name ? ` (${s.short_name})` : ''}</p>}
            <p className="ex-modal__meta">
              {s.scope === 'state' ? t('detail.stateScheme') : t('detail.centralScheme')} · {placeLabel(s, i)} · {deadlineLabel(s, i)}
            </p>
            <p className="ex-modal__meta">{s.ministry}</p>
          </div>
          <div className="ex-modal__actions">
            <button type="button" className="ex-icon-btn" data-testid="scheme-detail-share" onClick={share} aria-label={t('detail.share')} title={t('detail.share')}>
              ↗
            </button>
            <button ref={closeRef} type="button" className="ex-icon-btn" data-testid="scheme-detail-close" onClick={onClose} aria-label={t('detail.close')}>
              ✕
            </button>
          </div>
        </header>

        <nav className="ex-tabs" aria-label={t('detail.sections')}>
          {SECTIONS.map((sec) => (
            <button key={sec.id} type="button" className="ex-tab" data-testid={`detail-tab-${sec.id}`} onClick={() => jump(sec.id)}>
              {t(sec.label)}
            </button>
          ))}
        </nav>

        <div className="ex-modal__body" ref={bodyRef}>
          {copied && <p className="ex-notice" role="status">{t('detail.linkCopied')}</p>}
          <p className="ex-notice">{t('detail.preliminary')}</p>
          {s.notes.length > 0 && (
            <div className={`ex-notice ${s.status === 'needs_recheck' ? 'ex-notice--warn' : ''}`} data-testid="scheme-notes">
              <strong>{t(s.status === 'needs_recheck' ? 'detail.notesRecheck' : 'detail.notes')}</strong>
              <ul className="ex-list ex-list--tight">
                {s.notes.map((n) => <li key={n}>{n}</li>)}
              </ul>
            </div>
          )}
          {i.lang === 'hi' && <p className="ex-muted">{t('detail.englishDetails')}</p>}

          <section className="ex-section" id="detail-overview">
            <h3 className="ex-section__title">{t('detail.tabOverview')}</h3>
            <p className="ex-summary" data-testid="scheme-summary">{schemeSummary(s, i)}</p>
            <h4 className="ex-section__sub">{t('detail.benefits')}</h4>
            <ul className="ex-list" data-testid="benefits-list">
              {s.benefits.map((b) => <li key={b}>{b}</li>)}
            </ul>
            {s.benefit_types.length > 0 && (
              <div className="ex-chip-row">
                {s.benefit_types.map((b) => <span key={b} className="ex-tag">{i.benefit(b)}</span>)}
              </div>
            )}
          </section>

          <section className="ex-section" id="detail-eligibility">
            <h3 className="ex-section__title">{t('detail.whoCanApply')}</h3>
            <ul className="ex-list" data-testid="eligibility-list">
              {s.eligibility.map((line) => <li key={line}>{line}</li>)}
            </ul>
            {s.exclusions.length > 0 && (
              <>
                <h4 className="ex-section__sub">{t('detail.exclusions')}</h4>
                <ul className="ex-list ex-list--no" data-testid="exclusions-list">
                  {s.exclusions.map((line) => <li key={line}>{line}</li>)}
                </ul>
              </>
            )}
          </section>

          <section className="ex-section" id="detail-documents">
            <h3 className="ex-section__title">{t('detail.documents', { count: docs.length })}</h3>
            {docs.length ? (
              <ul className="ex-checklist" data-testid="documents-list">
                {s.documents.map((d) => <li key={d} title={i.lang === 'hi' ? d : undefined}>{i.document(d)}</li>)}
              </ul>
            ) : (
              <p className="ex-muted">{t('detail.noDocuments')}</p>
            )}
          </section>

          <section className="ex-section" id="detail-apply">
            <h3 className="ex-section__title">{t('detail.tabApply')}</h3>
            {s.application.online.length > 0 && (
              <>
                <h4 className="ex-section__sub">{t('detail.online')}</h4>
                <ol className="ex-steps" data-testid="apply-online-steps">
                  {s.application.online.map((step) => <li key={step}>{step}</li>)}
                </ol>
              </>
            )}
            {s.application.offline.length > 0 && (
              <>
                <h4 className="ex-section__sub">{t('detail.offline')}</h4>
                <ol className="ex-steps" data-testid="apply-offline-steps">
                  {s.application.offline.map((step) => <li key={step}>{step}</li>)}
                </ol>
              </>
            )}
            {!hasApplySteps && <p className="ex-muted">{t('detail.noSteps')}</p>}
            <div className="ex-links">
              {s.apply_url && (
                <a className="ex-btn ex-btn--primary" data-testid="apply-link" href={s.apply_url} target="_blank" rel="noopener noreferrer">
                  {t('detail.apply')}
                </a>
              )}
            </div>
            {s.helpline && <p className="ex-helpline" data-testid="helpline">{t('detail.helpline', { number: s.helpline })}</p>}
            <p className="ex-muted">{t('detail.noSubmit')}</p>
          </section>

          <section className="ex-section" id="detail-sources">
            <h3 className="ex-section__title">{t('detail.tabSources')}</h3>
            {s.faqs.length > 0 && (
              <div className="ex-faqs" data-testid="faq-list">
                {s.faqs.map((f) => (
                  <details key={f.q} className="ex-faq">
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            )}
            <h4 className="ex-section__sub">{t('detail.sourcesTitle')}</h4>
            <ul className="ex-sources" data-testid="sources-list">
              {s.sources.map((src) => (
                <li key={src.url}>
                  <a href={src.url} target="_blank" rel="noopener noreferrer">{src.title} ↗</a>
                  {src.date && <span className="ex-muted"> · {i.date(src.date)}</span>}
                </li>
              ))}
            </ul>
            <p className="ex-muted">{t('detail.lastVerified', { date: i.date(s.verified) })}</p>
          </section>
        </div>
      </div>
    </div>
  )
}

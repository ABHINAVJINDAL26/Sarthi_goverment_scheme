import { useEffect, useRef } from 'react'
import type { Scheme } from './types'
import { deadlineLabel, eligibilityLines, formatDate, placeLabel } from './format'

interface Props {
  scheme: Scheme
  onClose: () => void
}

/** Scheme detail panel (spec F6, simplified): rules, documents, links, freshness. */
export default function SchemeDetail({ scheme: s, onClose }: Props) {
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
  const docs = [...s.documents, ...s.other_documents]

  return (
    <div className="ex-modal" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ex-modal__panel" role="dialog" aria-modal="true" aria-labelledby="ex-detail-title">
        <header className="ex-modal__header">
          <div>
            <div className="ex-chip-row">
              {s.categories.map((c) => <span key={c} className="ex-chip">{c}</span>)}
            </div>
            <h2 id="ex-detail-title" className="ex-modal__title">{s.name}</h2>
            <p className="ex-modal__meta">
              {s.scope === 'state' ? 'State scheme' : 'Central scheme'} · {placeLabel(s)} · {deadlineLabel(s)}
            </p>
          </div>
          <button ref={closeRef} type="button" className="ex-icon-btn" onClick={onClose} aria-label="Close details">
            ✕
          </button>
        </header>

        <div className="ex-modal__body">
          <p className="ex-notice">
            Preliminary information from public sources. The government department makes the final decision.
          </p>
          {s.stale && (
            <p className="ex-notice ex-notice--warn">
              This information was last checked on {formatDate(s.verified)} and may be out of date. Confirm on the official page.
            </p>
          )}

          <section className="ex-section">
            <h3 className="ex-section__title">Who can apply</h3>
            <ul className="ex-list">
              {eligibilityLines(s).map((line) => <li key={line}>{line}</li>)}
            </ul>
          </section>

          <section className="ex-section">
            <h3 className="ex-section__title">Documents you will need ({docs.length})</h3>
            {docs.length ? (
              <ul className="ex-checklist">
                {docs.map((d) => <li key={d}>{d}</li>)}
              </ul>
            ) : (
              <p className="ex-muted">No document list recorded. Check the official page.</p>
            )}
          </section>

          <section className="ex-section">
            <h3 className="ex-section__title">Official links</h3>
            <div className="ex-links">
              {s.apply_url && (
                <a className="ex-btn ex-btn--primary" href={s.apply_url} target="_blank" rel="noopener noreferrer">
                  Apply on official portal ↗
                </a>
              )}
              {s.source_url && (
                <a className="ex-btn" href={s.source_url} target="_blank" rel="noopener noreferrer">
                  {genericSource ? 'myScheme portal ↗' : 'Scheme source page ↗'}
                </a>
              )}
            </div>
            <p className="ex-muted">
              Last verified {formatDate(s.verified)}. Sarthi does not submit applications for you.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

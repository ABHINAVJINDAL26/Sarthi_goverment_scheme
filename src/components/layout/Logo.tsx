import { useI18n } from '../../i18n'

/**
 * Sarthi mark: a chariot wheel (the "saarthi" guides the chariot) in saffron.
 * Drawn in SVG so it is sharp at every size and weighs almost nothing.
 */
export function LogoMark({ size = 36 }: { size?: number }) {
  const spokes = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4)
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="#fff7ed" stroke="#c2410c" strokeWidth="3" />
      {spokes.map((a) => (
        <line key={a} x1="20" y1="20" x2={20 + 14 * Math.cos(a)} y2={20 + 14 * Math.sin(a)}
          stroke="#c2410c" strokeWidth="2.2" strokeLinecap="round" />
      ))}
      <circle cx="20" cy="20" r="4.5" fill="#0f2a4a" />
    </svg>
  )
}

export default function Logo({ inverted = false, showTagline = true }: { inverted?: boolean; showTagline?: boolean }) {
  const { t } = useI18n()
  return (
    <span className={`s-logo ${inverted ? 's-logo--inverted' : ''}`}>
      <LogoMark />
      <span className="s-logo__text">
        <span className="s-logo__name">{t('app.name')}</span>
        {showTagline && <span className="s-logo__tagline">{t('app.tagline')}</span>}
      </span>
    </span>
  )
}

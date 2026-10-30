export default function CategorySchemesSection() {
  return (
<section className="category-schemes-section" aria-label="Discover Schemes by Category">
      <div className="category-container">
        {/* Header Block */}
        <div className="category-header">
          <span className="category-eyebrow">EXPLORE SCHEMES</span>
          <p className="category-subtext">
            Explore government support across different areas of life.
          </p>
        </div>

        {/* Content Layout: 4 Cards on Left + 1 Category Grid Box on Right */}
        <div className="category-main-grid">

          {/* Card 1: Education Schemes */}
          <div className="scheme-feature-card">
            <div className="scheme-card__illustration scheme-card__illustration--education">
              {/* Sky */}
              <svg viewBox="0 0 220 160" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0}}>
                {/* Sky gradient */}
                <defs>
                  <linearGradient id="edu-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dbeafe"/>
                    <stop offset="100%" stopColor="#eff6ff"/>
                  </linearGradient>
                </defs>
                <rect width="220" height="160" fill="url(#edu-sky)"/>
                {/* Ground strip */}
                <rect y="118" width="220" height="42" fill="#bbf7d0" rx="0"/>
                {/* College building */}
                <rect x="130" y="55" width="70" height="65" fill="#f1f5f9" rx="3"/>
                <rect x="118" y="68" width="84" height="52" fill="#e2e8f0" rx="2"/>
                <rect x="140" y="76" width="12" height="10" fill="#93c5fd" rx="1"/>
                <rect x="158" y="76" width="12" height="10" fill="#93c5fd" rx="1"/>
                <rect x="176" y="76" width="12" height="10" fill="#93c5fd" rx="1"/>
                <rect x="140" y="92" width="12" height="10" fill="#93c5fd" rx="1"/>
                <rect x="158" y="92" width="12" height="10" fill="#93c5fd" rx="1"/>
                <rect x="176" y="92" width="12" height="10" fill="#93c5fd" rx="1"/>
                {/* Door */}
                <rect x="154" y="105" width="14" height="15" fill="#94a3b8" rx="1"/>
                {/* Flag on building */}
                <line x1="161" y1="55" x2="161" y2="42" stroke="#64748b" strokeWidth="1.5"/>
                <rect x="161" y="42" width="12" height="6" fill="#f85c13" rx="1"/>
                {/* Trees left */}
                <ellipse cx="20" cy="98" rx="14" ry="18" fill="#4ade80"/>
                <rect x="17" y="110" width="6" height="10" fill="#92400e"/>
                <ellipse cx="45" cy="105" rx="10" ry="13" fill="#22c55e"/>
                <rect x="42" y="113" width="5" height="8" fill="#92400e"/>
                {/* Student character */}
                {/* Head */}
                <circle cx="88" cy="60" r="16" fill="#fed7aa"/>
                {/* Graduation cap */}
                <rect x="74" y="48" width="28" height="5" fill="#1e3a5f" rx="1"/>
                <rect x="82" y="44" width="12" height="5" fill="#1e3a5f" rx="1"/>
                <line x1="102" y1="50" x2="108" y2="56" stroke="#f85c13" strokeWidth="2"/>
                <circle cx="108" cy="57" r="3" fill="#f85c13"/>
                {/* Hair */}
                <path d="M72 60c0-10 7-17 16-17s16 7 16 17" fill="#1f2937"/>
                {/* Face */}
                <circle cx="84" cy="62" r="1.5" fill="#78350f"/>
                <circle cx="92" cy="62" r="1.5" fill="#78350f"/>
                <path d="M84 68q4 3 8 0" stroke="#c2410c" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                {/* Body - blue shirt */}
                <path d="M68 76c0-6 8-10 20-10s20 4 20 10v44H68z" fill="#2563eb"/>
                {/* Backpack */}
                <rect x="104" y="76" width="18" height="24" fill="#ea580c" rx="4"/>
                <rect x="107" y="80" width="12" height="8" fill="#f97316" rx="2"/>
                {/* Books held */}
                <rect x="65" y="90" width="10" height="14" fill="#fbbf24" rx="2"/>
                <rect x="62" y="92" width="10" height="14" fill="#34d399" rx="2"/>
                {/* Legs */}
                <rect x="75" y="118" width="12" height="18" fill="#1d4ed8" rx="2"/>
                <rect x="90" y="118" width="12" height="18" fill="#1d4ed8" rx="2"/>
                {/* Shoes */}
                <ellipse cx="81" cy="136" rx="7" ry="3" fill="#1e293b"/>
                <ellipse cx="96" cy="136" rx="7" ry="3" fill="#1e293b"/>
              </svg>
            </div>
            <div className="scheme-card__content">
              <h3 className="scheme-card__title">Education Schemes</h3>
              <p className="scheme-card__desc">Scholarships, fee support and learning opportunities for students.</p>
              <button type="button" className="scheme-card__btn">
                <span>Explore Education</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Card 2: Healthcare Schemes */}
          <div className="scheme-feature-card">
            <div className="scheme-card__illustration scheme-card__illustration--healthcare">
              <svg viewBox="0 0 220 160" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0}}>
                <defs>
                  <linearGradient id="hc-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fce7f3"/>
                    <stop offset="100%" stopColor="#fdf2f8"/>
                  </linearGradient>
                </defs>
                <rect width="220" height="160" fill="url(#hc-sky)"/>
                {/* Ground */}
                <rect y="118" width="220" height="42" fill="#fecdd3" rx="0"/>
                {/* Hospital building */}
                <rect x="125" y="48" width="80" height="72" fill="#f8fafc" rx="3"/>
                <rect x="122" y="62" width="84" height="58" fill="#f1f5f9" rx="2"/>
                {/* Windows */}
                <rect x="132" y="72" width="10" height="10" fill="#bfdbfe" rx="1"/>
                <rect x="148" y="72" width="10" height="10" fill="#bfdbfe" rx="1"/>
                <rect x="164" y="72" width="10" height="10" fill="#bfdbfe" rx="1"/>
                <rect x="180" y="72" width="10" height="10" fill="#bfdbfe" rx="1"/>
                <rect x="132" y="88" width="10" height="10" fill="#bfdbfe" rx="1"/>
                <rect x="148" y="88" width="10" height="10" fill="#bfdbfe" rx="1"/>
                <rect x="164" y="88" width="10" height="10" fill="#bfdbfe" rx="1"/>
                {/* Door */}
                <rect x="154" y="105" width="14" height="15" fill="#94a3b8" rx="1"/>
                {/* Red cross on hospital */}
                <rect x="158" y="50" width="6" height="18" fill="#ef4444" rx="1"/>
                <rect x="153" y="55" width="16" height="6" fill="#ef4444" rx="1"/>
                {/* Trees */}
                <ellipse cx="18" cy="100" rx="13" ry="16" fill="#86efac"/>
                <rect x="15" y="111" width="6" height="9" fill="#92400e"/>
                {/* Doctor character */}
                {/* Head */}
                <circle cx="84" cy="58" r="16" fill="#fde68a"/>
                {/* Hair - female */}
                <path d="M68 62c0-12 7-20 16-20s16 8 16 20" fill="#1f2937"/>
                <path d="M68 62c-2 4-2 10 2 12" fill="#1f2937"/>
                <path d="M100 62c2 4 2 10-2 12" fill="#1f2937"/>
                {/* Face */}
                <circle cx="80" cy="61" r="1.5" fill="#78350f"/>
                <circle cx="88" cy="61" r="1.5" fill="#78350f"/>
                <path d="M80 67q4 3 8 0" stroke="#c2410c" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                {/* Red cross badge on cap */}
                <rect x="81" y="40" width="6" height="14" fill="#ef4444" rx="1"/>
                <rect x="77" y="44" width="14" height="5" fill="#ef4444" rx="1"/>
                {/* White coat body */}
                <path d="M66 74c0-6 9-10 18-10s18 4 18 10v46H66z" fill="#f8fafc"/>
                <path d="M66 74l10 18" stroke="#e2e8f0" strokeWidth="1"/>
                <path d="M102 74l-10 18" stroke="#e2e8f0" strokeWidth="1"/>
                {/* Stethoscope */}
                <path d="M76 80q-4 8 0 16c4 6 14 6 14 0" stroke="#64748b" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <circle cx="90" cy="96" r="4" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5"/>
                {/* Legs */}
                <rect x="73" y="118" width="12" height="18" fill="#475569" rx="2"/>
                <rect x="87" y="118" width="12" height="18" fill="#475569" rx="2"/>
                <ellipse cx="79" cy="136" rx="7" ry="3" fill="#1e293b"/>
                <ellipse cx="93" cy="136" rx="7" ry="3" fill="#1e293b"/>
              </svg>
            </div>
            <div className="scheme-card__content">
              <h3 className="scheme-card__title">Healthcare Schemes</h3>
              <p className="scheme-card__desc">Health insurance, treatment support and wellness benefits for all.</p>
              <button type="button" className="scheme-card__btn">
                <span>Explore Healthcare</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Card 3: Agriculture Schemes */}
          <div className="scheme-feature-card">
            <div className="scheme-card__illustration scheme-card__illustration--agriculture">
              <svg viewBox="0 0 220 160" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0}}>
                <defs>
                  <linearGradient id="agri-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d1fae5"/>
                    <stop offset="100%" stopColor="#ecfdf5"/>
                  </linearGradient>
                </defs>
                <rect width="220" height="160" fill="url(#agri-sky)"/>
                {/* Ground / field */}
                <rect y="112" width="220" height="48" fill="#84cc16" rx="0"/>
                {/* Crop rows */}
                <line x1="0" y1="120" x2="220" y2="120" stroke="#65a30d" strokeWidth="2"/>
                <line x1="0" y1="128" x2="220" y2="128" stroke="#65a30d" strokeWidth="2"/>
                {/* Wheat stalks */}
                {[10,25,40,150,165,180,195,210].map((x,i) => (
                  <g key={i}>
                    <line x1={x} y1="112" x2={x} y2="130" stroke="#ca8a04" strokeWidth="2"/>
                    <ellipse cx={x} cy="108" rx="4" ry="7" fill="#fbbf24"/>
                  </g>
                ))}
                {/* Tractor body */}
                <rect x="120" y="90" width="72" height="32" fill="#f85c13" rx="5"/>
                <rect x="130" y="80" width="38" height="24" fill="#ea580c" rx="4"/>
                {/* Tractor windows */}
                <rect x="136" y="84" width="14" height="10" fill="#bfdbfe" rx="2"/>
                {/* Exhaust pipe */}
                <rect x="165" y="72" width="5" height="12" fill="#374151" rx="2"/>
                {/* Wheels */}
                <circle cx="136" cy="124" r="14" fill="#1f2937"/>
                <circle cx="136" cy="124" r="9" fill="#374151"/>
                <circle cx="136" cy="124" r="3" fill="#6b7280"/>
                <circle cx="182" cy="120" r="10" fill="#1f2937"/>
                <circle cx="182" cy="120" r="6" fill="#374151"/>
                <circle cx="182" cy="120" r="2" fill="#6b7280"/>
                {/* Farmer character */}
                {/* Head */}
                <circle cx="74" cy="66" r="15" fill="#c2855c"/>
                {/* Turban */}
                <path d="M58 65c0-15 6-24 16-24s16 9 16 24" fill="#f97316"/>
                <path d="M58 65q-2-3 0-5" stroke="#ea580c" strokeWidth="2" fill="none"/>
                <path d="M90 65q2-3 0-5" stroke="#ea580c" strokeWidth="2" fill="none"/>
                {/* Turban wrap lines */}
                <path d="M60 58q14-8 28 0" stroke="#ea580c" strokeWidth="1.2" fill="none"/>
                <path d="M62 54q12-6 24 0" stroke="#ea580c" strokeWidth="1" fill="none"/>
                {/* Face - older man with moustache */}
                <circle cx="70" cy="68" r="1.5" fill="#3b1a08"/>
                <circle cx="78" cy="68" r="1.5" fill="#3b1a08"/>
                <path d="M69 73q5 2 10 0" stroke="#7c4a1e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M70 72q2 3 4 3q2 0 4-3" fill="#6b3a1f"/>
                {/* White kurta / shirt */}
                <path d="M58 80c0-6 8-10 16-10s16 4 16 10v40H58z" fill="#f8fafc"/>
                {/* Wheat stalk in hand */}
                <line x1="46" y1="78" x2="58" y2="95" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round"/>
                <ellipse cx="44" cy="74" rx="5" ry="8" fill="#fbbf24"/>
                <ellipse cx="42" cy="70" rx="4" ry="6" fill="#fde68a"/>
                {/* Legs */}
                <rect x="64" y="118" width="11" height="18" fill="#78350f" rx="2"/>
                <rect x="78" y="118" width="11" height="18" fill="#78350f" rx="2"/>
                <ellipse cx="70" cy="136" rx="7" ry="3" fill="#1e293b"/>
                <ellipse cx="84" cy="136" rx="7" ry="3" fill="#1e293b"/>
              </svg>
            </div>
            <div className="scheme-card__content">
              <h3 className="scheme-card__title">Agriculture Schemes</h3>
              <p className="scheme-card__desc">Financial support, subsidies and resources for farmers and rural communities.</p>
              <button type="button" className="scheme-card__btn">
                <span>Explore Agriculture</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Card 4: Employment Schemes */}
          <div className="scheme-feature-card">
            <div className="scheme-card__illustration scheme-card__illustration--employment">
              <svg viewBox="0 0 220 160" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0}}>
                <defs>
                  <linearGradient id="emp-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e0f2fe"/>
                    <stop offset="100%" stopColor="#f0f9ff"/>
                  </linearGradient>
                </defs>
                <rect width="220" height="160" fill="url(#emp-sky)"/>
                {/* Ground */}
                <rect y="118" width="220" height="42" fill="#bfdbfe" rx="0"/>
                {/* Office buildings right */}
                <rect x="140" y="30" width="28" height="92" fill="#e2e8f0" rx="3"/>
                <rect x="172" y="50" width="22" height="72" fill="#f1f5f9" rx="3"/>
                <rect x="196" y="65" width="24" height="57" fill="#e2e8f0" rx="3"/>
                {/* Windows - building 1 */}
                {[0,1,2,3,4].map(r => [0,1].map(c => (
                  <rect key={`b1-${r}-${c}`} x={144+c*13} y={36+r*15} width="10" height="8" fill="#bfdbfe" rx="1"/>
                )))}
                {/* Windows - building 2 */}
                {[0,1,2,3].map(r => (
                  <rect key={`b2-${r}`} x="176" y={56+r*15} width="14" height="8" fill="#bfdbfe" rx="1"/>
                ))}
                {/* Trees left */}
                <ellipse cx="18" cy="98" rx="14" ry="18" fill="#4ade80"/>
                <rect x="15" y="110" width="6" height="10" fill="#92400e"/>
                <ellipse cx="40" cy="106" rx="10" ry="13" fill="#22c55e"/>
                <rect x="37" y="114" width="6" height="8" fill="#92400e"/>
                {/* Professional character */}
                {/* Head */}
                <circle cx="84" cy="58" r="15" fill="#fed7aa"/>
                {/* Hair */}
                <path d="M69 56c0-10 6-16 15-16s15 6 15 16" fill="#111827"/>
                {/* Face */}
                <circle cx="79" cy="60" r="1.5" fill="#78350f"/>
                <circle cx="89" cy="60" r="1.5" fill="#78350f"/>
                <path d="M79 66q5 3 10 0" stroke="#c2410c" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                {/* Suit - dark blue */}
                <path d="M66 73c0-6 9-10 18-10s18 4 18 10v47H66z" fill="#1e3a5f"/>
                {/* Shirt collar & tie */}
                <path d="M80 73l-5 12 5-5 5 5-5-12z" fill="#f8fafc"/>
                <rect x="82" y="80" width="4" height="14" fill="#ef4444" rx="1"/>
                {/* Suit lapels */}
                <path d="M66 73l14 20" stroke="#1e40af" strokeWidth="1.5" fill="none"/>
                <path d="M102 73l-14 20" stroke="#1e40af" strokeWidth="1.5" fill="none"/>
                {/* Laptop in hand */}
                <rect x="100" y="92" width="26" height="18" fill="#334155" rx="3"/>
                <rect x="102" y="94" width="22" height="14" fill="#60a5fa" rx="2"/>
                <rect x="98" y="109" width="30" height="3" fill="#1e293b" rx="1"/>
                {/* Hand */}
                <ellipse cx="100" cy="100" rx="5" ry="8" fill="#fde68a"/>
                {/* Legs */}
                <rect x="72" y="118" width="12" height="18" fill="#1e3a5f" rx="2"/>
                <rect x="86" y="118" width="12" height="18" fill="#1e3a5f" rx="2"/>
                <ellipse cx="78" cy="136" rx="7" ry="3" fill="#1e293b"/>
                <ellipse cx="92" cy="136" rx="7" ry="3" fill="#1e293b"/>
              </svg>
            </div>
            <div className="scheme-card__content">
              <h3 className="scheme-card__title">Employment Schemes</h3>
              <p className="scheme-card__desc">Job opportunities, skill development and self-employment support.</p>
              <button type="button" className="scheme-card__btn">
                <span>Explore Employment</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Right Side: 3×2 Icon Grid + Divider + Orange Button */}
          <div className="scheme-side-categories">

            {/* Row 1 — 3 items */}
            <div className="side-cat-row">

              {/* Housing Schemes */}
              <div className="side-cat-item">
                <div className="side-cat-circle side-cat-circle--teal">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 10.5 12 3l9 7.5" />
                    <path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
                  </svg>
                </div>
                <span className="side-cat-item__label">Housing Schemes</span>
                <span className="side-cat-item__arrow">→</span>
              </div>

              {/* Women & Child */}
              <div className="side-cat-item">
                <div className="side-cat-circle side-cat-circle--coral">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-1a3 3 0 0 0-3-3h-1" />
                    <circle cx="19" cy="11" r="2.5" />
                  </svg>
                </div>
                <span className="side-cat-item__label">Women &amp; Child Schemes</span>
                <span className="side-cat-item__arrow">→</span>
              </div>

              {/* Senior Citizen */}
              <div className="side-cat-item">
                <div className="side-cat-circle side-cat-circle--blue">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="5" r="3" />
                    <path d="M10 8v8l-3 4" />
                    <path d="M10 12l4-2v6l3 4" />
                    <line x1="19" y1="12" x2="19" y2="21" />
                    <path d="M18 12a1 1 0 0 1 2 0" />
                  </svg>
                </div>
                <span className="side-cat-item__label">Senior Citizen Schemes</span>
                <span className="side-cat-item__arrow">→</span>
              </div>

            </div>

            {/* Horizontal divider */}
            <hr className="side-cat-divider" />

            {/* Row 2 — 3 items */}
            <div className="side-cat-row">

              {/* Disability */}
              <div className="side-cat-item">
                <div className="side-cat-circle side-cat-circle--purple">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="4" r="2" />
                    <path d="M12 9v5h4" />
                    <path d="M18 19a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" />
                  </svg>
                </div>
                <span className="side-cat-item__label">Disability Schemes</span>
                <span className="side-cat-item__arrow">→</span>
              </div>

              {/* Business */}
              <div className="side-cat-item">
                <div className="side-cat-circle side-cat-circle--indigo">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                    <path d="M2 7h20" />
                  </svg>
                </div>
                <span className="side-cat-item__label">Business Schemes</span>
                <span className="side-cat-item__arrow">→</span>
              </div>

              {/* More */}
              <div className="side-cat-item">
                <div className="side-cat-circle side-cat-circle--amber">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="#ffffff">
                    <circle cx="5" cy="12" r="2.2" />
                    <circle cx="12" cy="12" r="2.2" />
                    <circle cx="19" cy="12" r="2.2" />
                  </svg>
                </div>
                <span className="side-cat-item__label">More Categories</span>
                <span className="side-cat-item__arrow">→</span>
              </div>

            </div>

            {/* Solid Orange Action Button */}
            <button type="button" className="side-cat-all-btn">
              <span>View All Scheme Categories</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}


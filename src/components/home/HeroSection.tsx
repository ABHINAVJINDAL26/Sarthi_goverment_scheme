interface HeroSectionProps {
  onSearch: (query: string) => void
  searchQuery: string
  onCategorySelect: (category: string) => void
}

export default function HeroSection({ onSearch, searchQuery, onCategorySelect }: HeroSectionProps) {
  return (
<section className="hero-section" aria-label="Find government schemes">
      <div className="hero-container">
        {/* Left content pane */}
        <div className="hero-content">
          <p className="hero-eyebrow">GOVERNMENT SCHEMES FOR A BRIGHTER INDIA</p>

          <h1 className="hero-heading">
            Find the Right
            <span className="hero-heading__line2">
              <span className="hero-heading--orange">Government Scheme</span>{' '}
              <span className="hero-heading--green">for You</span>
            </span>
          </h1>

          <p className="hero-subtext">
            Explore, compare and apply for central and state government schemes easily.<br />
            Get personalized recommendations based on your needs.
          </p>

          {/* Hero Search Bar */}
          <form
            className="hero-search"
            onSubmit={(e) => {
              e.preventDefault()
              const q = (e.currentTarget.querySelector('input') as HTMLInputElement).value.trim()
              if (q) onSearch(q)
            }}
          >
            <span className="hero-search__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              type="search"
              className="hero-search__input"
              placeholder="Search schemes by name, category or keyword..."
              aria-label="Search government schemes"
            />
            <button type="submit" className="hero-search__btn">
              <span>Search</span>
              <span className="hero-search__btn-arrow" aria-hidden="true">→</span>
            </button>
          </form>
          {searchQuery && (
            <p className="hero-search-result" role="status">
              Showing scheme results for “{searchQuery}”
            </p>
          )}

          {/* Category Pills */}
          <div className="hero-categories" role="list" aria-label="Browse by category">
            {[
              {
                label: 'Education',
                icon: (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                  </svg>
                ),
              },
              {
                label: 'Health',
                icon: (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="#ef4444" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                ),
              },
              {
                label: 'Employment',
                icon: (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#854d0e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="13" x="3" y="7" rx="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                ),
              },
              {
                label: 'Agriculture',
                icon: (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22v-9" />
                    <path d="M12 13a6 6 0 0 0 6-6c0-3-2.5-4-6-4s-6 1-6 4a6 6 0 0 0 6 6Z" />
                  </svg>
                ),
              },
              {
                label: 'Housing',
                icon: (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 10.5 12 3l9 7.5" />
                    <path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
                  </svg>
                ),
              },
              {
                label: 'More',
                icon: (
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="#475569">
                    <rect x="3" y="3" width="4.5" height="4.5" rx="1" />
                    <rect x="9.75" y="3" width="4.5" height="4.5" rx="1" />
                    <rect x="16.5" y="3" width="4.5" height="4.5" rx="1" />
                    <rect x="3" y="9.75" width="4.5" height="4.5" rx="1" />
                    <rect x="9.75" y="9.75" width="4.5" height="4.5" rx="1" />
                    <rect x="16.5" y="9.75" width="4.5" height="4.5" rx="1" />
                    <rect x="3" y="16.5" width="4.5" height="4.5" rx="1" />
                    <rect x="9.75" y="16.5" width="4.5" height="4.5" rx="1" />
                    <rect x="16.5" y="16.5" width="4.5" height="4.5" rx="1" />
                  </svg>
                ),
              },
            ].map((cat) => (
              <button key={cat.label} type="button" className="hero-cat-pill" role="listitem" onClick={() => onCategorySelect(cat.label)}>
                <span className="hero-cat-pill__icon" aria-hidden="true">{cat.icon}</span>
                <span className="hero-cat-pill__label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

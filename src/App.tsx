import React, { useState, useRef, useEffect } from 'react'

// 4-column language grid (matches the reference design)
const LANG_COLUMNS = [
  [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'mr', label: 'मराठी' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'or', label: 'ଓଡ଼ିଆ' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'ml', label: 'മലയാളം' },
  ],
  [
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'as', label: 'অসমীয়া' },
    { code: 'kok', label: 'कोंकणी' },
    { code: 'sa', label: 'संस्कृतम्' },
    { code: 'mai', label: 'मैथिली' },
    { code: 'bho', label: 'बड़' },
    { code: 'sd', label: 'सिन्धी' },
    { code: 'mni', label: 'मणिपुरी' },
    { code: 'ne', label: 'नेपाली' },
  ],
  [
    { code: 'ur', label: 'اردو' },
    { code: 'ks', label: 'کشمیری' },
    { code: 'az', label: 'Azərbaycan' },
    { code: 'be', label: 'Беларус' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'ru', label: 'русский' },
    { code: 'nl', label: 'Dutch' },
  ],
  [
    { code: 'fr', label: 'français' },
    { code: 'pt', label: 'português' },
    { code: 'kk', label: 'Қазақ' },
    { code: 'ky', label: 'Кыргызча' },
    { code: 'tg', label: 'Точик' },
    { code: 'uz', label: "O'zbek" },
    { code: 'es', label: 'Español' },
    { code: 'zh-CN', label: '简体中文' },
    { code: 'zh-TW', label: '中国传统的' },
    { code: 'fa', label: 'فارسی' },
  ],
]
const ALL_LANGS = LANG_COLUMNS.flat()

const navigationItems = [
  'Home',
  'Explore',
  'My Schemes',
  'Checklist',
  'Saved',
  'Family',
  'Assistant',
  'Help',
]

const accountMenuItems = [
  'Profile',
  'Saved',
  'Checklist',
  'Notifications',
  'Settings',
  'Help',
  'Clear all data on this device',
  'Sign out',
]

const bottomTabs = [
  { id: 'Home', label: 'Home' },
  { id: 'Explore', label: 'Explore' },
  { id: 'My Schemes', label: 'My Schemes' },
  { id: 'Family', label: 'Family' },
  { id: 'Assistant', label: 'Assistant' },
]

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function AccessibilityIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="8" r="2" />
      <path d="M7 13a5 5 0 0 1 10 0" />
      <line x1="12" y1="13" x2="12" y2="18" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function TabIcon({ id }: { id: string }) {
  if (id === 'Home') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  }
  if (id === 'Explore') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    )
  }
  if (id === 'My Schemes') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    )
  }
  if (id === 'Family') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }
  // Assistant
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="10" x2="9.01" y2="10" />
      <line x1="12" y1="10" x2="12.01" y2="10" />
      <line x1="15" y1="10" x2="15.01" y2="10" />
    </svg>
  )
}

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [currentLang, setCurrentLang] = useState('English')
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Home')
  const [activeTab, setActiveTab] = useState('Home')
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isMemberOpen, setIsMemberOpen] = useState(false)
  const [isBellOpen, setIsBellOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [collapsedItems, setCollapsedItems] = useState<string[]>([])

  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const navContainerRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const memberRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLLIElement>(null)
  const langRef = useRef<HTMLDivElement>(null)

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false)
      }
      if (memberRef.current && !memberRef.current.contains(event.target as Node)) {
        setIsMemberOpen(false)
      }
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsBellOpen(false)
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false)
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsAccountOpen(false)
        setIsMemberOpen(false)
        setIsBellOpen(false)
        setIsMoreOpen(false)
        setIsLangOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Responsive Navigation Collapse into "More"
  // Order of collapse when space is constrained: Help, Saved, Checklist
  useEffect(() => {
    function checkOverflow() {
      if (!navContainerRef.current) return
      const containerWidth = navContainerRef.current.clientWidth

      // If width < 1000px, start collapsing in specified order: Help, Saved, Checklist
      if (containerWidth < 740) {
        setCollapsedItems(['Help', 'Saved', 'Checklist'])
      } else if (containerWidth < 850) {
        setCollapsedItems(['Help', 'Saved'])
      } else if (containerWidth < 980) {
        setCollapsedItems(['Help'])
      } else {
        setCollapsedItems([])
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [])

  const visibleNavItems = navigationItems.filter(item => !collapsedItems.includes(item))

  return (
    <>
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="site-header" role="banner">

        {/* ====================================================================
            UTILITY BAR (Top Bar: #252525)
            ==================================================================== */}
        <div className="government-bar">
          <div className="header-container government-bar__inner">

            {/* Government identity */}
            <div className="government-identity">
              <img
                className="government-logo"
                src="/assets/header/government-of-india.png"
                alt="Government of India"
              />
              <span className="official-divider" aria-hidden="true" />
              <img
                className="ministry-logo"
                src="/assets/header/ministry-commerce-industry.png"
                alt="Ministry of Commerce and Industry"
              />
              <span className="social-divider" aria-hidden="true" />
              <nav className="social-links" aria-label="Social media">
                <a className="social-link social-link--facebook" href="#" aria-label="Facebook">
                  f
                </a>
                <a className="social-link social-link--x" href="#" aria-label="X">
                  X
                </a>
                <a className="social-link social-link--linkedin" href="#" aria-label="LinkedIn">
                  in
                </a>
              </nav>
            </div>

            {/* Utility bar items: Find a helper | Accessibility */}
            <div className="utility-actions">
              <button type="button" className="utility-btn">
                <MapPinIcon />
                <span>Find a helper</span>
              </button>

              <span className="utility-vdivider" aria-hidden="true" />

              <button type="button" className="utility-btn">
                <AccessibilityIcon />
                <span>Accessibility</span>
              </button>
            </div>

          </div>
        </div>

        {/* ====================================================================
            MAIN BAR (Middle Bar: #FFFFFF)
            ==================================================================== */}
        <div className="brand-row">
          <div className="header-container brand-row__inner">

            {/* Brand Cluster & Language Control */}
            <div className="brand-cluster">
              <img
                className="bharat-yojana-logo"
                src="/assets/header/BharatYojanaLogo.png"
                alt="Bharat Yojana"
              />
              <span className="brand-divider" aria-hidden="true" />
              <img
                className="azadi-logo"
                src="/assets/header/azadi-ka-amrit-mahotsav.png"
                alt="Azadi Ka Amrit Mahotsav"
              />
              <span className="brand-divider brand-divider--short" aria-hidden="true" />

              {/* Language Dropdown — opens on hover */}
              <div
                className="lang-dropdown"
                ref={langRef}
                onMouseEnter={() => setIsLangOpen(true)}
                onMouseLeave={() => setIsLangOpen(false)}
              >
                <button
                  type="button"
                  className="lang-dropdown__trigger"
                  aria-haspopup="listbox"
                  aria-expanded={isLangOpen}
                >
                  <span>{currentLang.toUpperCase()}</span>
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isLangOpen && (
                  <div className="lang-dropdown__panel" role="listbox" aria-label="Select language">
                    <div className="lang-dropdown__grid">
                      {LANG_COLUMNS.map((col, ci) => (
                        <ul key={ci} className="lang-dropdown__col">
                          {col.map(lang => (
                            <li key={lang.code}>
                              <button
                                type="button"
                                role="option"
                                aria-selected={currentLang === lang.label}
                                className={`lang-dropdown__item ${currentLang === lang.label ? 'is-active' : ''}`}
                                onClick={() => {
                                  setCurrentLang(lang.label)
                                  setIsLangOpen(false)
                                }}
                              >
                                {lang.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Header Actions: Search, Auth Controls, Partner Emblem */}
            <div className="header-actions">

              {/* Expandable Search Unit */}
              <form
                className={`search ${searchQuery.trim().length > 0 ? 'has-value' : ''}`}
                role="search"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (searchQuery.trim()) {
                    alert(`Searching for: ${searchQuery}`)
                  }
                }}
              >
                <label className="sr-only" htmlFor="site-search">
                  Search
                </label>
                <input
                  ref={searchInputRef}
                  id="site-search"
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  aria-label="Search"
                  onClick={() => {
                    if (!searchQuery.trim() && searchInputRef.current) {
                      searchInputRef.current.focus()
                    }
                  }}
                >
                  <SearchIcon />
                </button>
              </form>

              {/* Signed Out State: Login */}
              {!isSignedIn ? (
                <button
                  type="button"
                  className="login-link"
                  onClick={() => setIsSignedIn(true)}
                  title="Click to log in"
                >
                  Login
                </button>
              ) : (
                /* Signed In State: Notification bell, Member switcher, Account menu */
                <div className="signed-in-group">

                  {/* Notification Bell */}
                  <div className="menu-container" ref={bellRef}>
                    <button
                      type="button"
                      className="notification-bell-btn"
                      aria-label="2 unread notifications"
                      aria-haspopup="true"
                      aria-expanded={isBellOpen}
                      onClick={() => setIsBellOpen(!isBellOpen)}
                    >
                      <BellIcon />
                      <span className="bell-badge" aria-hidden="true">2</span>
                    </button>

                    {isBellOpen && (
                      <ul className="header-dropdown-menu bell-dropdown" role="menu">
                        <li className="dropdown-row">
                          <strong>PM Kisan:</strong> 16th installment released
                        </li>
                        <li className="dropdown-row">
                          <strong>Checklist:</strong> Aadhaar update pending
                        </li>
                      </ul>
                    )}
                  </div>

                  {/* Member Switcher */}
                  <div className="menu-container" ref={memberRef}>
                    <button
                      type="button"
                      className="member-switcher-btn"
                      aria-haspopup="true"
                      aria-expanded={isMemberOpen}
                      onClick={() => setIsMemberOpen(!isMemberOpen)}
                    >
                      <span className="member-avatar">A</span>
                      <span className="member-name">Asha</span>
                      <ChevronDownIcon />
                    </button>

                    {isMemberOpen && (
                      <ul className="header-dropdown-menu" role="menu" aria-label="Member selection">
                        <li>
                          <button type="button" className="dropdown-row" role="menuitem" onClick={() => setIsMemberOpen(false)}>
                            <span className="member-avatar member-avatar--sm">A</span>
                            <span>Asha (Self)</span>
                          </button>
                        </li>
                        <li>
                          <button type="button" className="dropdown-row" role="menuitem" onClick={() => setIsMemberOpen(false)}>
                            <span className="member-avatar member-avatar--sm">R</span>
                            <span>Rajesh (Husband)</span>
                          </button>
                        </li>
                        <li>
                          <button type="button" className="dropdown-row" role="menuitem" onClick={() => setIsMemberOpen(false)}>
                            <span className="member-avatar member-avatar--sm">S</span>
                            <span>Sunita (Daughter)</span>
                          </button>
                        </li>
                        <li className="dropdown-divider-line" role="separator" />
                        <li>
                          <button type="button" className="dropdown-row dropdown-row--accent" role="menuitem" onClick={() => setIsMemberOpen(false)}>
                            + Add Member
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>

                  {/* Account Menu */}
                  <div className="menu-container" ref={accountRef}>
                    <button
                      type="button"
                      className="account-menu-btn"
                      aria-haspopup="true"
                      aria-expanded={isAccountOpen}
                      onClick={() => setIsAccountOpen(!isAccountOpen)}
                    >
                      <span>Account</span>
                      <ChevronDownIcon />
                    </button>

                    {isAccountOpen && (
                      <ul className="header-dropdown-menu account-dropdown" role="menu" aria-label="Account menu">
                        {accountMenuItems.map((item) => (
                          <li key={item}>
                            <button
                              type="button"
                              className={`dropdown-row ${item === 'Clear all data on this device' ? 'dropdown-row--danger' : ''} ${item === 'Sign out' ? 'dropdown-row--signout' : ''}`}
                              role="menuitem"
                              onClick={() => {
                                setIsAccountOpen(false)
                                if (item === 'Sign out') {
                                  setIsSignedIn(false)
                                }
                              }}
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                </div>
              )}

              {/* Register Animation Button — visible only when signed out */}
              {!isSignedIn && (
                <button
                  type="button"
                  className="register-animation-btn"
                  onClick={() => alert('Register clicked')}
                  aria-label="Register"
                  title="Register"
                >
                  <img
                    src="/assets/header/RegisterAnimation.gif"
                    alt="Register"
                    className="register-animation-img"
                  />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ====================================================================
            NAVIGATION ROW (Bottom Tier)
            ==================================================================== */}
        <nav className="primary-navigation" aria-label="Primary navigation">
          <div className="header-container" ref={navContainerRef}>
            <ul>
              {visibleNavItems.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className={`nav-link-btn ${activeNav === item ? 'is-active' : ''}`}
                    onClick={() => setActiveNav(item)}
                    aria-current={activeNav === item ? 'page' : undefined}
                  >
                    {item}
                  </button>
                </li>
              ))}

              {/* More Menu (Only when items don't fit) */}
              {collapsedItems.length > 0 && (
                <li className="menu-container" ref={moreRef}>
                  <button
                    type="button"
                    className="nav-link-btn nav-link-btn--more"
                    aria-haspopup="true"
                    aria-expanded={isMoreOpen}
                    onClick={() => setIsMoreOpen(!isMoreOpen)}
                  >
                    <span>More</span>
                    <ChevronDownIcon />
                  </button>

                  {isMoreOpen && (
                    <ul className="header-dropdown-menu more-dropdown" role="menu">
                      {collapsedItems.map((item) => (
                        <li key={item}>
                          <button
                            type="button"
                            className="dropdown-row"
                            role="menuitem"
                            onClick={() => {
                              setActiveNav(item)
                              setIsMoreOpen(false)
                            }}
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )}
            </ul>
          </div>
        </nav>

      </header>

      {/* ====================================================================
          HERO / BANNER SECTION
          ==================================================================== */}
      <main id="main-content">
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
                  const q = (e.currentTarget.querySelector('input') as HTMLInputElement).value
                  if (q.trim()) alert(`Searching: ${q}`)
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
                  <button key={cat.label} type="button" className="hero-cat-pill" role="listitem">
                    <span className="hero-cat-pill__icon" aria-hidden="true">{cat.icon}</span>
                    <span className="hero-cat-pill__label">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            PORTAL STATISTICS SECTION (Matching Government Portal Reference)
            ==================================================================== */}
        <section className="portal-stats-bar" aria-label="Portal Statistics">
          <div className="portal-stats-container">
            <div className="portal-stats-grid">

              {/* Col 1: Government Schemes (Departments/Entities style) */}
              <div className="portal-stat-col">
                <div className="portal-stat-header">
                  <span className="portal-stat-icon" aria-hidden="true">
                    <svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#2c3e50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="10" y="5" width="12" height="23" rx="1" />
                      <rect x="4" y="11" width="6" height="17" rx="1" />
                      <rect x="22" y="11" width="6" height="17" rx="1" />
                      <rect x="13" y="9" width="2" height="2" fill="#2c3e50" />
                      <rect x="17" y="9" width="2" height="2" fill="#2c3e50" />
                      <rect x="13" y="14" width="2" height="2" fill="#2c3e50" />
                      <rect x="17" y="14" width="2" height="2" fill="#2c3e50" />
                      <rect x="13" y="19" width="2" height="2" fill="#2c3e50" />
                      <rect x="17" y="19" width="2" height="2" fill="#2c3e50" />
                      <rect x="6" y="15" width="2" height="2" fill="#2c3e50" />
                      <rect x="6" y="20" width="2" height="2" fill="#2c3e50" />
                      <rect x="24" y="15" width="2" height="2" fill="#2c3e50" />
                      <rect x="24" y="20" width="2" height="2" fill="#2c3e50" />
                      <line x1="2" y1="28" x2="30" y2="28" strokeWidth="2" />
                    </svg>
                  </span>
                  <span className="portal-stat-title">Government Schemes</span>
                </div>
                <div className="portal-stat-body portal-stat-body--split">
                  <div className="portal-stat-metric">
                    <span className="portal-stat-label">Central</span>
                    <span className="portal-stat-value">80</span>
                  </div>
                  <div className="portal-stat-metric">
                    <span className="portal-stat-label">State</span>
                    <span className="portal-stat-value">162</span>
                  </div>
                </div>
              </div>

              {/* Col 2: Eligibility Checks (Services style) */}
              <div className="portal-stat-col">
                <div className="portal-stat-header">
                  <span className="portal-stat-icon" aria-hidden="true">
                    <svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#2c3e50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="6" width="12" height="22" rx="2" />
                      <line x1="8" y1="9" x2="12" y2="9" />
                      <circle cx="10" cy="24" r="1" fill="#2c3e50" />
                      <path d="M14 8h10a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H16" />
                      <line x1="18" y1="13" x2="23" y2="13" />
                      <line x1="18" y1="17" x2="23" y2="17" />
                      <line x1="18" y1="21" x2="23" y2="21" />
                      <line x1="18" y1="25" x2="21" y2="25" />
                    </svg>
                  </span>
                  <span className="portal-stat-title">Eligibility Checks</span>
                </div>
                <div className="portal-stat-body portal-stat-body--split">
                  <div className="portal-stat-metric">
                    <span className="portal-stat-label">Central</span>
                    <span className="portal-stat-value">889</span>
                  </div>
                  <div className="portal-stat-metric">
                    <span className="portal-stat-label">State</span>
                    <span className="portal-stat-value">1,726</span>
                  </div>
                </div>
              </div>

              {/* Col 3: Documents Analysed (Registrations style) */}
              <div className="portal-stat-col">
                <div className="portal-stat-header">
                  <span className="portal-stat-icon" aria-hidden="true">
                    <svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#2c3e50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="4" width="18" height="24" rx="2" />
                      <circle cx="14" cy="11" r="3" />
                      <path d="M9 19c0-2.5 2-4 5-4s5 1.5 5 4" />
                      <line x1="9" y1="23" x2="16" y2="23" />
                      <path d="M20 18c0 4 5 7 5 7s5-3 5-7v-3l-5-2-5 2v3z" fill="#f0f7fc" stroke="#00669e" strokeWidth="1.6" />
                      <path d="m23 20 1.5 1.5 3-3" stroke="#00669e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="portal-stat-title">Documents Analysed</span>
                </div>
                <div className="portal-stat-body">
                  <div className="portal-stat-metric">
                    <span className="portal-stat-label">Total</span>
                    <span className="portal-stat-value">12.59 Crores</span>
                  </div>
                </div>
              </div>

              {/* Col 4: Verified Sources (Transactions style) */}
              <div className="portal-stat-col">
                <div className="portal-stat-header">
                  <span className="portal-stat-icon" aria-hidden="true">
                    <svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#2c3e50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="7" width="22" height="16" rx="2" />
                      <line x1="4" y1="12" x2="26" y2="12" />
                      <line x1="7" y1="16" x2="11" y2="16" />
                      <line x1="7" y1="19" x2="14" y2="19" />
                      <path d="M20 17c0 4 5 7 5 7s5-3 5-7v-3l-5-2-5 2v3z" fill="#f0f7fc" stroke="#00669e" strokeWidth="1.6" />
                      <path d="m23 19 1.5 1.5 3-3" stroke="#00669e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="portal-stat-title">Verified Sources</span>
                </div>
                <div className="portal-stat-body">
                  <div className="portal-stat-metric">
                    <span className="portal-stat-label">Total</span>
                    <span className="portal-stat-value">806.98 Crores</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ====================================================================
            DISCOVER SCHEMES BY CATEGORY SECTION
            ==================================================================== */}
        <section className="category-schemes-section" aria-label="Discover Schemes by Category">
          <div className="category-container">
            {/* Header Block */}
            <div className="category-header">
              <span className="category-eyebrow">EXPLORE SCHEMES</span>
              <div className="category-tricolor-line" aria-hidden="true">
                <span className="category-tricolor-line__saffron" />
                <span className="category-tricolor-line__white" />
                <span className="category-tricolor-line__green" />
              </div>
              <h2 className="category-heading">
                Discover Schemes by{' '}
                <span className="category-heading__cat">Cat</span><span className="category-heading__egory">egory</span>
              </h2>
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

        {/* ====================================================================
            HOW SARTHI WORKS SECTION
            ==================================================================== */}
        <section className="how-section" aria-label="How Sarthi Works">
          <div className="how-container">

            {/* Header */}
            <div className="how-header">
              <span className="how-eyebrow">HOW SARTHI WORKS</span>
              <div className="how-tricolor" aria-hidden="true">
                <span className="how-tricolor__s" />
                <span className="how-tricolor__w" />
                <span className="how-tricolor__g" />
              </div>
              <h2 className="how-heading">
                Your Path to Government Benefits, Made{' '}
                <span className="how-heading--orange">Simple</span>
              </h2>
              <p className="how-subtext">
                From your profile to practical application guidance, Sarthi helps you take the next step with confidence.
              </p>
            </div>

            {/* Step numbers + connector line */}
            <div className="how-steps-track" aria-hidden="true">
              <span className="how-step-badge">01</span>
              <span className="how-step-badge">02</span>
              <span className="how-step-badge">03</span>
            </div>

            {/* 3 Cards */}
            <div className="how-cards-grid">

              {/* Card 1 */}
              <div className="how-card">
                <div className="how-card__img-wrap">
                  <img src="/assets/header/HowImage1.jpg" alt="Tell Us About You" className="how-card__img" />
                </div>
                <div className="how-card__body">
                  <h3 className="how-card__title">Tell Us About You</h3>
                  <p className="how-card__desc">
                    Share a few details about your age, location, income and situation. Skip questions that don't apply.
                  </p>
                  <div className="how-card__tag">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#f85c13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>Personalised profile</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="how-card">
                <div className="how-card__img-wrap">
                  <img src="/assets/header/HowImage2.jpg" alt="Discover Your Matches" className="how-card__img" />
                </div>
                <div className="how-card__body">
                  <h3 className="how-card__title">Discover Your Matches</h3>
                  <p className="how-card__desc">
                    Explore relevant schemes and see why you may qualify, including missing information.
                  </p>
                  <div className="how-card__tag">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#f85c13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                    <span>Explainable eligibility</span>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="how-card">
                <div className="how-card__img-wrap">
                  <img src="/assets/header/HowImage3.jpg" alt="Get Guided to Apply" className="how-card__img" />
                </div>
                <div className="how-card__body">
                  <h3 className="how-card__title">Get Guided to Apply</h3>
                  <p className="how-card__desc">
                    Review required documents, learn how to obtain missing items, then continue on the official portal.
                  </p>
                  <div className="how-card__tag">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#f85c13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="9" y1="13" x2="15" y2="13"/>
                      <line x1="9" y1="17" x2="13" y2="17"/>
                    </svg>
                    <span>Practical next steps</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Trust info row */}
            <div className="how-trust-row">
              <div className="how-trust-item">
                <span className="how-trust-icon how-trust-icon--green">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </span>
                <div>
                  <p className="how-trust-title">Official sources &amp; verification dates</p>
                  <p className="how-trust-desc">Information from government portals, with last-updated dates.</p>
                </div>
              </div>
              <div className="how-trust-item">
                <span className="how-trust-icon how-trust-icon--orange">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f85c13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22V12"/>
                    <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
                    <path d="M12 2a5 5 0 0 1 5 5c0 2-5 5-5 5S7 9 7 7a5 5 0 0 1 5-5z"/>
                  </svg>
                </span>
                <div>
                  <p className="how-trust-title">Preliminary results — government decides</p>
                  <p className="how-trust-desc">We show likely matches based on rules. Final approval is by the government authority.</p>
                </div>
              </div>
              <div className="how-trust-item">
                <span className="how-trust-icon how-trust-icon--blue">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <div>
                  <p className="how-trust-title">Your data, your consent</p>
                  <p className="how-trust-desc">We collect only what is needed and keep your information secure and private.</p>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="how-cta-row">
              <button type="button" className="how-cta-primary">
                Check Eligibility <span aria-hidden="true">→</span>
              </button>
              <button type="button" className="how-cta-ghost">
                Browse all schemes <span aria-hidden="true">→</span>
              </button>
            </div>

          </div>
        </section>
      </main>


      {/* ====================================================================
          BOTTOM TABS (Mobile View)
          ==================================================================== */}
      <nav className="mobile-bottom-tabs" aria-label="Mobile bottom navigation">
        {bottomTabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              className={`mobile-tab-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id)
                setActiveNav(tab.id)
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <TabIcon id={tab.id} />
              <span className="mobile-tab-label">{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}

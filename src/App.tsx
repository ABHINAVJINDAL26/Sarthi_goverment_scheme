import { useState } from 'react'
import {
  HeroSection,
  PortalStatsSection,
  CategorySchemesSection,
  HowSarthiWorksSection,
  StateSchemesSection,
  FooterSection,
} from './components/home'
import {
  SiteHeader,
  MobileBottomTabs,
} from './components/layout'
import { useState, useRef, useEffect } from 'react'
import HeroSection from './components/home/HeroSection'
import PortalStatsSection from './components/home/PortalStatsSection'
import CategorySchemesSection from './components/home/CategorySchemesSection'
import HowSarthiWorksSection from './components/home/HowSarthiWorksSection'
import MobileBottomTabs from './components/layout/MobileBottomTabs'
import { SearchIcon, MapPinIcon, AccessibilityIcon, BellIcon, ChevronDownIcon } from './components/ui/icons'

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
    { code: 'bho', label: 'भोजपुरी' },
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
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'fa', label: 'فارسی' },
  ],
]
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

export default function App() {
  const [activeNav, setActiveNav] = useState('Home')
  const [activeTab, setActiveTab] = useState('Home')

  return (
    <>
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Global Header */}
      <SiteHeader
        activeNav={activeNav}
        onNavChange={(item) => {
          setActiveNav(item)
          setActiveTab(item)
        }}
      />
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
                  onClick={() => setIsLangOpen(!isLangOpen)}
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

      {/* Main Home Sections */}
      <main id="main-content">
        {/* 1. Hero / Search Banner */}
        <HeroSection />

        {/* 2. Platform Statistics */}
        <PortalStatsSection />

        {/* 3. Discover Schemes by Category */}
        <CategorySchemesSection />

        {/* 4. How Sarthi Works */}
        <HowSarthiWorksSection />

        {/* 5. Central / State-Specific Schemes & Interactive Map */}
        <StateSchemesSection />
      </main>

      {/* Global Footer */}
      <FooterSection />

      {/* Mobile Bottom Navigation */}
      <MobileBottomTabs
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId)
          setActiveNav(tabId)
        }}
      />
    </>
  )
}

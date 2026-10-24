const bottomTabs = [
  { id: 'Home', label: 'Home' },
  { id: 'Explore', label: 'Explore' },
  { id: 'My Schemes', label: 'My Schemes' },
  { id: 'Family', label: 'Family' },
  { id: 'Assistant', label: 'Assistant' },
]

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
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="10" x2="9.01" y2="10" />
      <line x1="12" y1="10" x2="12.01" y2="10" />
      <line x1="15" y1="10" x2="15.01" y2="10" />
    </svg>
  )
}

interface MobileBottomTabsProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function MobileBottomTabs({ activeTab, onTabChange }: MobileBottomTabsProps) {
  return (
    <nav className="mobile-bottom-tabs" aria-label="Mobile bottom navigation">
      {bottomTabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            className={`mobile-tab-btn ${isActive ? 'is-active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <TabIcon id={tab.id} />
            <span className="mobile-tab-label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

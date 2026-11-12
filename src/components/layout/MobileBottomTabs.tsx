import { HomeIcon, ExploreIcon, DescriptionIcon, FamilyIcon, AssistantIcon } from '../ui/icons'

const bottomTabs = [
  { id: 'Home', label: 'Home' },
  { id: 'Explore', label: 'Explore' },
  { id: 'My Schemes', label: 'My Schemes' },
  { id: 'Family', label: 'Family' },
  { id: 'Assistant', label: 'Assistant' },
]

function TabIcon({ id }: { id: string }) {
  if (id === 'Home') {
    return <HomeIcon width={22} height={22} />
  }
  if (id === 'Explore') {
    return <ExploreIcon width={22} height={22} />
  }
  if (id === 'My Schemes') {
    return <DescriptionIcon width={22} height={22} />
  }
  if (id === 'Family') {
    return <FamilyIcon width={22} height={22} />
  }
  return <AssistantIcon width={22} height={22} />
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

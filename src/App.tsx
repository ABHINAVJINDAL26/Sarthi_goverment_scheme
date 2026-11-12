import { useState } from 'react'
import {
  HeroSection,
  PortalStatsSection,
  CategorySchemesSection,
  HowSarthiWorksSection,
  StateSchemesSection,
  FooterSection,
} from './components/home'
import { SiteHeader, MobileBottomTabs } from './components/layout'
import ExplorePage from './features/explore/ExplorePage'
import { navigate, useLocation } from './lib/router'

// Nav items that have their own page. The others are not built yet and keep the home page.
const ROUTES: Record<string, string> = { Home: '/', Explore: '/explore' }

export default function App() {
  const location = useLocation()
  const isExplore = location.pathname.replace(/\/+$/, '') === '/explore'
  const [pendingNav, setPendingNav] = useState<string | null>(null)
  const activeNav = isExplore ? 'Explore' : pendingNav ?? 'Home'

  const handleNav = (item: string) => {
    const path = ROUTES[item]
    if (path) {
      setPendingNav(null)
      navigate(path)
    } else {
      setPendingNav(item)
    }
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <SiteHeader activeNav={activeNav} onNavChange={handleNav} />

      <main id="main-content">
        {isExplore ? (
          <ExplorePage initialSearch={location.search} />
        ) : (
          <>
            <HeroSection />
            <PortalStatsSection />
            <CategorySchemesSection />
            <HowSarthiWorksSection />
            <StateSchemesSection />
          </>
        )}
      </main>

      <FooterSection />

      <MobileBottomTabs activeTab={activeNav} onTabChange={handleNav} />
    </>
  )
}

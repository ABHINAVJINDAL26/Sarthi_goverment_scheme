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

export default function App() {
  const [activeNav, setActiveNav] = useState('Home')
  const [activeTab, setActiveTab] = useState('Home')

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <SiteHeader
        activeNav={activeNav}
        onNavChange={(item) => {
          setActiveNav(item)
          setActiveTab(item)
        }}
      />

      <main id="main-content">
        <HeroSection />
        <PortalStatsSection />
        <CategorySchemesSection />
        <HowSarthiWorksSection />
        <StateSchemesSection />
      </main>

      <FooterSection />

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

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

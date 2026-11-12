import { useEffect } from 'react'
import './components/layout/layout.css'
import AppHeader from './components/layout/AppHeader'
import AppFooter from './components/layout/AppFooter'
import BottomNav from './components/layout/BottomNav'
import ExplorePage from './features/explore/ExplorePage'
import HomePage from './features/home/HomePage'
import HelpPage from './features/help/HelpPage'
import { I18nProvider, useI18n } from './i18n'
import { useLocation } from './lib/router'

function routeFor(pathname: string): 'home' | 'explore' | 'help' {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/explore') return 'explore'
  if (path === '/help') return 'help'
  return 'home'
}

function Shell() {
  const location = useLocation()
  const { t } = useI18n()
  const route = routeFor(location.pathname)

  useEffect(() => {
    const titles = { home: t('app.tagline'), explore: t('nav.explore'), help: t('nav.help') }
    document.title = `${titles[route]} | ${t('app.name')}`
  }, [route, t])

  return (
    <>
      <a href="#main-content" className="skip-link">{t('app.skip')}</a>
      <AppHeader active={route} />
      <main id="main-content">
        {route === 'explore' && <ExplorePage initialSearch={location.search} />}
        {route === 'help' && <HelpPage />}
        {route === 'home' && <HomePage />}
      </main>
      <AppFooter />
      <BottomNav active={route} />
    </>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <Shell />
    </I18nProvider>
  )
}

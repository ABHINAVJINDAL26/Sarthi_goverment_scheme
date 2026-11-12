import { useEffect, useState } from 'react'

/**
 * Minimal path router (no extra dependency). Pages: "/" and "/explore".
 * The dev/preview server falls back to index.html for unknown paths; production
 * hosting needs the same SPA fallback rule.
 */
const EVENT = 'app:navigate'

export function navigate(to: string, { replace = false } = {}) {
  if (to === window.location.pathname + window.location.search) return
  window.history[replace ? 'replaceState' : 'pushState'](null, '', to)
  window.dispatchEvent(new Event(EVENT))
  if (!replace) window.scrollTo({ top: 0 })
}

export function useLocation() {
  const read = () => ({ pathname: window.location.pathname, search: window.location.search })
  const [location, setLocation] = useState(read)
  useEffect(() => {
    const update = () => setLocation(read())
    window.addEventListener('popstate', update)
    window.addEventListener(EVENT, update)
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener(EVENT, update)
    }
  }, [])
  return location
}

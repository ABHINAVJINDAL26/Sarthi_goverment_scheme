import { useEffect, useMemo, useState } from 'react'
import { buildIndex, type SearchIndex } from './search'
import type { SchemesPayload } from './types'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: SchemesPayload }

// Loaded once per page session and shared by every component that asks.
let cache: Promise<SchemesPayload> | null = null

function loadSchemes(): Promise<SchemesPayload> {
  cache ??= fetch('/data/schemes.json').then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json() as Promise<SchemesPayload>
  })
  cache.catch(() => { cache = null }) // allow a retry after a failed load
  return cache
}

export function useSchemes(): State & { index: SearchIndex | null; retry: () => void } {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    setState({ status: 'loading' })
    loadSchemes()
      .then((data) => alive && setState({ status: 'ready', data }))
      .catch((err: Error) => alive && setState({ status: 'error', message: err.message }))
    return () => { alive = false }
  }, [attempt])

  const index = useMemo(() => (state.status === 'ready' ? buildIndex(state.data.schemes) : null), [state])
  return { ...state, index, retry: () => setAttempt((n) => n + 1) }
}

import { useEffect, useMemo, useState } from 'react'
import { buildIndex, type SearchIndex } from './search'
import type { SchemesPayload } from './types'

/** Where the scheme data came from: the Sarthi API, or the bundled file when the API is not reachable. */
export type SchemesSource = 'api' | 'static'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: SchemesPayload; source: SchemesSource }

/** API base URL. Empty = same origin (Vite proxies /api to the backend in development). */
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')
const API_TIMEOUT_MS = 4000

async function fetchJson(url: string, timeoutMs?: number): Promise<unknown> {
  const controller = new AbortController()
  const timer = timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    // A static host answers unknown paths with index.html; that is not the API.
    if (!res.headers.get('content-type')?.includes('application/json')) throw new Error('not JSON')
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

/** Schemes from the backend API: { success, data: { version, as_of, count, schemes } }. */
async function fromApi(): Promise<SchemesPayload> {
  const body = (await fetchJson(`${API_BASE}/api/schemes`, API_TIMEOUT_MS)) as { success?: boolean; data?: SchemesPayload }
  if (!body?.success || !Array.isArray(body.data?.schemes)) throw new Error('unexpected API response')
  return body.data
}

async function fromStatic(): Promise<SchemesPayload> {
  return (await fetchJson('/data/schemes.json')) as SchemesPayload
}

// Loaded once per page session and shared by every component that asks.
let cache: Promise<{ data: SchemesPayload; source: SchemesSource }> | null = null

function loadSchemes() {
  cache ??= fromApi()
    .then((data) => ({ data, source: 'api' as const }))
    .catch(() => fromStatic().then((data) => ({ data, source: 'static' as const })))
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
      .then(({ data, source }) => alive && setState({ status: 'ready', data, source }))
      .catch((err: Error) => alive && setState({ status: 'error', message: err.message }))
    return () => { alive = false }
  }, [attempt])

  const index = useMemo(() => (state.status === 'ready' ? buildIndex(state.data.schemes) : null), [state])
  return { ...state, index, retry: () => setAttempt((n) => n + 1) }
}

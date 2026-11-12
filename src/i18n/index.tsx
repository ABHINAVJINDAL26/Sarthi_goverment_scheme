import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import en, { type MessageKey } from './en'
import hi from './hi'
import { AUDIENCE_TERMS, CATEGORY_HI, CATEGORY_SHORT_EN, DOCUMENT_HI, OCCUPATION_TERMS, STATE_HI } from './dataTerms'

export type Lang = 'en' | 'hi'
type Vars = Record<string, string | number>

const MESSAGES: Record<Lang, Record<MessageKey, string>> = { en, hi }
const STORAGE_KEY = 'sarthi.lang'

function initialLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'hi') return saved
  } catch {
    // storage blocked (private mode): fall through
  }
  return navigator.language?.toLowerCase().startsWith('hi') ? 'hi' : 'en'
}

export interface I18n {
  lang: Lang
  setLang: (lang: Lang) => void
  /** UI string with {placeholders} filled in. */
  t: (key: MessageKey, vars?: Vars) => string
  /** Number in the current locale (Indian digit grouping). */
  num: (n: number) => string
  /** "13 Nov 2026" / "13 नव॰ 2026" from an ISO date. */
  date: (iso: string) => string
  category: (name: string, short?: boolean) => string
  occupation: (id: string) => string
  audience: (id: string) => string
  document: (name: string) => string
  stateName: (name: string) => string
}

const I18nContext = createContext<I18n | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore: language still works for this visit
    }
  }, [lang])

  const setLang = useCallback((next: Lang) => setLangState(next), [])

  const value = useMemo<I18n>(() => {
    const locale = lang === 'hi' ? 'hi-IN' : 'en-IN'
    const fill = (text: string, vars?: Vars) =>
      vars ? text.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`)) : text
    return {
      lang,
      setLang,
      t: (key, vars) => fill(MESSAGES[lang][key] ?? en[key], vars),
      num: (n) => n.toLocaleString(locale),
      date: (iso) =>
        new Date(iso + 'T00:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
      category: (name, short = false) =>
        lang === 'hi' ? CATEGORY_HI[name] ?? name : short ? CATEGORY_SHORT_EN[name] ?? name : name,
      occupation: (id) => OCCUPATION_TERMS[id]?.[lang] ?? id,
      audience: (id) => AUDIENCE_TERMS[id]?.[lang] ?? id,
      document: (name) => (lang === 'hi' ? DOCUMENT_HI[name] ?? name : name),
      stateName: (name) => (lang === 'hi' ? STATE_HI[name] ?? name : name),
    }
  }, [lang, setLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}

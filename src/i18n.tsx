import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { en, fr, type Dict } from './content'

export type Lang = 'fr' | 'en'
interface Ctx { lang: Lang; t: Dict; setLang: (l: Lang) => void }
const I18nCtx = createContext<Ctx | null>(null)
const KEY = 'abidi-lang'

function initial(): Lang {
  try {
    const s = localStorage.getItem(KEY)
    if (s === 'fr' || s === 'en') return s
  } catch { /* storage blocked: fall back to French */ }
  return 'fr'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setL] = useState<Lang>(initial)
  const setLang = (l: Lang) => {
    setL(l)
    try { localStorage.setItem(KEY, l) } catch { /* ignore */ }
  }
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  return <I18nCtx.Provider value={{ lang, t: lang === 'fr' ? fr : en, setLang }}>{children}</I18nCtx.Provider>
}

export function useI18n(): Ctx {
  const c = useContext(I18nCtx)
  if (!c) throw new Error('useI18n outside provider')
  return c
}

/** Renders trusted copy that contains a little inline markup. */
export const Html = ({ s, as: Tag = 'span', className }: { s: string; as?: 'span' | 'p' | 'h3' | 'b'; className?: string }) =>
  <Tag className={className} dangerouslySetInnerHTML={{ __html: s }} />

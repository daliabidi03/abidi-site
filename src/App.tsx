import { useEffect, useState } from 'react'
import { useI18n } from './i18n'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Fingerprint, Signature } from './components/Fingerprint'
import { Trajectory } from './components/Trajectory'
import { Pricer } from './components/Pricer'
import { Contact, Education, Experience, Projects, Skills } from './components/Sections'
import { Beyond } from './components/Beyond'
import { Terminal } from './components/Terminal'
import { Recruiter } from './components/Recruiter'

const TAB_OF: Record<string, string> = {
  top: 'top', empreinte: 'empreinte', trajectoire: 'empreinte', pricer: 'pricer', experience: 'experience',
  projets: 'experience', competences: 'experience', 'au-dela': 'experience', formation: 'experience', contact: 'contact',
}

function TabBar() {
  const { t } = useI18n()
  const [on, setOn] = useState('top')
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setOn(TAB_OF[e.target.id]) }), { rootMargin: '-45% 0px -50% 0px' })
    Object.keys(TAB_OF).forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])
  return (
    <nav className="tabbar" aria-label="Navigation">
      {t.tabs.map(([id, label]) => <a key={id} href={'#' + id} className={on === id ? 'on' : ''}>{label}</a>)}
    </nav>
  )
}

export default function App() {
  const { t } = useI18n()
  const [term, setTerm] = useState(false)
  const [rec, setRec] = useState(false)

  // "/" opens the terminal from anywhere except text fields; Esc closes overlays.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
      if (e.key === '/' && !typing && !term && !rec) { e.preventDefault(); setTerm(true) }
      if (e.key === 'Escape') { setTerm(false); setRec(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [term, rec])

  useEffect(() => {
    document.body.style.overflow = term || rec ? 'hidden' : ''
  }, [term, rec])

  return (
    <>
      <Header onTerminal={() => setTerm(true)} />
      <main className="wrap">
        <Hero onRecruiter={() => setRec(true)} onTerminal={() => setTerm(true)} />
        <Fingerprint />
        <Trajectory />
        <Pricer />
        <Experience />
        <Projects />
        <Skills />
        <Beyond />
        <Education />
        <Contact />
        <TabBar />
        <footer>
          <span className="sig"><Signature />© {new Date().getFullYear()} Mouhamed Ali Abidi</span>
          <span>{t.footer}</span>
        </footer>
      </main>
      {term && <Terminal onClose={() => setTerm(false)} onRecruiter={() => { setTerm(false); setRec(true) }} />}
      {rec && <Recruiter onClose={() => setRec(false)} />}
    </>
  )
}

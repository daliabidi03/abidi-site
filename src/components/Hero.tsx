import { useEffect, useRef, useState } from 'react'
import { LINKS, ME } from '../content'
import { useI18n } from '../i18n'
import { startHero } from '../lib/heroEngine'
import portraitUrl from '../assets/portrait.jpg'

type Api = ReturnType<typeof startHero>['api']

export function Hero({ onRecruiter, onTerminal }: { onRecruiter: () => void; onTerminal: () => void }) {
  const { t, lang } = useI18n()
  const nameRef = useRef<HTMLCanvasElement>(null)
  const ptRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const spreadRef = useRef<HTMLOutputElement>(null)
  const api = useRef<Api | null>(null)
  const [count, setCount] = useState(0)
  const [clear, setClear] = useState(false)
  const touch = typeof matchMedia !== 'undefined' && matchMedia('(hover: none)').matches

  useEffect(() => {
    const h = startHero({
      name: nameRef.current!, portrait: ptRef.current!, frame: frameRef.current!,
      img: imgRef.current!, spreadOut: spreadRef.current!, onCount: setCount,
    })
    api.current = h.api
    return h.dispose
  }, [])
  useEffect(() => { api.current?.setClear(clear) }, [clear])

  return (
    <div className="hero" id="top">
      <div className="eyebrow"><span><b>ABIDI.MA</b> · {t.hero.eyebrowL}</span><span>{t.hero.eyebrowR}</span></div>
      <div className="hero-grid">
        <div className="hero-main">
          <div className="stage">
            {/* The visible name is drawn in the canvas; the h1 wraps it and carries the text. */}
            <h1 className="name">
              <span className="sr">{ME}</span>
              <canvas ref={nameRef} id="nameCv" aria-hidden="true" />
            </h1>
            <span className="hint">{touch ? t.hero.hintTouch : t.hero.hint}</span>
          </div>
          <p className="role"><strong>{t.hero.roleStrong}</strong>{t.hero.role}</p>
          <div className="links">
            <a href={'mailto:' + LINKS.email}>{LINKS.email}</a>
            <a href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>
            <a href={LINKS.github} target="_blank" rel="noopener">GitHub ↗</a>
            <span>{LINKS.phone}</span>
          </div>
          <div className="cta">
            <button type="button" onClick={onRecruiter}>{t.hero.recruiter}</button>
            <button type="button" className="ghost" onClick={onTerminal}>{t.hero.terminal} <kbd>/</kbd></button>
          </div>
          <div className="instr">
            <span className="eq">dX<sub>t</sub> = θ(μ − X<sub>t</sub>)dt + σ dW<sub>t</sub></span>
            <span className="read"><span>{t.hero.ouText}</span></span>
            <span className="read"><span>θ = 4 · σ = 4.5</span><span>{t.hero.spread} : <output ref={spreadRef}>0.0</output> px</span></span>
            <div className="btns">
              <button type="button" onClick={() => api.current?.shock()}>{t.hero.shock}</button>
              <button type="button" className="ghost" onClick={() => api.current?.calm()}>{t.hero.calm}</button>
            </div>
          </div>
        </div>
        <figure className="portrait">
          <div className={'pframe' + (clear ? ' clear' : '')} ref={frameRef}>
            <img ref={imgRef} src={portraitUrl} alt={t.hero.photoAlt} />
            <canvas ref={ptRef} aria-hidden="true" />
          </div>
          <figcaption>
            <span>{t.hero.portrait} · {count.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')} {t.hero.processes}</span>
            <button type="button" className="ghost" aria-pressed={clear} onClick={() => setClear(c => !c)}>
              {clear ? t.hero.dots : t.hero.sharp}
            </button>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { person, experience, projects } from '@/data/content'
import FluidCursor from '@/components/FluidCursor'
import AuroraBg from '@/components/AuroraBg'
import dynamic from 'next/dynamic'

const HammerGirl = dynamic(() => import('@/components/HammerGirl'), { ssr: false })

export default function HomePage() {
  const [fluidCursor, setFluidCursor] = useState(false)
  const [auroraBg, setAuroraBg] = useState(false)
  const [glassCards, setGlassCards] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [showGirl, setShowGirl] = useState(false)
  const [girlFading, setGirlFading] = useState(false)
  const [destroying, setDestroying] = useState(false)
  const [whiteOut, setWhiteOut] = useState(false)
  const optionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
        setShowOptions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleDestroy() {
    if (destroying) return
    setShowGirl(true)
  }

  function handleImpact() {
    setGirlFading(true)          // fade girl out immediately on impact
    setDestroying(true)
    setTimeout(() => setShowGirl(false), 1800)   // unmount after fade completes
    setTimeout(() => setWhiteOut(true), 1800)
    setTimeout(() => {
      setDestroying(false)
      setWhiteOut(false)
      setGirlFading(false)
    }, 3400)
  }

  return (
    <>
      {fluidCursor && <FluidCursor />}

      {auroraBg && (
        <>
          <style>{`body { background: transparent !important; } main { position: relative; z-index: 1; }`}</style>
          <AuroraBg />
        </>
      )}

      {glassCards && (
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');
          body { font-family: 'DM Sans', system-ui, sans-serif; color: #111111; }
          main { padding: 0 15%; }
          .page-header, section {
            background: rgba(255, 255, 255, 0.20);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border-radius: 14px;
            padding: 24px 32px;
            margin-bottom: 16px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
            color: #111111;
          }
          nav { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
          nav a {
            background: rgba(255, 255, 255, 0.24);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 4px 16px;
            text-decoration: none;
            color: #111111;
            display: inline-block;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          }
          nav a:hover { background: rgba(255, 255, 255, 0.42); }
          fieldset {
            background: rgba(255, 255, 255, 0.20);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border-radius: 14px;
            border: none;
            margin-top: 8px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
            color: #111111;
          }
          hr { border: none; border-top: 1px solid rgba(0, 0, 0, 0.08); }
          h2, h3 { color: #111111; }
        `}</style>
      )}

      {destroying && (
        <style>{`
          @keyframes fly-left {
            0%   { transform: translate(0,0) rotate(0deg); opacity: 1; }
            15%  { transform: translate(-12px,-8px) rotate(-3deg); opacity: 1; }
            100% { transform: translate(-120vw, 60vh) rotate(-28deg); opacity: 0; }
          }
          @keyframes fly-right {
            0%   { transform: translate(0,0) rotate(0deg); opacity: 1; }
            15%  { transform: translate(12px,-8px) rotate(3deg); opacity: 1; }
            100% { transform: translate(120vw, 60vh) rotate(28deg); opacity: 0; }
          }
          @keyframes fly-up {
            0%   { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
            15%  { transform: translate(0,-20px) rotate(-1deg) scale(1.02); }
            100% { transform: translate(-20vw,-120vh) rotate(-15deg) scale(0.4); opacity: 0; }
          }
          @keyframes fly-up-right {
            0%   { transform: translate(0,0) rotate(0deg); opacity: 1; }
            15%  { transform: translate(10px,-15px) rotate(2deg); }
            100% { transform: translate(30vw,-120vh) rotate(12deg) scale(0.5); opacity: 0; }
          }
          @keyframes shake {
            0%,100% { transform: translate(0,0) rotate(0deg); }
            10% { transform: translate(-6px,4px) rotate(-1.5deg); }
            20% { transform: translate(8px,-4px) rotate(2deg); }
            30% { transform: translate(-10px,6px) rotate(-2.5deg); }
            40% { transform: translate(6px,-8px) rotate(1.5deg); }
            50% { transform: translate(-8px,4px) rotate(-2deg); }
            60% { transform: translate(10px,-4px) rotate(3deg); }
            70% { transform: translate(-6px,6px) rotate(-1.5deg); }
            80% { transform: translate(8px,-4px) rotate(2deg); }
            90% { transform: translate(-4px,2px) rotate(-1deg); }
          }
          @keyframes fade-out {
            0%   { opacity: 1; }
            100% { opacity: 0; }
          }
          .page-header {
            animation: shake 0.4s ease-out, fly-up 1.6s 0.3s ease-in forwards;
          }
          #nav-area {
            animation: shake 0.3s ease-out, fly-up-right 1.4s 0.35s ease-in forwards;
          }
          h2 {
            animation: shake 0.3s ease-out, fly-left 1.4s 0.4s ease-in forwards;
          }
          hr {
            animation: fade-out 0.5s 0.2s ease-in forwards;
          }
          section:nth-child(odd) {
            animation: shake 0.4s ease-out, fly-left 1.5s 0.5s ease-in forwards;
          }
          section:nth-child(even) {
            animation: shake 0.4s ease-out, fly-right 1.5s 0.55s ease-in forwards;
          }
        `}</style>
      )}

      {/* White flash overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#ffffff',
        zIndex: 900,
        pointerEvents: 'none',
        opacity: whiteOut ? 1 : 0,
        transition: whiteOut ? 'opacity 0.6s ease-in' : 'opacity 0.3s ease-out',
      }} />

      {showGirl && (
        <div style={{
          opacity: girlFading ? 0 : 1,
          transition: 'opacity 1.8s ease-out',
          pointerEvents: 'none',
        }}>
          <HammerGirl onImpact={handleImpact} />
        </div>
      )}

      <main>
        <div className="page-header">
          <h1>{person.name}</h1>

          <p>
            {person.phone}
            {' · '}
            <a href={`mailto:${person.email}`}>{person.email}</a>
            {' · '}
            <a href={person.linkedin} target="_blank" rel="noreferrer">linkedin</a>
            {' · '}
            <a href={person.github} target="_blank" rel="noreferrer">github</a>
          </p>

          <p>{person.summary}</p>
        </div>

        <div ref={optionsRef} id="nav-area" style={{ marginTop: '1.4em' }}>
          <nav>
            <a href="#experience">Experience</a>
            {!glassCards && ' · '}
            <a href="#projects">Projects</a>
            {!glassCards && ' · '}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setShowOptions((v) => !v) }}
            >
              UI Options
            </a>
            {!glassCards && ' · '}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleDestroy() }}
              style={{ color: destroying ? '#999' : undefined }}
            >
              Destroy
            </a>
          </nav>

          {showOptions && (
            <fieldset style={{ marginTop: '0.8em' }}>
              <legend>Display</legend>
              <label>
                <input
                  type="checkbox"
                  checked={fluidCursor}
                  onChange={(e) => setFluidCursor(e.target.checked)}
                />
                {' '}Fluid distortion cursor
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  checked={auroraBg}
                  onChange={(e) => setAuroraBg(e.target.checked)}
                />
                {' '}Aurora background
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  checked={glassCards}
                  onChange={(e) => setGlassCards(e.target.checked)}
                />
                {' '}Glass UI
              </label>
            </fieldset>
          )}
        </div>

        <hr style={{ margin: '1.6em 0' }} />

        <h2 id="experience" style={{ marginBottom: '0.8em' }}>Experience</h2>

        {experience.map((job) => (
          <section key={`${job.company}-${job.period}`} style={{ marginBottom: '1.2em' }}>
            <h3>{job.title} at {job.company}</h3>
            <p><small>{job.period}</small></p>
            <ul>
              {job.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </section>
        ))}

        <hr style={{ margin: '1.6em 0' }} />

        <h2 id="projects" style={{ marginBottom: '0.8em' }}>Projects</h2>

        {projects.map((project) => (
          <section key={project.name} style={{ marginBottom: '1.2em' }}>
            <h3>{project.name}</h3>
            <p><small>{project.period}</small></p>
            <ul>
              {project.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </section>
        ))}
        <p style={{ marginTop: '2em', fontSize: '0.75em', opacity: 0.5 }}>
          <small>
            <a href="https://skfb.ly/6SxIn" target="_blank" rel="noreferrer">Reyce, Nuclear Hammer Girl with animation</a>
            {' '}by outcast945 is licensed under{' '}
            <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC Attribution 4.0</a>.
          </small>
        </p>
      </main>
    </>
  )
}

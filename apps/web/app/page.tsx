'use client'

import { useState, useRef, useEffect } from 'react'
import { person, experience, projects } from '@/data/content'
import FluidCursor from '@/components/FluidCursor'
import AuroraBg from '@/components/AuroraBg'

export default function HomePage() {
  const [fluidCursor, setFluidCursor] = useState(false)
  const [auroraBg, setAuroraBg] = useState(false)
  const [glassCards, setGlassCards] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
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
          body {
            font-family: 'DM Sans', system-ui, sans-serif;
            color: #111111;
          }
          main {
            padding: 0 15%;
          }
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
          nav {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
          }
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
          nav a:hover {
            background: rgba(255, 255, 255, 0.42);
          }
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
          hr {
            border: none;
            border-top: 1px solid rgba(0, 0, 0, 0.08);
          }
          h2 { color: #111111; }
          h3 { color: #111111; }
        `}</style>
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

        <div ref={optionsRef} style={{ marginTop: '1.4em' }}>
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
      </main>
    </>
  )
}

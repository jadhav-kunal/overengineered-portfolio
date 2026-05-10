'use client'

import { useState, useRef, useEffect } from 'react'
import { person, experience, projects } from '@/data/content'
import FluidCursor from '@/components/FluidCursor'

export default function HomePage() {
  const [hoverHighlight, setHoverHighlight] = useState(false)
  const [dotGrid, setDotGrid] = useState(false)
  const [fluidCursor, setFluidCursor] = useState(false)
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

      {hoverHighlight && (
        <style>{`
          section:hover { background-color: #ffffcc; }
          nav a:hover  { background-color: #ffffcc; }
        `}</style>
      )}

      {dotGrid && (
        <style>{`
          body {
            background-image: radial-gradient(#00000018 1px, transparent 1px);
            background-size: 22px 22px;
          }
        `}</style>
      )}

      <main>
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

        <div ref={optionsRef}>
          <nav>
            <a href="#experience">Experience</a>
            {' · '}
            <a href="#projects">Projects</a>
            {' · '}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setShowOptions((v) => !v) }}
            >
              UI Options
            </a>
          </nav>

          {showOptions && (
            <fieldset>
              <legend>Display</legend>
              <label>
                <input
                  type="checkbox"
                  checked={hoverHighlight}
                  onChange={(e) => setHoverHighlight(e.target.checked)}
                />
                {' '}Hover highlights
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  checked={dotGrid}
                  onChange={(e) => setDotGrid(e.target.checked)}
                />
                {' '}Dot grid background
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  checked={fluidCursor}
                  onChange={(e) => setFluidCursor(e.target.checked)}
                />
                {' '}Fluid distortion cursor
              </label>
            </fieldset>
          )}
        </div>

        <hr />

        <h2 id="experience">Experience</h2>

        {experience.map((job) => (
          <section key={`${job.company}-${job.period}`}>
            <h3>{job.title} at {job.company}</h3>
            <p><small>{job.period}</small></p>
            <ul>
              {job.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </section>
        ))}

        <hr />

        <h2 id="projects">Projects</h2>

        {projects.map((project) => (
          <section key={project.name}>
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

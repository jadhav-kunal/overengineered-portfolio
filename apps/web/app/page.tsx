import { person, experience, projects } from '@/data/content'

export default function HomePage() {
  return (
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

      <nav>
        <a href="#experience">Experience</a>
        {' · '}
        <a href="#projects">Projects</a>
      </nav>

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
  )
}

export const person = {
  name: 'Kunal Jadhav',
  title: 'Senior Full Stack Engineer',
  summary: 'Creative and hardworking engineer building systems that scale.',
  email: 'jadhavkunal1999@gmail.com',
  phone: '+1 970-970-0102',
  linkedin: 'https://linkedin.com/in/jadhav-kunal',
  github: 'https://github.com/jadhav-kunal',
}

export const experience = [
  {
    title: 'Senior Full Stack Developer',
    company: 'PwC',
    period: 'Aug 2024 – Dec 2025',
    bullets: [
      'Designed and built event-driven microservices using NestJS, Azure Service Bus, and Cosmos DB to manage homesites, milestones, and alerts across 6+ modules — improving scalability and decoupling services.',
      'Executed data migration of 1M+ records from SQL to Azure Cosmos DB via Azure Data Factory, achieving <5 minutes downtime through staged pipelines and validation checks.',
      'Built distributed change propagation system with job orchestration and Cosmos DB stored procedures, updating 10k+ homesites and ensuring consistency across microservices.',
      'Implemented job tracking and retry mechanisms for long-running operations, preventing partial failures and ensuring reliable execution across distributed services.',
    ],
  },
  {
    title: 'Technology Lead',
    company: 'Infosys',
    period: 'Feb 2024 – Jul 2024',
    bullets: [
      'Led a team of 5 developers and 3 QA engineers delivering features with Node.js and React, improving sprint predictability and ensuring consistent on-time releases.',
      'Diagnosed and resolved critical production issues impacting 40 areas caused by inconsistent state across services, restoring system stability within SLA timelines.',
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'Mindstix Software Labs',
    period: 'Jul 2022 – Jan 2024',
    bullets: [
      'Optimized ETL pipeline processing 120 CSV files every 2 hours via stream-based parsing and improved SQL queries — reducing processing time from 2 hours to under 1 hour.',
      'Improved backend APIs using GraphQL by optimizing resolvers and reducing redundant data fetching.',
      'Refactored 10,000+ lines of legacy code, reducing production defects by 60% based on release tracking.',
      'Built serverless workflows using Azure Functions for asynchronous processing.',
      'Awarded Excellence Award (top 10 of 250+ employees) and 2nd place out of 40 teams in a company-wide Cloud Innovation Hackathon.',
    ],
  },
]

export const projects = [
  {
    name: 'TrendScout AI - KG-RAG Market Intelligence',
    period: 'Jan 2026 – May 2026',
    bullets: [
      'Built a KG-RAG based conversational market intelligence system using Python, Neo4j, ChromaDB, and ASU Voyager LLM — enabling users to query multi-source tech trends with source-backed insights.',
      'Developed a data pipeline using Selenium and Playwright to scrape LinkedIn, Reddit, and TechCrunch, performing entity extraction and storing relationships in Neo4j to support semantic search and multi-hop reasoning.',
    ],
  },
  {
    name: 'Spendly - Expense Tracker',
    period: 'Feb 2026 – Mar 2026',
    bullets: [
      'Built full-stack expense tracker using React, TypeScript, Node.js, Express, and PostgreSQL — enabling add, edit, delete operations with category-based tracking and filtered views.',
      'Implemented real-time expense calculations and dashboard KPIs including total spend, monthly summaries, and category insights using Context API and optimized backend APIs.',
    ],
  },
]

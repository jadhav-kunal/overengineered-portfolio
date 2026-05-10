import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kunal Jadhav',
  description: 'Senior Full Stack Engineer — Distributed Systems · AI · Full Stack',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

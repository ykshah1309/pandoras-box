import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pandora\'s Box - Greek Goddess AI Companions',
  description: 'Experience wisdom, love, and guidance from ancient Greek goddesses through AI-powered conversations',
  keywords: ['AI', 'chatbot', 'Greek goddesses', 'women support', 'emotional guidance'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
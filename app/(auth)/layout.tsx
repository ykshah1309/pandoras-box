import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - Pandora\'s Box',
  description: 'Join the divine sisterhood of Greek goddess AI companions',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
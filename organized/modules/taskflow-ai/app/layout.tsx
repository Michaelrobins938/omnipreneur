import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import { Navigation } from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TaskFlow AI - AI-Powered Task Management for Remote Teams',
  description: 'Streamline your team\'s productivity with AI-powered task management, real-time collaboration, and intelligent automation.',
  keywords: 'task management, remote teams, AI automation, productivity, collaboration',
  authors: [{ name: 'TaskFlow AI Team' }],
  openGraph: {
    title: 'TaskFlow AI - AI-Powered Task Management',
    description: 'Streamline your team\'s productivity with AI-powered task management',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TaskFlow AI - AI-Powered Task Management',
    description: 'Streamline your team\'s productivity with AI-powered task management',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navigation />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Luna - AI-Powered Business Platform',
  description: 'Transform your business with cutting-edge AI tools. Generate viral content, optimize performance, and scale your operations with unprecedented efficiency.',
  keywords: ['AI', 'Business', 'Automation', 'Content Generation', 'Analytics'],
  authors: [{ name: 'Luna Team' }],
  creator: 'Luna',
  publisher: 'Luna',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luna-web-psi.vercel.app/',
    title: 'Luna - AI-Powered Business Platform',
    description: 'Transform your business with cutting-edge AI tools.',
    siteName: 'Luna',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luna - AI-Powered Business Platform',
    description: 'Transform your business with cutting-edge AI tools.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-luna-50 dark:bg-luna-900">
          {children}
        </div>
      </body>
    </html>
  )
} 
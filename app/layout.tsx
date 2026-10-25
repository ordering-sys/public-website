import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/lib/theme-context'

const siteTitle = 'Shop QR Scan System'
const siteDescription = 'Scan QR codes to view products, promotions, and place orders easily'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.NEXT_PUBLIC_PRODUCTION_URL
    ? `https://${process.env.NEXT_PUBLIC_PRODUCTION_URL}`
    : 'http://localhost:3000')
const socialImage = {
  url: '/images/coffee-thumbnail.png',
  alt: 'Coffee at Shop QR Scan System',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: `%s | ${siteTitle}` },
  description: siteDescription,
  applicationName: siteTitle,
  openGraph: {
    type: 'website',
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
    locale: 'km_KH',
    alternateLocale: ['en_US'],
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [socialImage],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="km"
      data-theme="dark"
      data-scroll-behavior="smooth"
      className="h-full notranslate"
      translate="no"
      suppressHydrationWarning
    >
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className="min-h-full flex flex-col notranslate" translate="no">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

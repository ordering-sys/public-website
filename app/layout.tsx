import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/lib/theme-context'

export const metadata: Metadata = {
  title: 'Cafe QR Order',
  description: 'Order food & drinks directly from your table',
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
    /*
     * data-theme and lang are set dynamically by ThemeProvider on the client.
     * We set safe defaults here so the initial SSR render is consistent.
     */
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

'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { t } from '@/lib/i18n'
import { tableQs } from '@/lib/table-qs'
import { useTheme } from '@/lib/theme-context'

import { UtensilsCrossed } from 'lucide-react'
import { LanguageDropdown } from '@/components/site/LanguageDropdown'

function HeaderInner() {
  const { theme, lang, toggleTheme } = useTheme()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const qs = tableQs(searchParams.get('table'), searchParams.get('token'))
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: `/${qs}`, key: 'navHome' as const, active: pathname === '/' },
    { href: `/order${qs}`, key: 'navMenu' as const, active: pathname.startsWith('/order') },
    { href: `/map${qs}`, key: 'navMap' as const, active: pathname.startsWith('/map') },
    { href: `/${qs}#about`, key: 'navAbout' as const, active: false },
    { href: `/${qs}#contact`, key: 'navContact' as const, active: false },
  ]

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="mx-auto max-w-6xl px-3.5 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        <Link href={`/${qs}`} className="flex items-center gap-2.5 flex-shrink-0" style={{ textDecoration: 'none' }}>
          <BrandLogo size="md" />
          <div className="min-w-0 max-w-[130px] xs:max-w-[190px] sm:max-w-none">
            <p className="font-bold text-sm leading-tight serif truncate" style={{ color: 'var(--text-primary)' }}>
              {t('cafeName', lang)}
            </p>
            <p className="text-[10px] leading-none truncate" style={{ color: 'var(--text-dim)' }}>
              {t('cafeTagline', lang)}
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {links.map(item => (
            <Link
              key={item.key}
              href={item.href}
              className={`nav-link${item.active ? ' is-active' : ''}`}
            >
              {t(item.key, lang)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageDropdown />

          <button
            onClick={toggleTheme}
            className="btn-icon"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Order Now: Icon-only on mobile, icon + label on larger screens */}
          <Link
            href={`/order${qs}`}
            className="btn-primary flex items-center justify-center gap-1.5 h-[38px] w-[38px] sm:w-auto px-0 sm:px-3.5 rounded-xl flex-shrink-0 transition-transform active:scale-95"
            style={{ minHeight: 'unset' }}
            title={t('navOrderNow', lang)}
            aria-label={t('navOrderNow', lang)}
          >
            <UtensilsCrossed className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline font-bold text-xs whitespace-nowrap">
              {t('navOrderNow', lang)}
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export function SiteHeader() {
  return (
    <Suspense fallback={<header className="site-header" style={{ height: 64 }} />}>
      <HeaderInner />
    </Suspense>
  )
}

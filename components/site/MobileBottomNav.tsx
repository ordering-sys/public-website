'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Home, UtensilsCrossed, Map, Sparkles, PhoneCall } from 'lucide-react'
import { t } from '@/lib/i18n'
import { tableQs } from '@/lib/table-qs'
import { useTheme } from '@/lib/theme-context'

function MobileBottomNavInner() {
  const { lang } = useTheme()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const qs = tableQs(searchParams.get('table'), searchParams.get('token'))

  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'map' | 'about' | 'contact'>('home')

  useEffect(() => {
    // If on /order, active tab is always 'menu'
    if (pathname.startsWith('/order')) {
      setActiveTab('menu')
      return
    }

    // If on /map, active tab is always 'map'
    if (pathname.startsWith('/map')) {
      setActiveTab('map')
      return
    }

    // If on tracking page, don't force home
    if (pathname.startsWith('/tracking')) {
      setActiveTab('menu')
      return
    }

    // If on home page, track hash or scroll position
    const checkHashAndScroll = () => {
      const hash = window.location.hash
      if (hash === '#about') {
        setActiveTab('about')
        return
      }
      if (hash === '#contact') {
        setActiveTab('contact')
        return
      }

      // Check scroll position of #about and #contact sections
      const aboutEl = document.getElementById('about')
      const contactEl = document.getElementById('contact')
      const scrollY = window.scrollY + 200

      if (contactEl && contactEl.offsetTop <= scrollY) {
        setActiveTab('contact')
      } else if (aboutEl && aboutEl.offsetTop <= scrollY) {
        setActiveTab('about')
      } else {
        setActiveTab('home')
      }
    }

    checkHashAndScroll()
    window.addEventListener('scroll', checkHashAndScroll, { passive: true })
    window.addEventListener('hashchange', checkHashAndScroll)
    return () => {
      window.removeEventListener('scroll', checkHashAndScroll)
      window.removeEventListener('hashchange', checkHashAndScroll)
    }
  }, [pathname])

  const handleNavClick = (key: 'home' | 'menu' | 'map' | 'about' | 'contact', href: string) => {
    setActiveTab(key)

    if (pathname === '/' && (key === 'about' || key === 'contact')) {
      const targetId = key === 'about' ? 'about' : 'contact'
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        window.history.replaceState(null, '', `/${qs}#${targetId}`)
      }
    }
  }

  const navItems = [
    {
      key: 'home' as const,
      label: t('navHome', lang),
      href: `/${qs}`,
      icon: Home,
      isActive: activeTab === 'home' && pathname === '/',
    },
    {
      key: 'menu' as const,
      label: t('navMenu', lang),
      href: `/order${qs}`,
      icon: UtensilsCrossed,
      isActive: pathname.startsWith('/order'),
    },
    {
      key: 'map' as const,
      label: t('navMap', lang),
      href: `/map${qs}`,
      icon: Map,
      isActive: pathname.startsWith('/map'),
    },
    {
      key: 'about' as const,
      label: t('navAbout', lang),
      href: pathname === '/' ? `#about` : `/${qs}#about`,
      icon: Sparkles,
      isActive: activeTab === 'about' && pathname === '/',
    },
    {
      key: 'contact' as const,
      label: t('navContact', lang),
      href: pathname === '/' ? `#contact` : `/${qs}#contact`,
      icon: PhoneCall,
      isActive: activeTab === 'contact' && pathname === '/',
    },
  ]

  return (
    <nav
      className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300"
      aria-label="Mobile Navigation Bar"
    >
      <div className="mobile-bottom-nav-inner max-w-md mx-auto grid grid-cols-5 items-center justify-around px-1.5 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.isActive

          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => handleNavClick(item.key, item.href)}
              className={`mobile-nav-btn flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 group relative ${
                active ? 'active-nav-item' : 'inactive-nav-item'
              }`}
              style={{ textDecoration: 'none' }}
              aria-current={active ? 'page' : undefined}
            >
              {/* Active top glowing indicator bar */}
              {active && (
                <span
                  className="mobile-nav-indicator absolute -top-1 w-8 h-1 rounded-full animate-fade"
                  style={{
                    background: 'linear-gradient(90deg, var(--primary-light), var(--primary))',
                    boxShadow: '0 0 10px var(--primary)',
                  }}
                  aria-hidden="true"
                />
              )}

              {/* Icon with smooth bounce & highlight wrapper */}
              <div
                className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                  active ? 'scale-110' : 'group-hover:scale-105 active:scale-95'
                }`}
                style={{
                  background: active ? 'rgba(240, 167, 66, 0.16)' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--text-secondary)',
                }}
              >
                <Icon
                  className="w-5 h-5 transition-transform duration-200"
                  strokeWidth={active ? 2.3 : 1.9}
                />
              </div>

              {/* Text label with Khmer / English support */}
              <span
                className={`text-[9.5px] sm:text-[11px] leading-tight tracking-tight text-center truncate max-w-[62px] transition-colors duration-200 ${
                  active ? 'font-bold' : 'font-medium'
                }`}
                style={{
                  color: active ? 'var(--primary)' : 'var(--text-secondary)',
                }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function MobileBottomNav() {
  return (
    <Suspense fallback={null}>
      <MobileBottomNavInner />
    </Suspense>
  )
}

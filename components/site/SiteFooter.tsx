'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { t } from '@/lib/i18n'
import { useTheme } from '@/lib/theme-context'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { tableQs } from '@/lib/table-qs'

function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" />
    </svg>
  )
}

function IconTelegram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.5 4.3 18.7 20c-.2 1-1.4 1.4-2.2.8l-5-4.2-2.4 2.3c-.3.3-.7.4-1 .2l.4-5.1 9.2-8.3c.4-.4-.1-.6-.6-.3L6.2 12.4 1.4 10.9c-1-.3-1-1.2.2-1.7l18.4-7.1c.9-.3 1.7.2 1.5 2.2z" />
    </svg>
  )
}

function IconQr() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1" />
    </svg>
  )
}

export function SiteFooter() {
  const { lang } = useTheme()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const qs = tableQs(searchParams.get('table'), searchParams.get('token'))
  const homeHref = `/${qs}`
  const orderHref = `/order${qs}`
  const extraPad = pathname.startsWith('/order')

  const explore = [
    { href: homeHref, label: t('navHome', lang) },
    { href: orderHref, label: t('navMenu', lang) },
    { href: `${homeHref}#about`, label: t('navAbout', lang) },
    { href: `${homeHref}#contact`, label: t('navContact', lang) },
  ]

  const social = [
    { href: 'https://instagram.com', label: 'Instagram', icon: <IconInstagram /> },
    { href: 'https://facebook.com', label: 'Facebook', icon: <IconFacebook /> },
    { href: 'https://t.me', label: 'Telegram', icon: <IconTelegram /> },
  ]

  return (
    <footer
      className="site-footer"
      style={{ paddingBottom: extraPad ? '7.5rem' : undefined }}
    >
      <div className="site-footer-accent" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-6 pt-14 pb-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={homeHref} className="inline-flex items-center gap-2.5 no-underline mb-4" style={{ textDecoration: 'none' }}>
              <BrandLogo size="md" />
              <div>
                <p className="font-bold text-sm leading-tight serif" style={{ color: 'var(--text-primary)' }}>
                  {t('cafeName', lang)}
                </p>
                <p className="text-[10px] leading-none mt-0.5" style={{ color: 'var(--text-dim)' }}>
                  {t('cafeTagline', lang)}
                </p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)', maxWidth: 280 }}>
              {t('footerDesc', lang)}
            </p>
            <p className="label-overline mb-3">{t('footerFollow', lang)}</p>
            <div className="flex items-center gap-2">
              {social.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="label-overline mb-4">{t('footerExplore', lang)}</p>
            <nav aria-label={t('footerExplore', lang)} className="flex flex-col gap-2.5">
              {explore.map(item => (
                <Link key={item.label} href={item.href} className="footer-link">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Visit */}
          <div id="contact">
            <p className="label-overline mb-4">{t('footerVisit', lang)}</p>
            <ul className="flex flex-col gap-3.5" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              <li className="footer-meta">
                <span className="footer-meta-icon"><IconPin /></span>
                <span>{t('footerAddress', lang)}</span>
              </li>
              <li>
                <a href="tel:+85512345678" className="footer-meta footer-link">
                  <span className="footer-meta-icon"><IconPhone /></span>
                  <span>{t('footerPhone', lang)}</span>
                </a>
              </li>
              <li>
                <a href="mailto:hello@beanhaven.cafe" className="footer-meta footer-link">
                  <span className="footer-meta-icon"><IconMail /></span>
                  <span>{t('footerEmail', lang)}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <p className="label-overline mb-4">{t('footerHours', lang)}</p>
            <div className="flex flex-col gap-3">
              <div className="footer-hours-row">
                <span className="footer-meta-icon"><IconClock /></span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{t('footerHoursWeek', lang)}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('footerHoursWeekVal', lang)}</p>
                </div>
              </div>
              <div className="footer-hours-row">
                <span className="footer-meta-icon" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{t('footerHoursEnd', lang)}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('footerHoursEndVal', lang)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR strip */}
        <div className="footer-qr-strip">
          <span className="footer-qr-mark"><IconQr /></span>
          <p className="text-sm m-0" style={{ color: 'var(--text-secondary)' }}>
            {t('footerScanHint', lang)}
          </p>
          <Link href={orderHref} className="btn-primary footer-qr-cta">
            {t('navOrderNow', lang)}
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom relative z-20">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs m-0" style={{ color: 'var(--text-dim)' }}>
            {t('footerRights', lang)}
          </p>
          <p className="text-xs m-0 italic serif" style={{ color: 'var(--text-secondary)' }}>
            {t('footerTagline', lang)} · {t('footerMade', lang)}
          </p>
        </div>
      </div>
    </footer>
  )
}

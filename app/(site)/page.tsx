'use client'

import { MenuImage } from '@/components/site/MenuImage'

import Link from 'next/link'
import { Suspense, useEffect, useState, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTheme } from '@/lib/theme-context'
import { t } from '@/lib/i18n'
import { tableQs } from '@/lib/table-qs'
import { getLocation } from '@/lib/location'
import { getGuestWifi } from '@/app/table-access-actions'
import { createClient } from '@/lib/supabase/client'
import type { MenuItem } from '@/lib/types'
import { ArrowRight, Coffee, Compass, KeyRound, MapPin, Plus, Sparkles, Wifi } from 'lucide-react'
import { Hero3DShowcase } from '@/components/site/Hero3DShowcase'
import { CoffeeBeanRain } from '@/components/site/CoffeeBeanRain'
import { IconBean, IconStar } from '@/components/site/icons'

function LandingContent() {
  const { lang, theme } = useTheme()
  const isLight = theme === 'light'
  const searchParams = useSearchParams()
  const table = searchParams.get('table')
  const token = searchParams.get('token')
  const qs = tableQs(table, token)
  const hasTableQr = Boolean(table?.trim() && token?.trim())
  const [featured, setFeatured] = useState<MenuItem[]>([])
  const [menuError, setMenuError] = useState(false)
  const [menuLoading, setMenuLoading] = useState(true)
  const [wifiState, setWifiState] = useState<{ key: string; success: boolean; ssid: string; password: string } | null>(null)

  useEffect(() => {
    if (!table?.trim() || !token?.trim()) return
    const key = `${table}\u0000${token}`
    let active = true
    async function loadWifi() {
      try {
        const result = await getGuestWifi(table!, token!, await getLocation())
        if (active) setWifiState({ key, ...result })
      } catch {
        if (active) setWifiState({ key, success: false, ssid: '', password: '' })
      }
    }
    void loadWifi()
    return () => { active = false }
  }, [table, token])

  useEffect(() => {
    const supabase = createClient()
    let active = true
    async function loadFeatured() {
      try {
        const { data, error } = await supabase
      .from('menu_items')
      .select('id, name_km, name_en, description, price, category, image_url, available, sugar_levels, default_sugar_level')
      .eq('available', true)
      .order('name_en')
      .limit(4)
        if (error) throw error
        if (active) { setFeatured(data ?? []); setMenuError(false) }
      } catch (error) {
        console.error('Failed to load featured menu:', error)
        if (active) setMenuError(true)
      } finally {
        if (active) setMenuLoading(false)
      }
    }
    void loadFeatured()
    window.addEventListener('focus', loadFeatured)
    return () => { active = false; window.removeEventListener('focus', loadFeatured) }
  }, [])

  const features: { icon: ReactNode; title: string; desc: string; href?: string }[] = [
    { icon: <IconBean />, title: t('feat1Title', lang), desc: t('feat1Desc', lang) },
    { icon: <MapPin className="w-8 h-8" strokeWidth={1.7} aria-hidden="true" />, title: t('feat2Title', lang), desc: t('feat2Desc', lang), href: `/map${qs}` },
    { icon: <IconStar />, title: t('feat4Title', lang), desc: t('feat4Desc', lang) },
  ]
  const wifi = wifiState?.key === `${table}\u0000${token}` ? wifiState : null

  const how = [
    { n: '01', title: t('how1Title', lang), desc: t('how1Desc', lang) },
    { n: '02', title: t('how2Title', lang), desc: t('how2Desc', lang) },
    { n: '03', title: t('how3Title', lang), desc: t('how3Desc', lang) },
  ]

  const displayItems = featured
  const orderHref = `/order${qs}`

  return (
    <div className="relative">
      {/* ── 3D Coffee Bean Rain (Smooth falling rainwater effect down to footer end) ── */}
      <CoffeeBeanRain />

      {/* ── Hero Section ── */}
      <section className="hero-section relative">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />

        {/* Dynamic Glowing Aurora Orbs */}
        <div
          className="absolute -top-16 -right-16 w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] rounded-full pointer-events-none filter blur-[95px] opacity-60 animate-aurora-1"
          style={{
            background: isLight
              ? 'radial-gradient(circle, rgba(240, 167, 66, 0.13) 0%, rgba(217, 119, 6, 0.04) 50%, transparent 75%)'
              : 'radial-gradient(circle, rgba(240, 167, 66, 0.45) 0%, rgba(217, 119, 6, 0.15) 50%, transparent 75%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/4 -left-20 w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full pointer-events-none filter blur-[90px] opacity-45 animate-aurora-2"
          style={{
            background: isLight
              ? 'radial-gradient(circle, rgba(48, 201, 160, 0.11) 0%, rgba(16, 185, 129, 0.03) 50%, transparent 75%)'
              : 'radial-gradient(circle, rgba(48, 201, 160, 0.4) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 75%)',
          }}
          aria-hidden="true"
        />

        <div className="hero-content w-full relative z-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20 lg:py-24">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column: Headline & Action CTA */}
              <div className="lg:col-span-7 max-w-2xl">
                {table && token ? (
                  <div
                    className="anim-0 inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl mb-6 shadow-md border backdrop-blur-md"
                    style={{
                      background: isLight ? 'rgba(15, 168, 130, 0.12)' : 'rgba(48, 201, 160, 0.16)',
                      borderColor: isLight ? 'rgba(15, 168, 130, 0.35)' : 'rgba(48, 201, 160, 0.45)',
                      color: isLight ? 'var(--fresh-dark)' : 'var(--fresh-light)',
                    }}
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs sm:text-sm font-bold tracking-wide">
                      {lang === 'km' ? `អ្នកកំពុងអង្គុយកុម្ម៉ង់នៅតុ:` : `You are seated at:`}{' '}
                      <span className="font-extrabold text-white px-2 py-0.5 rounded-lg bg-emerald-600/90 shadow-xs ml-1">
                        {table}
                      </span>
                    </span>
                  </div>
                ) : (
                  <div
                    className="anim-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 border shadow-xs backdrop-blur-sm"
                    style={{
                      background: isLight ? 'rgba(192, 120, 24, 0.1)' : 'rgba(240, 167, 66, 0.14)',
                      borderColor: isLight ? 'rgba(192, 120, 24, 0.3)' : 'rgba(240, 167, 66, 0.35)',
                      color: isLight ? 'var(--primary-dark)' : 'var(--primary-light)',
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                    <span className="text-xs font-bold tracking-wider uppercase">
                      {t('heroBadge', lang)}
                    </span>
                  </div>
                )}

                <h1 className="heading-hero anim-1 mb-5 sm:mb-6">
                  <span
                    className="block drop-shadow-xs leading-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t('heroTitle1', lang)}
                  </span>
                  <span
                    className={`block font-extrabold bg-clip-text text-transparent drop-shadow-md ${
                      isLight
                        ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800'
                        : 'bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500'
                    }`}
                  >
                    {t('heroTitle2', lang)}
                  </span>
                </h1>

                <p
                  className="anim-2 mb-8 text-sm sm:text-base leading-relaxed"
                  style={{ color: 'var(--text-secondary)', maxWidth: 520 }}
                >
                  {t('heroDesc', lang)}
                </p>

                {/* Primary & Secondary Action Buttons */}
                <div className="anim-3 flex flex-wrap items-center gap-3.5">
                  <Link
                    href={orderHref}
                    className="btn-primary flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #f0a742 0%, #d97706 100%)',
                      boxShadow: '0 8px 24px rgba(240, 167, 66, 0.45)',
                      color: '#0d0f12',
                    }}
                  >
                    <span>{t('heroExplore', lang)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/map${qs}`}
                    className="btn-outline flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base border backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                    style={{
                      borderColor: 'var(--bg-border)',
                      background: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.06)',
                      color: 'var(--text-primary)',
                      boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                    }}
                  >
                    <Compass className="w-4 h-4 text-amber-500" />
                    <span>{lang === 'km' ? 'ប្លង់ 3D និងទីតាំង' : '3D Map & Location'}</span>
                  </Link>
                </div>

                {/* Quick Quality Proof Tags */}
                <div
                  className="anim-4 mt-8 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{lang === 'km' ? 'កាហ្វេ Arabica ១០០%' : '100% Specialty Arabica'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{lang === 'km' ? 'កុម្ម៉ង់ភ្លាមៗតាមតុ' : 'Fast Table QR Order'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{lang === 'km' ? 'សួនធម្មជាតិ & Wi-Fi' : 'Lush Patio & Wi-Fi'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive 3D Showcase */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end relative z-20">
                <Hero3DShowcase />
              </div>
            </div>
          </div>
        </div>

        {/* Smooth Organic Transition To Next Section */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-20"
          style={{
            background: 'linear-gradient(to bottom, transparent, var(--bg-surface))',
          }}
        />
      </section>

      {/* ── Section 1: Features Bar (Image 1 circled: beans shouldn't be seen here) ── */}
      <section
        className="relative z-30 overflow-hidden"
        style={{
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--bg-border)',
          borderBottom: '1px solid var(--bg-border)',
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-12 relative z-30">
          {menuError && <p role="alert">{lang === 'km' ? 'មិនអាចទាញយកមុខម្ហូបបានទេ។ សូមព្យាយាមម្តងទៀត។' : 'Could not load the menu. Please refresh to try again.'}</p>}
          {menuLoading && <p role="status">{lang === 'km' ? 'កំពុងទាញយកមុខម្ហូប…' : 'Loading menu…'}</p>}
          {!menuLoading && !menuError && !featured.length && <p>{lang === 'km' ? 'មិនទាន់មានមុខម្ហូបទេ។' : 'No menu items available yet.'}</p>}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${hasTableQr ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            {features.map((f, i) => {
              const content = <>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'var(--primary-glow)', color: 'var(--primary)', border: '1px solid rgba(240,167,66,0.22)' }}
                >
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.title}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-dim)' }}>{f.desc}</p>
                </div>
              </>
              const cardClass = 'card card-hover p-5 flex flex-col items-center text-center gap-3 relative z-20'
              return f.href
                ? <Link key={i} href={f.href} className={`${cardClass} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600`} aria-label={f.title}>{content}</Link>
                : <div key={i} className={cardClass}>{content}</div>
            })}
            {hasTableQr && (
              <div className="card p-5 flex flex-col items-center text-center gap-3 relative z-20">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', border: '1px solid rgba(240,167,66,0.22)' }}>
                  <Wifi className="w-8 h-8" strokeWidth={1.7} aria-hidden="true" />
                </div>
                <div className="w-full min-w-0">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t('wifiTitle', lang)}</p>
                  {wifi?.success ? (
                    <div className="mt-2 space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <p><span className="font-semibold">{t('wifiName', lang)}:</span> <span className="break-all select-text">{wifi.ssid}</span></p>
                      <p className="flex items-center justify-center gap-1 flex-wrap"><KeyRound className="w-3.5 h-3.5" aria-hidden="true" /><span className="font-semibold">{t('wifiPassword', lang)}:</span> <span className="break-all select-text">{wifi.password}</span></p>
                    </div>
                  ) : <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-dim)' }}>{wifi ? t('wifiUnavailable', lang) : t('wifiLoading', lang)}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Section 2: Three steps to your cup (Image 2 circle 1: beans SHOULD be seen) ── */}
      <section className="section relative z-10" style={{ background: 'transparent' }}>
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="label-overline mb-2">{t('howBadge', lang)}</p>
            <h2 className="heading-section">{t('howTitle', lang)}</h2>
            <div className="divider-primary mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {how.map(step => (
              <article key={step.n} className="how-step relative z-20">
                <div className="how-num">{step.n}</div>
                <h3 className="font-bold serif text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Popular Picks (Image 2 circle 2: beans SHOULD be seen BEHIND card) ── */}
      <section className="section relative z-10" style={{ paddingTop: 0, background: 'transparent' }}>
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <p className="label-overline mb-2">{t('popularBadge', lang)}</p>
              <h2 className="heading-section">{t('popularTitle', lang)}</h2>
              <div className="divider-primary mt-3" />
            </div>
            <Link href={orderHref} className="text-sm font-semibold relative z-20" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
              {t('viewFullMenu', lang)}
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayItems.map((item, i) => (
              <div
                key={item.id}
                className={`card card-hover anim-${i} relative z-20`}
                style={{
                  overflow: 'hidden',
                  background: 'var(--bg-card)',
                }}
              >
                <div className="w-full h-44 flex items-center justify-center relative overflow-hidden dish-ph">
                  <MenuImage src={item.image_url} alt={item.name_en} className="w-full h-full object-cover" loading="lazy">
                    <div className="flex flex-col items-center gap-2" style={{ color: 'var(--primary)', opacity: 0.55 }}>
                      <Coffee className="w-6 h-6" aria-hidden="true" />
                      <span className="text-[10px] tracking-widest uppercase">{item.category}</span>
                    </div>
                  </MenuImage>
                  <span
                    className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.55)', color: 'var(--primary-light)', backdropFilter: 'blur(6px)' }}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>
                    {lang === 'km' ? item.name_km : item.name_en}
                  </h3>
                  <p className="text-xs mt-0.5 mb-3" style={{ color: 'var(--text-dim)' }}>
                    {lang === 'km' ? item.name_en : item.name_km}
                  </p>
                  {!!item.sugar_levels?.length && (
                    <p className="mb-3 text-[10px] font-medium leading-relaxed" style={{ color: 'var(--primary)' }}>
                      {t('sugarOptionsBadge', lang)} · {item.sugar_levels.map(level => level === 0 ? t('sugarNoSugar', lang) : `${level}%`).join(', ')}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base" style={{ color: 'var(--primary)' }}>
                      ${Number(item.price).toFixed(2)}
                    </span>
                    <Link
                      href={orderHref}
                      className="w-8 h-8 flex items-center justify-center rounded-lg active:scale-90"
                      style={{ background: 'var(--primary)', color: 'var(--text-invert)', boxShadow: 'var(--shadow-primary)', minHeight: 'unset' }}
                      aria-label={`Order ${item.name_en}`}
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Our Story (Image 3: beans seen falling through) ── */}
      <section
        id="about"
        className="relative z-10"
        style={{
          background: 'transparent',
          borderTop: '1px solid var(--bg-border)',
          borderBottom: '1px solid var(--bg-border)',
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-16 relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div
              className="relative z-20 rounded-2xl overflow-hidden"
              style={{
                minHeight: 340,
                background: 'linear-gradient(145deg, #2a2118, #12100d)',
                border: '1px solid var(--bg-border)',
              }}
            >
              <div aria-hidden="true" style={{ position: 'absolute', top: '-30%', right: '-20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,167,66,0.22) 0%, transparent 70%)' }} />
              <div aria-hidden="true" style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(48,201,160,0.12) 0%, transparent 70%)' }} />
              <div className="relative z-10 flex items-center justify-center h-full p-10" style={{ minHeight: 340 }}>
                <p
                  className="text-center leading-tight"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.4rem, 4vw, 2.1rem)',
                    color: 'rgba(245,237,224,0.92)',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {t('storyQuote', lang)}
                </p>
              </div>
            </div>

            <div className="relative z-20">
              <p className="label-overline mb-3">{t('storyBadge', lang)}</p>
              <h2 className="heading-section mb-4">{t('storyTitle', lang)}</h2>
              <div className="divider-primary mb-6" />
              <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                {t('storyDesc', lang)}
              </p>
              <Link href={orderHref} className="btn-primary" style={{ display: 'inline-flex' }}>
                {t('heroExplore', lang)}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Join Our Coffee Club (Image 3: beans seen falling through down to footer) ── */}
      <section className="section relative z-10" style={{ background: 'transparent' }}>
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <div className="join-card relative z-20 text-center">
            <h2 className="heading-section mb-3">{t('joinTitle', lang)}</h2>
            <p className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>{t('joinDesc', lang)}</p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('joinPlaceholder', lang)}
                className="flex-1 px-4 py-3 rounded-lg text-sm outline-none"
                style={{ background: 'var(--bg-base)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                aria-label={t('joinPlaceholder', lang)}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem', borderRadius: 8, minHeight: 'unset' }}>
                {t('joinBtn', lang)}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function LandingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="skeleton w-48 h-6" />
      </div>
    }>
      <LandingContent />
    </Suspense>
  )
}

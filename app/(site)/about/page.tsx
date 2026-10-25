'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Coffee, Heart, MapPin } from 'lucide-react'
import { t } from '@/lib/i18n'
import { tableQs } from '@/lib/table-qs'
import { useTheme } from '@/lib/theme-context'

function AboutContent() {
  const { lang } = useTheme()
  const searchParams = useSearchParams()
  const qs = tableQs(searchParams.get('table'), searchParams.get('token'))

  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-6 py-12 sm:py-20">
      <div className="text-center mb-12">
        <p className="label-overline mb-3">{t('storyBadge', lang)}</p>
        <h1 className="heading-section">{t('storyTitle', lang)}</h1>
        <div className="divider-primary mx-auto mt-5" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="relative rounded-3xl overflow-hidden flex items-center justify-center p-10 min-h-72 sm:min-h-96"
          style={{ background: 'linear-gradient(145deg, #2a2118, #12100d)', border: '1px solid var(--bg-border)' }}>
          <div aria-hidden="true" className="absolute -top-20 -right-20 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(240,167,66,0.25), transparent 70%)' }} />
          <div aria-hidden="true" className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(48,201,160,0.16), transparent 70%)' }} />
          <p className="relative text-center leading-tight whitespace-pre-line text-3xl sm:text-4xl italic" style={{ fontFamily: "'Playfair Display', serif", color: '#f5ede0' }}>
            {t('storyQuote', lang)}
          </p>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 mb-5" style={{ color: 'var(--primary)' }}>
            <Coffee className="w-5 h-5" aria-hidden="true" />
            <span className="font-semibold">{t('cafeName', lang)}</span>
          </div>
          <p className="text-lg leading-8 mb-6" style={{ color: 'var(--text-secondary)' }}>{t('storyDesc', lang)}</p>
          <p className="text-base leading-7 mb-8" style={{ color: 'var(--text-secondary)' }}>{t('heroDesc', lang)}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/order${qs}`} className="btn-primary inline-flex items-center gap-2">
              {t('heroExplore', lang)} <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link href={`/contact${qs}`} className="btn-outline inline-flex items-center gap-2">
              <MapPin className="w-4 h-4" aria-hidden="true" /> {t('heroBook', lang)}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-2xl p-6 sm:p-8 flex items-start gap-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
        <Heart className="w-6 h-6 shrink-0" style={{ color: 'var(--primary)' }} aria-hidden="true" />
        <div>
          <h2 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{t('feat4Title', lang)}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('feat4Desc', lang)}</p>
        </div>
      </div>
    </main>
  )
}

export default function AboutPage() {
  return <Suspense fallback={null}><AboutContent /></Suspense>
}

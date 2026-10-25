'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Clock3, ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import { t } from '@/lib/i18n'
import { tableQs } from '@/lib/table-qs'
import { useTheme } from '@/lib/theme-context'

const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Street+240+BKK1+Phnom+Penh'
const mapUrl = 'https://maps.google.com/maps?q=Street+240,+BKK1,+Phnom+Penh,+Cambodia&t=&z=16&ie=UTF8&iwloc=&output=embed'

function ContactContent() {
  const { lang } = useTheme()
  const searchParams = useSearchParams()
  const qs = tableQs(searchParams.get('table'), searchParams.get('token'))
  const locationHref = `/map${qs ? `${qs}&tab=location` : '?tab=location'}`

  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-6 py-12 sm:py-20">
      <div className="text-center mb-12">
        <p className="label-overline mb-3">{t('footerVisit', lang)}</p>
        <h1 className="heading-section">{t('navContact', lang)}</h1>
        <div className="divider-primary mx-auto mt-5" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        <section className="rounded-3xl p-6 sm:p-8" style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
          <h2 className="text-2xl font-bold mb-6 serif" style={{ color: 'var(--text-primary)' }}>{t('cafeName', lang)}</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 shrink-0 mt-1" style={{ color: 'var(--primary)' }} aria-hidden="true" />
              <div><h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{lang === 'km' ? 'ទីតាំង' : 'Location'}</h3><p style={{ color: 'var(--text-secondary)' }}>{t('footerAddress', lang)}</p></div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 shrink-0 mt-1" style={{ color: 'var(--primary)' }} aria-hidden="true" />
              <div><h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{lang === 'km' ? 'ទូរស័ព្ទ' : 'Phone'}</h3><a href="tel:+85512345678" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>{t('footerPhone', lang)}</a></div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 shrink-0 mt-1" style={{ color: 'var(--primary)' }} aria-hidden="true" />
              <div><h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{lang === 'km' ? 'អ៊ីមែល' : 'Email'}</h3><a href="mailto:hello@beanhaven.cafe" className="hover:underline break-all" style={{ color: 'var(--text-secondary)' }}>{t('footerEmail', lang)}</a></div>
            </div>
            <div className="flex items-start gap-4">
              <Clock3 className="w-5 h-5 shrink-0 mt-1" style={{ color: 'var(--primary)' }} aria-hidden="true" />
              <div><h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t('footerHours', lang)}</h3><p style={{ color: 'var(--text-secondary)' }}>{t('footerHoursWeek', lang)}: {t('footerHoursWeekVal', lang)}</p><p style={{ color: 'var(--text-secondary)' }}>{t('footerHoursEnd', lang)}: {t('footerHoursEndVal', lang)}</p></div>
            </div>
          </div>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 mt-8">
            <MapPin className="w-4 h-4" aria-hidden="true" /> {lang === 'km' ? 'ទទួលទិសដៅ' : 'Get directions'} <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </section>

        <section className="rounded-3xl overflow-hidden flex flex-col" style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
          <iframe title={lang === 'km' ? 'ផែនទីទីតាំងហាង' : 'Cafe location map'} src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full min-h-80 flex-1" />
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} aria-hidden="true" /><span className="font-semibold">{t('footerAddress', lang)}</span></div>
            <Link href={locationHref} className="text-sm font-semibold hover:underline shrink-0" style={{ color: 'var(--primary)' }}>{lang === 'km' ? 'មើលផែនទី' : 'View map'}</Link>
          </div>
        </section>
      </div>
    </main>
  )
}

export default function ContactPage() {
  return <Suspense fallback={null}><ContactContent /></Suspense>
}

'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Coffee, Home } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { tableQs } from '@/lib/table-qs'

export function NotFoundContent() {
  const { lang } = useTheme()
  const searchParams = useSearchParams()
  const qs = tableQs(searchParams.get('table'), searchParams.get('token'))
  const khmer = lang === 'km'

  return (
    <main
      className="flex min-h-dvh items-center justify-center px-5 py-12"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      <div
        className="w-full max-w-lg rounded-3xl border px-6 py-12 text-center sm:px-10"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
      >
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}
        >
          <Coffee className="h-10 w-10" aria-hidden="true" />
        </div>
        <p className="mb-4 text-7xl font-bold sm:text-8xl" style={{ color: 'var(--primary)' }}>404</p>
        <h1 className="mb-8 text-2xl font-bold leading-relaxed sm:text-3xl">
          {khmer ? 'រកមិនឃើញទំព័រ' : 'Page not found'}
        </h1>
        
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={`/${qs}`} className="btn-primary inline-flex min-h-12 items-center justify-center gap-2">
            <Home className="h-4 w-4" aria-hidden="true" />
            {khmer ? 'ទៅទំព័រដើម' : 'Back to home'}
          </Link>
          <Link href={`/order${qs}`} className="btn-outline inline-flex min-h-12 items-center justify-center gap-2">
            {khmer ? 'មើលម៉ឺនុយ' : 'View menu'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  )
}

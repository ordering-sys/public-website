import type { Metadata } from 'next'
import { Suspense } from 'react'
import { NotFoundContent } from '@/components/site/NotFoundContent'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <Suspense fallback={null}>
      <NotFoundContent />
    </Suspense>
  )
}

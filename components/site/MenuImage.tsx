'use client'

import { useState, type ReactNode } from 'react'

export function MenuImage({ src, alt, className = 'w-full h-full object-cover', loading = 'lazy', children }: {
  src?: string | null
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  children: ReactNode
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const url = src?.trim()
  if (!url || failedUrl === url) return <>{children}</>
  // R2 public URLs are served directly, including custom bucket domains.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt} className={className} loading={loading} decoding="async" onError={() => setFailedUrl(url)} />
}

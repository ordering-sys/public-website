'use client'

import { useState, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { getLocation } from '@/lib/location'
import { verifyTableLocation } from '@/app/table-access-actions'

export function TableLocationGate({ children }: { children: ReactNode }) {
  const params = useSearchParams()
  const table = params.get('table')
  const token = params.get('token')
  const key = JSON.stringify([table, token])
  const [verified, setVerified] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function verify() {
    setBusy(true)
    setError('')
    try {
      const result = await verifyTableLocation(table || '', token || '', await getLocation())
      if (!result.success) throw new Error(result.error)
      setVerified(key)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to verify location.')
    } finally { setBusy(false) }
  }

  if (!table?.trim() || !token?.trim() || verified === key) return children
  return <section className="max-w-lg mx-auto px-6 py-16 space-y-5 text-center">
    <h1 className="text-2xl font-bold">Verify your location / ផ្ទៀងផ្ទាត់ទីតាំង</h1>
    <p>Table {table || '—'} · Please allow location access to order at this restaurant.</p>
    <p>សូមអនុញ្ញាតការចូលប្រើទីតាំង ដើម្បីកុម្ម៉ង់នៅក្នុងហាង។</p>
    {error && <p role="alert" className="text-red-500">{error}</p>}
    <button className="btn-primary px-6 py-3" onClick={verify} disabled={busy}>
      {busy ? 'Checking location… / កំពុងពិនិត្យ…' : 'Verify location / ផ្ទៀងផ្ទាត់ទីតាំង'}
    </button>
  </section>
}

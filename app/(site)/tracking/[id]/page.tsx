'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, Clock, ChefHat, Sparkles, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { type Order } from '@/lib/types'
import { sendWaiterAlert } from './actions'
import { useTheme } from '@/lib/theme-context'
import { t } from '@/lib/i18n'

const STATUS_ORDER = ['pending', 'preparing', 'ready', 'completed'] as const

export default function TrackingPage() {
  const params  = useParams()
  const orderId = params.id as string
  const { lang } = useTheme()

  const [order, setOrder]               = useState<Order | null>(null)
  const [loading, setLoading]           = useState(true)
  const [callingWaiter, setCallingWaiter] = useState(false)
  const [waiterCalled, setWaiterCalled] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!orderId) return
    let cancelled = false

    async function load() {
      try {
        const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single()
        if (error) throw error
        if (!cancelled) setOrder(data)
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    const ch = supabase
      .channel(`order_${orderId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        p => setOrder(p.new as Order))
      .subscribe()

    return () => { cancelled = true; void supabase.removeChannel(ch) }
  }, [orderId, supabase])

  async function callWaiter() {
    if (!order || waiterCalled || callingWaiter) return
    setCallingWaiter(true)
    try { await sendWaiterAlert(order.id); setWaiterCalled(true) }
    catch (e) { console.error(e) }
    finally { setCallingWaiter(false) }
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8 space-y-4">
        <div className="skeleton h-24 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
          style={{ background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.3)' }}>
          ⚠️
        </div>
        <p className="font-bold text-lg serif" style={{ color: 'var(--text-primary)' }}>{t('orderNotFound', lang)}</p>
      </div>
    )
  }

  const currentIdx = STATUS_ORDER.indexOf(order.status as typeof STATUS_ORDER[number])

  const statusLabel: Record<Order['status'], string> = {
    pending:   t('statusPending',   lang),
    preparing: t('statusPreparing', lang),
    ready:     t('statusReady',     lang),
    completed: t('statusCompleted', lang),
    cancelled: t('statusCancelled', lang),
  }

  const steps = [
    { key: 'pending',   label: t('statusPendingStep',   lang), icon: <Clock    className="w-4 h-4" /> },
    { key: 'preparing', label: t('statusPreparingStep', lang), icon: <ChefHat  className="w-4 h-4" /> },
    { key: 'ready',     label: t('statusReadyStep',     lang), icon: <Sparkles className="w-4 h-4" /> },
  ]

  return (
    <div className="pb-16">
      {/* ── Page header banner ── */}
      <div className="page-banner" style={{ paddingTop: '2.4rem', paddingBottom: '2rem' }}>
        <div className="hero-grain" aria-hidden="true" />
        <div className="relative z-10">
          <p className="label-overline mb-2" style={{ color: 'var(--primary-light)' }}>{t('orderLabel', lang)}</p>
          <h1 className="serif font-bold" style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', color: '#edf0f4' }}>
            #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(237,240,244,0.5)' }}>
            {new Date(order.created_at).toLocaleString(lang === 'km' ? 'km-KH' : 'en-US')}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">

        {/* ── Status card ── */}
        <div className="card p-6 text-center">
          {/* Animated icon */}
          <div className="flex justify-center mb-4">
            <StatusIcon status={order.status} />
          </div>

          <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold mb-3 status-${order.status}`}>
            {statusLabel[order.status]}
          </div>

          {/* Progress track */}
          <div className="relative mt-6">
            <div className="absolute top-4 left-[calc(16.67%)] right-[calc(16.67%)] h-0.5" style={{ background: 'var(--bg-border)' }} aria-hidden="true" />
            <div
              className="absolute top-4 left-[calc(16.67%)] h-0.5 transition-all duration-700"
              style={{
                background: 'var(--primary)',
                width: currentIdx === 0 ? '0%' : currentIdx === 1 ? '50%' : '100%',
              }}
              aria-hidden="true"
            />
            <div className="relative flex justify-around">
              {steps.map((step, i) => {
                const done   = currentIdx > i
                const active = currentIdx === i
                return (
                  <div key={step.key} className="flex flex-col items-center gap-2 w-1/3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-500"
                      style={
                        done   ? { background: 'var(--green-ok)', color: '#fff', boxShadow: '0 0 10px rgba(76,175,130,0.4)' } :
                        active ? { background: 'var(--primary)', color: 'var(--text-invert)', boxShadow: 'var(--shadow-primary)' } :
                                 { background: 'var(--bg-elevated)', color: 'var(--text-dim)', border: '1px solid var(--bg-border)' }
                      }
                      aria-hidden="true"
                    >
                      {step.icon}
                    </div>
                    <p
                      className="text-[11px] font-semibold text-center"
                      style={{ color: done || active ? 'var(--text-primary)' : 'var(--text-dim)' }}
                    >
                      {step.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Order summary ── */}
        <div className="card p-5">
          <h2 className="font-bold text-base serif mb-4" style={{ color: 'var(--primary)' }}>
            {t('orderItems', lang)}
          </h2>
          <div className="space-y-1">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2.5"
                style={{ borderBottom: idx < order.items.length - 1 ? '1px solid var(--bg-border)' : 'none' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                    {lang === 'km' ? item.name_km : item.name_en}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                    {lang === 'km' ? item.name_en : item.name_km} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-sm ml-3" style={{ color: 'var(--primary)' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="divider my-4" />
          <div className="flex items-center justify-between">
            <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{t('total', lang)}</span>
            <span className="text-xl font-bold serif" style={{ color: 'var(--primary)' }}>${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* ── Call waiter ── */}
        {(order.status === 'ready' || order.status === 'preparing') && (
          <button
            onClick={callWaiter}
            disabled={callingWaiter || waiterCalled}
            className="w-full rounded-xl py-4 font-bold text-base flex items-center justify-center gap-3 transition-all"
            style={
              waiterCalled
                ? { background: 'rgba(76,175,130,0.1)', border: '1px solid rgba(76,175,130,0.3)', color: 'var(--green-ok)', cursor: 'default' }
                : { background: 'var(--bg-surface)', border: '1px solid var(--primary)', color: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }
            }
            aria-live="polite"
          >
            {callingWaiter ? (
              <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" /> {t('calling', lang)}</>
            ) : waiterCalled ? (
              <><CheckCircle className="w-5 h-5" aria-hidden="true" /> {t('waiterOnWay', lang)}</>
            ) : (
              <><Phone className="w-5 h-5" aria-hidden="true" /> {t('callWaiter', lang)}</>
            )}
          </button>
        )}

        {/* ── Completed ── */}
        {order.status === 'completed' && (
          <div
            className="card p-6 text-center"
            style={{ border: '1px solid rgba(200,145,58,0.3)', background: 'rgba(200,145,58,0.05)' }}
          >
            <p className="text-4xl mb-3" aria-hidden="true">☕</p>
            <p className="font-bold text-lg serif" style={{ color: 'var(--primary)' }}>{t('thankYou', lang)}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{t('enjoyMeal', lang)}</p>
          </div>
        )}

        {/* ── Live indicator ── */}
        <div className="flex items-center justify-center gap-2 py-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--green-ok)' }} aria-hidden="true" />
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{t('liveUpdates', lang)}</p>
        </div>
      </div>
    </div>
  )
}

function StatusIcon({ status }: { status: Order['status'] }) {
  const cls = 'w-14 h-14'
  const ring = (c: string, shadow: string, child: React.ReactNode) => (
    <div className="w-20 h-20 rounded-full flex items-center justify-center"
      style={{ background: `${c}18`, border: `1.5px solid ${c}44`, boxShadow: shadow }}>
      {child}
    </div>
  )
  switch (status) {
    case 'pending':   return ring('var(--blue-info)',   'none',                            <Clock    className={`${cls} animate-pulse`}  style={{ color: 'var(--blue-info)'   }} />)
    case 'preparing': return ring('var(--amber-warn)',  'none',                            <ChefHat  className={`${cls} animate-bounce`} style={{ color: 'var(--amber-warn)'  }} />)
    case 'ready':     return ring('var(--green-ok)',    '0 0 20px rgba(76,175,130,0.3)',   <Sparkles className={cls}                     style={{ color: 'var(--green-ok)'    }} />)
    case 'completed': return ring('var(--primary)',     '0 0 20px rgba(200,145,58,0.25)', <CheckCircle className={cls}                   style={{ color: 'var(--primary)'     }} />)
    default:          return ring('var(--text-dim)',    'none',                            <Clock    className={cls}                     style={{ color: 'var(--text-dim)'    }} />)
  }
}

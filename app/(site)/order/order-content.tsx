'use client'

import { MenuImage } from '@/components/site/MenuImage'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShoppingCart, Plus, Minus, Trash2, X, FileText, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { MenuItem, CartItem } from '@/lib/types'
import { submitOrder as submitOrderAction } from './actions'
import { useTheme } from '@/lib/theme-context'
import { t } from '@/lib/i18n'

/* ─────────────────────────────────────────────────────────
   PRODUCT DETAIL MODAL
   ───────────────────────────────────────────────────────── */
interface DetailModalProps {
  item: MenuItem
  lang: 'en' | 'km'
  cartQty: number
  onClose: () => void
  onAdd: (item: MenuItem, qty: number, notes: string) => void
}

function ProductDetailModal({ item, lang, cartQty, onClose, onAdd }: DetailModalProps) {
  const [qty, setQty]       = useState(1)
  const [notes, setNotes]   = useState('')
  const [added, setAdded]   = useState(false)
  const notesRef            = useRef<HTMLTextAreaElement>(null)

  /* Trap scroll on body while open */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  function handleAdd() {
    onAdd(item, qty, notes)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const subtotal = (item.price * qty).toFixed(2)
  const primaryName   = lang === 'km' ? item.name_km  : item.name_en
  const secondaryName = lang === 'km' ? item.name_en  : item.name_km

  return (
    <div
      className="modal-backdrop anim-fade"
      role="dialog"
      aria-modal="true"
      aria-label={primaryName}
      onKeyDown={e => e.key === 'Escape' && onClose()}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="modal-panel">
        {/* ── Image ── */}
        <div
          className="relative w-full flex-shrink-0 overflow-hidden"
          style={{ height: 240, background: 'var(--bg-elevated)' }}
        >
          <MenuImage src={item.image_url}
              alt={primaryName}
              className="w-full h-full object-cover">
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-25">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/>
                <line x1="10" y1="1" x2="10" y2="4"/>
                <line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
              <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{item.category}</span>
            </div>
          </MenuImage>

          {/* Gradient overlay at bottom of image */}
          <div
            className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: 'linear-gradient(to top, var(--bg-modal), transparent)' }}
            aria-hidden="true"
          />

          {/* Category tag */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="tag-fresh">{item.category}</span>
            {cartQty > 0 && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
                style={{ background: 'var(--primary-glow)', color: 'var(--primary-light)', border: '1px solid rgba(200,145,58,0.3)', backdropFilter: 'blur(6px)' }}
              >
                <ShoppingCart className="w-3 h-3" aria-hidden="true" />
                {cartQty} {t('inCartBadge', lang)}
              </span>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(6px)', minHeight: 'unset' }}
            aria-label={t('detailClose', lang)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-5 pt-4 pb-2">

          {/* Name + price */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex-1 min-w-0">
              <h2
                className="font-bold text-xl leading-snug serif"
                style={{ color: 'var(--text-primary)' }}
              >
                {primaryName}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-dim)' }}>
                {secondaryName}
              </p>
            </div>
            <div
              className="flex-shrink-0 px-3 py-1.5 rounded-xl font-bold text-lg serif"
              style={{
                background: 'var(--primary-glow)',
                color: 'var(--primary)',
                border: '1px solid rgba(200,145,58,0.3)',
              }}
            >
              ${item.price.toFixed(2)}
            </div>
          </div>

          {/* Availability dot */}
          <div className="flex items-center gap-1.5 mb-4">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: item.available ? 'var(--green-ok)' : 'var(--red-err)' }}
              aria-hidden="true"
            />
            <span className="text-xs font-medium" style={{ color: item.available ? 'var(--green-ok)' : 'var(--red-err)' }}>
              {item.available ? t('available', lang) : t('unavailable', lang)}
            </span>
          </div>

          {/* Divider */}
          <div className="divider mb-4" />

          {/* Description */}
          <div className="mb-5">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--text-dim)' }}>
              {t('detailDescription', lang)}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {item.description
                ? item.description
                : t('detailNoDesc', lang)}
            </p>
          </div>

          {/* ── Quantity selector ── */}
          <div className="mb-5">
            <p className="text-xs font-bold tracking-widest uppercase mb-2.5" style={{ color: 'var(--text-dim)' }}>
              {t('detailQty', lang)}
            </p>
            <div className="flex items-center justify-between">
              <div className="qty-stepper qty-stepper-lg" role="group" aria-label={t('detailQty', lang)}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                  style={{ opacity: qty <= 1 ? 0.35 : 1 }}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span aria-live="polite" aria-atomic="true">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{t('detailSubtotal', lang)}</p>
                <p className="text-2xl font-bold serif" style={{ color: 'var(--primary)' }}>
                  ${subtotal}
                </p>
              </div>
            </div>
          </div>

          {/* ── Special request / notes ── */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--fresh)' }} aria-hidden="true" />
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--fresh)' }}>
                {t('notesLabel', lang)}
              </p>
              <span className="text-[10px] ml-auto" style={{ color: 'var(--text-dim)' }}>
                {t('notesHint', lang)}
              </span>
            </div>
            <textarea
              ref={notesRef}
              className="notes-textarea"
              rows={3}
              maxLength={200}
              placeholder={t('notesPlaceholder', lang)}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              aria-label={t('notesLabel', lang)}
            />
            <p className="text-right text-[11px] mt-1" style={{ color: 'var(--text-dim)' }}>
              {notes.length}/200
            </p>
          </div>
        </div>

        {/* ── Sticky footer CTA ── */}
        <div
          className="px-5 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid var(--bg-border)' }}
        >
          <button
            onClick={handleAdd}
            disabled={!item.available}
            className="btn-fresh w-full py-4 text-base justify-center"
            aria-live="polite"
          >
            {added ? (
              <>✓ {t('detailAddMore', lang)}</>
            ) : (
              <>{t('detailAddToOrder', lang)} — ${subtotal}</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   MAIN ORDER CONTENT
   ───────────────────────────────────────────────────────── */
export default function OrderContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const table        = searchParams.get('table')
  const token        = searchParams.get('token')
  const { lang }     = useTheme()

  const [menuItems,         setMenuItems]         = useState<MenuItem[]>([])
  const [cart,              setCart]              = useState<CartItem[]>([])
  const [loading,           setLoading]           = useState(true)
  const [menuError, setMenuError] = useState(false)
  const [submitting,        setSubmitting]        = useState(false)
  const [showCart,          setShowCart]          = useState(false)
  const [selectedCategory,  setSelectedCategory]  = useState<string>('all')
  const [detailItem,        setDetailItem]        = useState<MenuItem | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadMenu()
    window.addEventListener('focus', loadMenu)
    return () => window.removeEventListener('focus', loadMenu)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadMenu() {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('id, name_km, name_en, description, price, category, image_url, available')
        .eq('available', true)
        .order('category', { ascending: true })
      if (error) throw error
      setMenuItems(data || [])
      setMenuError(false)
    } catch (err) {
      console.error('Failed to load menu:', err)
      setMenuError(true)
    } finally {
      setLoading(false)
    }
  }

  /* ── Cart helpers ── */
  const addToCartWithNotes = (item: MenuItem, qty: number, notes: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + qty, notes: notes || i.notes }
            : i
        )
      }
      return [...prev, { ...item, quantity: qty, notes: notes || undefined }]
    })
  }

  const updateQty = (id: string, delta: number) =>
    setCart(prev =>
      prev
        .map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
        .filter(i => i.quantity > 0)
    )

  const removeFromCart = (id: string) =>
    setCart(prev => prev.filter(i => i.id !== id))

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  async function handleSubmit() {
    if (!table || !token || cart.length === 0) return
    setSubmitting(true)
    try {
      const result = await submitOrderAction({ tableId: table, token, items: cart })
      if (!result.success || !result.orderId) throw new Error(result.error ?? 'Failed')
      router.push(`/tracking/${result.orderId}`)
    } catch (err) {
      console.error('Order failed:', err)
      alert(t('orderError', lang))
    } finally {
      setSubmitting(false)
    }
  }

  const categories   = ['all', ...new Set(menuItems.map(i => i.category))]
  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(i => i.category === selectedCategory)

  /* ── Skeleton ── */
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        <div className="skeleton h-28 rounded-2xl" />
        <div className="flex gap-2">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-10 w-24 rounded-full" />)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="skeleton h-60 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="pb-32">

      {/* ── Page hero banner ── */}
      <div className="page-banner">
        <div className="hero-grain" aria-hidden="true" />
        <div className="relative z-10">
          <div className="table-chip mb-4">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--fresh)' }} aria-hidden="true" />
            {t('tableLabel', lang)} {table ?? '—'}
          </div>
          <h1 className="serif font-bold mb-2" style={{ fontSize: 'clamp(1.8rem,5vw,2.8rem)', color: '#edf0f4', lineHeight: 1.2 }}>
            {t('menuTitle', lang)}
          </h1>
          <p style={{ color: 'rgba(237,240,244,0.58)', fontSize: '0.9rem' }}>
            {t('menuSubtitle', lang)}
          </p>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-7">

        {/* Category pills */}
        <div
          className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6"
          role="tablist"
          aria-label="Menu categories"
        >
          {categories.map(cat => {
            const active = selectedCategory === cat
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat)}
                className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all"
                style={
                  active
                    ? { background: 'var(--primary)', color: 'var(--text-invert)', boxShadow: 'var(--shadow-primary)' }
                    : { background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', color: 'var(--text-secondary)' }
                }
              >
                {cat === 'all' ? t('allCategories', lang) : cat}
              </button>
            )
          })}
        </div>

        {menuError && <p role="alert" className="mb-4">{lang === 'km' ? 'មិនអាចទាញយកមុខម្ហូបបានទេ។ សូមព្យាយាមម្តងទៀត។' : 'Could not load the menu.'} <button onClick={() => void loadMenu()} className="underline">{lang === 'km' ? 'ព្យាយាមម្តងទៀត' : 'Try again'}</button></p>}
        {/* Menu grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {filteredItems.map(item => {
            const inCart  = cart.find(c => c.id === item.id)
            const inQty   = inCart?.quantity ?? 0

            return (
              <div
                key={item.id}
                className="card card-hover flex flex-col overflow-hidden"
                style={{ cursor: 'pointer' }}
              >
                {/* ── Image — tap opens detail ── */}
                <div
                  className="relative w-full overflow-hidden flex-shrink-0"
                  style={{ height: 150, background: 'var(--bg-elevated)' }}
                  onClick={() => setDetailItem(item)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${lang === 'km' ? item.name_km : item.name_en} — ${t('tapForDetail', lang)}`}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setDetailItem(item)}
                >
                  <MenuImage src={item.image_url}
                      alt={lang === 'km' ? item.name_km : item.name_en}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy">
                    <div className="w-full h-full dish-ph flex items-center justify-center" style={{ color: 'var(--primary)', opacity: 0.5 }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                      </svg>
                    </div>
                  </MenuImage>

                  {/* Category tag */}
                  <span
                    className="tag-fresh absolute top-2 left-2"
                    style={{ backdropFilter: 'blur(6px)' }}
                  >
                    {item.category}
                  </span>

                  {/* In-cart badge */}
                  {inQty > 0 && (
                    <span
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                      style={{ background: 'var(--primary)', color: 'var(--text-invert)', boxShadow: 'var(--shadow-primary)' }}
                      aria-label={`${inQty} in cart`}
                    >
                      {inQty}
                    </span>
                  )}

                  {/* "Tap for detail" hint overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1 py-1.5 opacity-0 hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                    aria-hidden="true"
                  >
                    <ChevronRight className="w-3 h-3" style={{ color: 'var(--fresh-light)' }} />
                    <span className="text-[10px] font-semibold" style={{ color: 'var(--fresh-light)' }}>
                      {t('tapForDetail', lang)}
                    </span>
                  </div>
                </div>

                {/* ── Info row ── */}
                <div
                  className="p-3 flex flex-col gap-1.5 flex-1"
                  onClick={() => setDetailItem(item)}
                >
                  <p className="font-semibold text-sm leading-snug line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                    {lang === 'km' ? item.name_km : item.name_en}
                  </p>
                  <p className="text-[11px] line-clamp-1" style={{ color: 'var(--text-dim)' }}>
                    {lang === 'km' ? item.name_en : item.name_km}
                  </p>

                  {/* Notes indicator */}
                  {inCart?.notes && (
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--fresh)' }} aria-hidden="true" />
                      <p className="text-[10px] truncate italic" style={{ color: 'var(--fresh)' }}>
                        {inCart.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* ── Price + quick-add row ── */}
                <div
                  className="px-3 pb-3 flex items-center justify-between"
                  onClick={e => e.stopPropagation()}
                >
                  <span className="font-bold text-sm" style={{ color: 'var(--primary)' }}>
                    ${item.price.toFixed(2)}
                  </span>

                  {inQty > 0 ? (
                    /* Inline stepper when already in cart */
                    <div className="qty-stepper" role="group" aria-label={`Quantity of ${item.name_en}`}>
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        aria-label="Remove one"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span aria-live="polite">{inQty}</span>
                      <button
                        onClick={() => addToCartWithNotes(item, 1, '')}
                        aria-label="Add one more"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    /* Add button → opens detail modal */
                    <button
                      onClick={() => setDetailItem(item)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg transition-all active:scale-90"
                      style={{
                        background: 'var(--primary)',
                        color: 'var(--text-invert)',
                        boxShadow: 'var(--shadow-primary)',
                        minHeight: 'unset',
                      }}
                      aria-label={`${t('addToCart', lang)} ${lang === 'km' ? item.name_km : item.name_en}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          PRODUCT DETAIL MODAL
          ══════════════════════════════════════════════ */}
      {detailItem && (
        <ProductDetailModal
          item={detailItem}
          lang={lang}
          cartQty={cart.find(c => c.id === detailItem.id)?.quantity ?? 0}
          onClose={() => setDetailItem(null)}
          onAdd={(item, qty, notes) => {
            addToCartWithNotes(item, qty, notes)
            /* Keep modal open so user can see confirmation */
          }}
        />
      )}

      {/* ══════════════════════════════════════════════
          FLOATING CART PILL
          ══════════════════════════════════════════════ */}
      {cartCount > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-200"
          style={{
            background: 'var(--primary)',
            boxShadow: '0 8px 32px rgba(200,145,58,0.5)',
            minWidth: 268,
            maxWidth: 'calc(100vw - 2rem)',
            color: 'var(--text-invert)',
          }}
          aria-label={`${t('viewCart', lang)}: ${cartCount} ${t('items', lang)}, $${cartTotal.toFixed(2)}`}
        >
          <div className="relative flex-shrink-0">
            <ShoppingCart className="w-5 h-5" />
            <span
              className="absolute -top-2 -right-2 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
              style={{ background: 'var(--bg-base)', color: 'var(--primary)' }}
              aria-hidden="true"
            >
              {cartCount}
            </span>
          </div>
          <span className="flex-1 text-left font-bold text-sm">{t('viewCart', lang)}</span>
          <span className="font-bold text-sm">${cartTotal.toFixed(2)}</span>
        </button>
      )}

      {/* ══════════════════════════════════════════════
          CART DRAWER
          ══════════════════════════════════════════════ */}
      {showCart && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={t('cartTitle', lang)}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(7px)' }}
            onClick={() => setShowCart(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            className="relative flex flex-col"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--bg-border)',
              borderBottom: 'none',
              borderRadius: '1.5rem 1.5rem 0 0',
              maxHeight: '88vh',
              boxShadow: 'var(--shadow-modal)',
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--bg-border)' }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-3"
              style={{ borderBottom: '1px solid var(--bg-border)' }}
            >
              <div>
                <h2 className="font-bold text-lg serif" style={{ color: 'var(--text-primary)' }}>
                  {t('cartTitle', lang)}
                </h2>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {cartCount} {cartCount === 1 ? t('item', lang) : t('items', lang)}
                </p>
              </div>
              <button onClick={() => setShowCart(false)} className="btn-icon" aria-label="Close cart">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="rounded-xl p-3"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}
                >
                  <div className="flex items-start gap-3">
                    {/* Name + price */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                        {lang === 'km' ? item.name_km : item.name_en}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-dim)' }}>
                        {lang === 'km' ? item.name_en : item.name_km}
                      </p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--primary)' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Stepper */}
                    <div className="qty-stepper" role="group" aria-label={`Quantity of ${item.name_en}`}>
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        aria-label={`Decrease ${item.name_en}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        aria-label={`Increase ${item.name_en}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{
                        background: 'rgba(224,82,82,0.1)',
                        color: 'var(--red-err)',
                        border: '1px solid rgba(224,82,82,0.2)',
                        minHeight: 'unset',
                      }}
                      aria-label={`Remove ${item.name_en}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Notes row — shown if present */}
                  {item.notes && (
                    <div
                      className="flex items-start gap-1.5 mt-2 pt-2"
                      style={{ borderTop: '1px solid var(--bg-border)' }}
                    >
                      <FileText className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: 'var(--fresh)' }} aria-hidden="true" />
                      <p className="text-xs italic leading-snug" style={{ color: 'var(--fresh)' }}>
                        <span className="font-semibold not-italic mr-1">{t('notesInCart', lang)}:</span>
                        {item.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-5" style={{ borderTop: '1px solid var(--bg-border)' }}>
              <div className="divider mb-4" />
              <div className="flex items-center justify-between mb-5">
                <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {t('total', lang)}
                </span>
                <span className="text-2xl font-bold serif" style={{ color: 'var(--primary)' }}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary w-full py-4 text-base justify-center"
                aria-busy={submitting}
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    {t('placingOrder', lang)}
                  </>
                ) : (
                  t('placeOrder', lang)
                )}
              </button>
              <p className="text-center text-xs mt-3" style={{ color: 'var(--text-dim)' }}>
                {t('tableLabel', lang)} {table}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

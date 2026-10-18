'use client'

import { useEffect, useRef, useState } from 'react'
import { FileText, Minus, Plus, ShoppingCart, X } from 'lucide-react'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'
import type { MenuItem } from '@/lib/types'

type ProductDetailModalProps = {
  item: MenuItem
  lang: Lang
  cartQty: number
  onClose: () => void
  onAdd: (item: MenuItem, qty: number, notes: string) => void
}

export function ProductDetailModal({ item, lang, cartQty, onClose, onAdd }: ProductDetailModalProps) {
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState('')
  const [added, setAdded] = useState(false)
  const notesRef = useRef<HTMLTextAreaElement>(null)

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
  const primaryName = lang === 'km' ? item.name_km : item.name_en
  const secondaryName = lang === 'km' ? item.name_en : item.name_km

  return (
    <div
      className="modal-backdrop anim-fade"
      role="dialog"
      aria-modal="true"
      aria-label={primaryName}
      onKeyDown={e => e.key === 'Escape' && onClose()}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="modal-panel">
        <div
          className="relative w-full flex-shrink-0 overflow-hidden"
          style={{ height: 240, background: 'var(--bg-elevated)' }}
        >
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image_url} alt={primaryName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-25">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
              <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{item.category}</span>
            </div>
          )}

          <div
            className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: 'linear-gradient(to top, var(--bg-modal), transparent)' }}
            aria-hidden="true"
          />

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

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(6px)', minHeight: 'unset' }}
            aria-label={t('detailClose', lang)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pt-4 pb-2">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-xl leading-snug serif" style={{ color: 'var(--text-primary)' }}>
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

          <div className="divider mb-4" />

          <div className="mb-5">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--text-dim)' }}>
              {t('detailDescription', lang)}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {item.description ? item.description : t('detailNoDesc', lang)}
            </p>
          </div>

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
                <button onClick={() => setQty(q => q + 1)} aria-label="Increase quantity">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{t('detailSubtotal', lang)}</p>
                <p className="text-2xl font-bold serif" style={{ color: 'var(--primary)' }}>
                  ${subtotal}
                </p>
              </div>
            </div>
          </div>

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

        <div className="px-5 py-4 flex-shrink-0" style={{ borderTop: '1px solid var(--bg-border)' }}>
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

'use client'

import { FileText, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'
import type { CartItem } from '@/lib/types'

type CartSheetProps = {
  cart: CartItem[]
  lang: Lang
  table: string | null
  cartTotal: number
  cartCount: number
  open: boolean
  submitting: boolean
  onOpen: () => void
  onClose: () => void
  onUpdateQty: (id: string, delta: number) => void
  onRemove: (id: string) => void
  onSubmit: () => void
}

export function CartSheet({
  cart,
  lang,
  table,
  cartTotal,
  cartCount,
  open,
  submitting,
  onOpen,
  onClose,
  onUpdateQty,
  onRemove,
  onSubmit,
}: CartSheetProps) {
  return (
    <>
      {cartCount > 0 && (
        <button
          onClick={onOpen}
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

      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={t('cartTitle', lang)}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(7px)' }}
            onClick={onClose}
            aria-hidden="true"
          />

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
            <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--bg-border)' }} />
            </div>

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
              <button onClick={onClose} className="btn-icon" aria-label="Close cart">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="rounded-xl p-3"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}
                >
                  <div className="flex items-start gap-3">
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

                    <div className="qty-stepper" role="group" aria-label={`Quantity of ${item.name_en}`}>
                      <button onClick={() => onUpdateQty(item.id, -1)} aria-label={`Decrease ${item.name_en}`}>
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} aria-label={`Increase ${item.name_en}`}>
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemove(item.id)}
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
                onClick={onSubmit}
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
    </>
  )
}

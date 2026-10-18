'use client'

import { ChevronRight, FileText, Minus, Plus } from 'lucide-react'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'
import type { CartItem, MenuItem } from '@/lib/types'

type MenuCardProps = {
  item: MenuItem
  lang: Lang
  cartItem?: CartItem
  onOpenDetail: (item: MenuItem) => void
  onAdd: (item: MenuItem, qty: number, notes: string) => void
  onUpdateQty: (id: string, delta: number) => void
}

export function MenuCard({ item, lang, cartItem, onOpenDetail, onAdd, onUpdateQty }: MenuCardProps) {
  const inQty = cartItem?.quantity ?? 0
  const primaryName = lang === 'km' ? item.name_km : item.name_en

  return (
    <div className="card card-hover flex flex-col overflow-hidden" style={{ cursor: 'pointer' }}>
      <div
        className="relative w-full overflow-hidden flex-shrink-0"
        style={{ height: 150, background: 'var(--bg-elevated)' }}
        onClick={() => onOpenDetail(item)}
        role="button"
        tabIndex={0}
        aria-label={`${primaryName} — ${t('tapForDetail', lang)}`}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onOpenDetail(item)}
      >
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={primaryName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            </svg>
          </div>
        )}

        <span className="tag-fresh absolute top-2 left-2" style={{ backdropFilter: 'blur(6px)' }}>
          {item.category}
        </span>

        {inQty > 0 && (
          <span
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
            style={{ background: 'var(--primary)', color: 'var(--text-invert)', boxShadow: 'var(--shadow-primary)' }}
            aria-label={`${inQty} in cart`}
          >
            {inQty}
          </span>
        )}

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

      <div className="p-3 flex flex-col gap-1.5 flex-1" onClick={() => onOpenDetail(item)}>
        <p className="font-semibold text-sm leading-snug line-clamp-1" style={{ color: 'var(--text-primary)' }}>
          {primaryName}
        </p>
        <p className="text-[11px] line-clamp-1" style={{ color: 'var(--text-dim)' }}>
          {lang === 'km' ? item.name_en : item.name_km}
        </p>

        {cartItem?.notes && (
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--fresh)' }} aria-hidden="true" />
            <p className="text-[10px] truncate italic" style={{ color: 'var(--fresh)' }}>
              {cartItem.notes}
            </p>
          </div>
        )}
      </div>

      <div className="px-3 pb-3 flex items-center justify-between" onClick={e => e.stopPropagation()}>
        <span className="font-bold text-sm" style={{ color: 'var(--primary)' }}>
          ${item.price.toFixed(2)}
        </span>

        {inQty > 0 ? (
          <div className="qty-stepper" role="group" aria-label={`Quantity of ${item.name_en}`}>
            <button onClick={() => onUpdateQty(item.id, -1)} aria-label="Remove one">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span aria-live="polite">{inQty}</span>
            <button onClick={() => onAdd(item, 1, '')} aria-label="Add one more">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onOpenDetail(item)}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all active:scale-90"
            style={{
              background: 'var(--primary)',
              color: 'var(--text-invert)',
              boxShadow: 'var(--shadow-primary)',
              minHeight: 'unset',
            }}
            aria-label={`${t('addToCart', lang)} ${primaryName}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

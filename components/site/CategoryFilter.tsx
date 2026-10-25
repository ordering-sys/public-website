'use client'

import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'

type CategoryFilterProps = {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
  lang: Lang
}

export function CategoryFilter({ categories, selected, onSelect, lang }: CategoryFilterProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6"
      role="tablist"
      aria-label="Menu categories"
    >
      {categories.map(cat => {
        const active = selected === cat
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(cat)}
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
  )
}

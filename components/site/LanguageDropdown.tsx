'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import type { Lang } from '@/lib/i18n'

/* ─── Flags (High-definition SVGs) ─── */
function UKFlag() {
  return (
    <svg
      viewBox="0 0 60 36"
      className="w-6 h-4 rounded-[3px] shadow-xs flex-shrink-0 object-cover"
      aria-hidden="true"
    >
      <clipPath id="uk-flag-clip">
        <rect width="60" height="36" rx="3" />
      </clipPath>
      <g clipPath="url(#uk-flag-clip)">
        <rect width="60" height="36" fill="#012169" />
        <path d="M0,0 L60,36 M60,0 L0,36" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,36 M60,0 L0,36" stroke="#C8102E" strokeWidth="2.5" />
        <path d="M30,0 v36 M0,18 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v36 M0,18 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}

function CambodiaFlag() {
  return (
    <svg
      viewBox="0 0 60 36"
      className="w-6 h-4 rounded-[3px] shadow-xs flex-shrink-0 object-cover"
      aria-hidden="true"
    >
      <clipPath id="kh-flag-clip">
        <rect width="60" height="36" rx="3" />
      </clipPath>
      <g clipPath="url(#kh-flag-clip)">
        <rect width="60" height="9" fill="#032EA6" />
        <rect y="27" width="60" height="9" fill="#032EA6" />
        <rect y="9" width="60" height="18" fill="#ED1B24" />
        {/* Angkor Wat silhouette */}
        <g fill="#FFFFFF" transform="translate(16, 10.5) scale(0.68)">
          <rect x="2" y="19" width="38" height="3" />
          <rect x="4" y="16" width="34" height="3" />
          {/* Central Tower */}
          <polygon points="21,1 18,8 24,8" />
          <rect x="19.5" y="8" width="3" height="8" />
          {/* Left Tower */}
          <polygon points="11,5 9,10 13,10" />
          <rect x="10" y="10" width="2" height="6" />
          {/* Right Tower */}
          <polygon points="31,5 29,10 33,10" />
          <rect x="30" y="10" width="2" height="6" />
          {/* Spires */}
          <polygon points="6,9 5,12 7,12" />
          <polygon points="36,9 35,12 37,12" />
          <rect x="13" y="16" width="16" height="3" fill="#ED1B24" />
        </g>
      </g>
    </svg>
  )
}

/* ─── Globe Icon (matching Image 3 with continuous slow & fast spin support) ─── */
function GlobeIcon({ isFast = false, size = 18 }: { isFast?: boolean; size?: number }) {
  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 ${
        isFast ? 'globe-spin-fast' : 'globe-spin-slow'
      }`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Globe image mask matching Image 3 */}
      <div
        className="w-full h-full"
        style={{
          backgroundColor: 'currentColor',
          WebkitMask: `url('/globe-icon.png') no-repeat center / contain`,
          mask: `url('/globe-icon.png') no-repeat center / contain`,
        }}
      />
    </div>
  )
}

export function LanguageDropdown() {
  const { lang, setLang } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isSpinningFast, setIsSpinningFast] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current)
      }
    }
  }, [])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelectLanguage = (newLang: Lang) => {
    // Clear any pending timeout
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current)
    }

    // Trigger fast spin animation immediately
    setIsSpinningFast(true)

    // Always invoke setLang so state & storage sync immediately
    setLang(newLang)

    // Return to smooth slow continuous spin after 850ms
    spinTimeoutRef.current = setTimeout(() => {
      setIsSpinningFast(false)
    }, 850)

    setIsOpen(false)
  }

  const currentLabel = lang === 'en' ? 'EN' : 'ខ្មែរ'

  return (
    <div ref={containerRef} className="relative inline-block text-left select-none">
      {/* ── Trigger Button (matching Image 2) ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`lang-dropdown-btn flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 border ${
          isOpen ? 'ring-2 ring-primary/40 border-primary' : ''
        }`}
        style={{
          height: 38,
          minHeight: 'unset',
          background: 'var(--bg-elevated)',
          borderColor: isOpen ? 'var(--primary)' : 'var(--bg-border)',
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Language selector, current language: ${lang === 'en' ? 'English' : 'Khmer'}`}
      >
        {/* Globe icon badge with spinner indicator */}
        <div
          className="relative w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            background: isSpinningFast ? 'rgba(99, 102, 241, 0.22)' : 'rgba(99, 102, 241, 0.12)',
            color: 'var(--primary)',
            border: isSpinningFast ? '1px solid var(--primary)' : '1px solid rgba(99, 102, 241, 0.25)',
          }}
        >
          {isSpinningFast && (
            <span
              className="absolute -inset-0.5 rounded-full border-2 border-primary border-t-transparent animate-spin"
              style={{ animationDuration: '0.45s' }}
              aria-hidden="true"
            />
          )}
          <GlobeIcon isFast={isSpinningFast} size={15} />
        </div>

        {/* Current Language text */}
        <span className="font-bold text-xs sm:text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>
          {currentLabel}
        </span>

        {/* Chevron Icon */}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 opacity-70 ${
            isOpen ? 'rotate-180 text-primary opacity-100' : ''
          }`}
          style={{ color: 'var(--text-secondary)' }}
          aria-hidden="true"
        />
      </button>

      {/* ── Dropdown Panel (matching Image 2) ── */}
      {isOpen && (
        <div
          className="lang-dropdown-panel absolute right-0 top-full mt-2 w-60 sm:w-64 z-50 rounded-2xl overflow-hidden shadow-xl border animate-fadeUpFast"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--bg-border)',
            boxShadow: 'var(--shadow-lg)',
          }}
          role="listbox"
          aria-label="Select a language"
        >
          {/* Header row: Globe icon + uppercase LANGUAGE label */}
          <div
            className="px-4 py-2.5 flex items-center gap-2 border-b"
            style={{
              borderColor: 'var(--bg-border)',
              background: 'var(--bg-elevated)',
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(99, 102, 241, 0.14)',
                color: 'var(--primary)',
              }}
            >
              <GlobeIcon size={12} />
            </div>
            <span
              className="text-[10px] font-extrabold tracking-wider uppercase"
              style={{ color: 'var(--text-dim)' }}
            >
              LANGUAGE
            </span>
          </div>

          {/* Options List */}
          <div className="p-1.5 space-y-1">
            {/* 1. English Option */}
            <button
              type="button"
              onClick={() => handleSelectLanguage('en')}
              className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-left transition-all duration-150 group ${
                lang === 'en' ? 'lang-item-active' : 'hover:bg-[var(--bg-hover)]'
              }`}
              style={{
                background: lang === 'en' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
              }}
              role="option"
              aria-selected={lang === 'en'}
            >
              <div className="flex items-center gap-3 min-w-0">
                <UKFlag />
                <div className="min-w-0 py-0.5">
                  <p
                    className="font-bold text-sm leading-snug"
                    style={{
                      color: lang === 'en' ? 'var(--primary)' : 'var(--text-primary)',
                    }}
                  >
                    English
                  </p>
                  <p
                    className="text-xs leading-normal font-medium mt-0.5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    English (EN)
                  </p>
                </div>
              </div>

              {lang === 'en' && (
                <div
                  className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0"
                  style={{
                    color: 'var(--primary)',
                  }}
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
            </button>

            {/* 2. Khmer Option */}
            <button
              type="button"
              onClick={() => handleSelectLanguage('km')}
              className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-left transition-all duration-150 group ${
                lang === 'km' ? 'lang-item-active' : 'hover:bg-[var(--bg-hover)]'
              }`}
              style={{
                background: lang === 'km' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
              }}
              role="option"
              aria-selected={lang === 'km'}
            >
              <div className="flex items-center gap-3 min-w-0">
                <CambodiaFlag />
                <div className="min-w-0 py-0.5">
                  <p
                    className="font-bold text-sm leading-snug"
                    style={{
                      color: lang === 'km' ? 'var(--primary)' : 'var(--text-primary)',
                    }}
                  >
                    ភាសាខ្មែរ
                  </p>
                  <p
                    className="text-xs leading-normal font-medium mt-0.5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Khmer (KM)
                  </p>
                </div>
              </div>

              {lang === 'km' && (
                <div
                  className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0"
                  style={{
                    color: 'var(--primary)',
                  }}
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

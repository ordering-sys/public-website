'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Sparkles, Star, Coffee } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export function Hero3DShowcase() {
  const { lang, theme } = useTheme()
  const isLight = theme === 'light'
  const cardRef = useRef<HTMLDivElement>(null)

  // 3D Parallax Tilt State
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Handle smooth 3D tilt on mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate rotation (-14 to 14 deg)
    const rotX = -((y - centerY) / centerY) * 14
    const rotY = ((x - centerX) / centerX) * 16

    setRotateX(rotX)
    setRotateY(rotY)
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div
      className="relative w-full max-w-[480px] mx-auto select-none py-4"
      style={{ perspective: '1200px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Ambient Radial Backlight Glow Behind Cup (No harsh boxes) ── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[440px] h-[340px] sm:h-[440px] rounded-full pointer-events-none filter blur-[80px] transition-all duration-700"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(240,167,66,0.3) 0%, rgba(48,201,160,0.18) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(240,167,66,0.45) 0%, rgba(48,201,160,0.2) 50%, transparent 75%)',
          opacity: isHovered ? 0.9 : 0.7,
          transform: `translate(-50%, -50%) scale(${isHovered ? 1.15 : 1})`,
        }}
        aria-hidden="true"
      />

      {/* ── Floating 3D Main Stage ── */}
      <div
        ref={cardRef}
        className={`relative w-full aspect-square transition-transform duration-300 ease-out flex items-center justify-center ${!isHovered ? 'animate-hero-float' : ''
          }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {/* ── Realistic 3D Ground Shadow Under Saucer ── */}
        <div
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[72%] h-12 rounded-[100%] filter blur-xl transition-all duration-500 pointer-events-none"
          style={{
            background: isLight
              ? 'radial-gradient(ellipse, rgba(0,0,0,0.22) 0%, rgba(192,120,24,0.1) 45%, transparent 75%)'
              : 'radial-gradient(ellipse, rgba(0,0,0,0.78) 0%, rgba(240,167,66,0.18) 45%, transparent 75%)',
            transform: `translate(-50%, 0) scale(${isHovered ? 0.95 : 1})`,
          }}
          aria-hidden="true"
        />

        {/* ── Transparent Cup Render (No background box!) ── */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src="/images/hero-cup-transparent.png"
            alt="Artisanal 3D Coffee Cup at The Bean Haven"
            width={480}
            height={480}
            priority
            className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1.0)',
            }}
          />

          {/* ── Soft Ethereal Hot Coffee Steam (Originating strictly in the middle of the coffee cup) ── */}
          <div
            className="absolute left-[51%] -translate-x-1/2 bottom-[64%] w-40 h-52 pointer-events-none flex items-end justify-center z-10 overflow-visible"
            aria-hidden="true"
          >
            {/* Soft Warm Heat Haze at the liquid surface */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-7 rounded-[100%] pointer-events-none filter blur-md animate-vapor-haze"
              style={{
                background: isLight
                  ? 'radial-gradient(ellipse at center, rgba(192, 120, 24, 0.28) 0%, rgba(240, 167, 66, 0.12) 50%, transparent 80%)'
                  : 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.35) 0%, rgba(240, 167, 66, 0.2) 50%, transparent 80%)',
              }}
            />

            {/* Smooth Ethereal Steam SVG with soft Gaussian blur */}
            <svg
              viewBox="0 0 120 180"
              fill="none"
              className="w-full h-full overflow-visible filter blur-[2.5px] opacity-80"
            >
              <path
                className="animate-steam-rise-1"
                d="M52 180 C44 140, 64 105, 50 65 C40 32, 58 14, 52 0"
                stroke="url(#smoothSteamGrad1)"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                className="animate-steam-rise-2"
                d="M62 180 C72 135, 52 100, 66 60 C76 28, 60 12, 68 0"
                stroke="url(#smoothSteamGrad2)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                className="animate-steam-rise-3"
                d="M44 180 C36 142, 52 110, 40 70 C32 35, 46 16, 38 0"
                stroke="url(#smoothSteamGrad1)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="smoothSteamGrad1" x1="0" y1="180" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#f0a742" stopOpacity="0.55" />
                  <stop offset="25%" stopColor={isLight ? '#c07818' : '#ffffff'} stopOpacity="0.4" />
                  <stop offset="70%" stopColor={isLight ? '#f0a742' : '#ffffff'} stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="smoothSteamGrad2" x1="0" y1="180" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={isLight ? '#f0a742' : '#ffffff'} stopOpacity="0.65" />
                  <stop offset="35%" stopColor="#f7c06a" stopOpacity="0.38" />
                  <stop offset="80%" stopColor={isLight ? '#c07818' : '#ffffff'} stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            THEME-RESPONSIVE FLOATING 3D GLASS BADGES
            ════════════════════════════════════════════════════════ */}

        {/* ── Badge 1: Top Right Rating & Craft Badge ── */}
        <div
          className="absolute -top-1 right-0 sm:-right-2 px-3.5 py-2.5 rounded-2xl border shadow-xl backdrop-blur-xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 z-20"
          style={{
            background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(20, 16, 12, 0.88)',
            borderColor: isLight ? 'rgba(192, 120, 24, 0.35)' : 'rgba(240, 167, 66, 0.45)',
            boxShadow: isLight
              ? '0 12px 28px rgba(0,0,0,0.08), 0 2px 10px rgba(192,120,24,0.12)'
              : '0 14px 30px rgba(0,0,0,0.65), 0 0 20px rgba(240,167,66,0.22)',
            transform: `translateZ(55px) translateY(${isHovered ? '-4px' : '0px'})`,
          }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #f0a742, #c8831a)',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(240,167,66,0.4)',
            }}
          >
            <Star className="w-4 h-4 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                4.9 / 5.0
              </span>
              <span className="text-[10px] text-amber-500">★ ★ ★ ★ ★</span>
            </div>
            <p className="text-[10px] font-semibold truncate max-w-[125px]" style={{ color: 'var(--text-secondary)' }}>
              {lang === 'km' ? 'កាហ្វេជាប់ចិត្តលេខ ១' : 'Best Rated Specialty'}
            </p>
          </div>
        </div>

        {/* ── Badge 2: Bottom Left Live Fresh Roast Badge ── */}
        <div
          className="absolute bottom-2 left-0 sm:-left-2 px-3.5 py-2.5 rounded-2xl border shadow-xl backdrop-blur-xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 z-20"
          style={{
            background: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(12, 22, 18, 0.88)',
            borderColor: isLight ? 'rgba(15, 168, 130, 0.35)' : 'rgba(48, 201, 160, 0.45)',
            boxShadow: isLight
              ? '0 12px 28px rgba(0,0,0,0.08), 0 2px 10px rgba(15,168,130,0.12)'
              : '0 14px 30px rgba(0,0,0,0.65), 0 0 20px rgba(48,201,160,0.22)',
            transform: `translateZ(65px) translateY(${isHovered ? '4px' : '0px'})`,
          }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #30c9a0, #0fa882)',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(48,201,160,0.4)',
            }}
          >
            <Coffee className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold" style={{ color: isLight ? '#078066' : '#56ddb8' }}>
                {lang === 'km' ? 'ឆុងស្រស់ៗរាល់ថ្ងៃ' : 'Freshly Brewed'}
              </span>
            </div>
            <p className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>
              {lang === 'km' ? 'គ្រាប់កាហ្វេ Arabica ១០០%' : '100% Single Origin'}
            </p>
          </div>
        </div>

        {/* ── Badge 3: Floating Micro 3D Crema Pill ── */}
        <div
          className="hidden sm:flex absolute top-1/2 -right-4 -translate-y-1/2 px-2.5 py-1.5 rounded-full border shadow-lg backdrop-blur-md items-center gap-1.5 z-20 animate-bounce-slight"
          style={{
            background: isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(25, 20, 15, 0.85)',
            borderColor: isLight ? 'rgba(192, 120, 24, 0.3)' : 'rgba(240, 167, 66, 0.35)',
            transform: 'translateZ(40px)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
          <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
            {lang === 'km' ? 'រសជាតិផ្អែមក្រអូប' : 'Silky Crema'}
          </span>
        </div>
      </div>
    </div>
  )
}

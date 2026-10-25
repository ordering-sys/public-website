'use client'

import { useMemo } from 'react'
import Image from 'next/image'

interface BeanParticle {
  id: number
  left: number // percentage 0 - 100
  size: number // px
  duration: number // seconds
  delay: number // seconds
  swayDuration: number // seconds
  swayDistance: number // px
  opacity: number
  blur: number // px
  rotation: number // initial deg
}

export function CoffeeBeanRain() {
  // Generate a rich array of falling 3D coffee bean particles with staggered negative delays
  // so particles are immediately visible raining down across the viewport on first render
  const beans: BeanParticle[] = useMemo(() => [
    { id: 1,  left: 4,  size: 26, duration: 8.5, delay: -3.2, swayDuration: 3.2, swayDistance: 14,  opacity: 0.75, blur: 0,   rotation: 25 },
    { id: 2,  left: 11, size: 18, duration: 11.2, delay: -7.5, swayDuration: 4.0, swayDistance: -18, opacity: 0.52, blur: 0.8, rotation: 80 },
    { id: 3,  left: 19, size: 34, duration: 7.4, delay: -1.6, swayDuration: 2.8, swayDistance: 20,  opacity: 0.85, blur: 0,   rotation: -45 },
    { id: 4,  left: 27, size: 22, duration: 9.6, delay: -5.4, swayDuration: 3.6, swayDistance: -14, opacity: 0.60, blur: 0.5, rotation: 140 },
    { id: 5,  left: 36, size: 30, duration: 8.0, delay: -8.8, swayDuration: 3.0, swayDistance: 16,  opacity: 0.80, blur: 0,   rotation: 60 },
    { id: 6,  left: 44, size: 16, duration: 12.0, delay: -2.8, swayDuration: 4.5, swayDistance: -20, opacity: 0.45, blur: 1.2, rotation: -90 },
    { id: 7,  left: 52, size: 32, duration: 7.8, delay: -6.1, swayDuration: 3.1, swayDistance: 18,  opacity: 0.82, blur: 0,   rotation: 110 },
    { id: 8,  left: 60, size: 20, duration: 10.4, delay: -0.4, swayDuration: 3.8, swayDistance: -15, opacity: 0.55, blur: 0.6, rotation: -30 },
    { id: 9,  left: 68, size: 28, duration: 8.4, delay: -4.5, swayDuration: 3.4, swayDistance: 22,  opacity: 0.78, blur: 0,   rotation: 40 },
    { id: 10, left: 76, size: 22, duration: 9.2, delay: -8.0, swayDuration: 3.7, swayDistance: -16, opacity: 0.65, blur: 0.4, rotation: -120 },
    { id: 11, left: 83, size: 36, duration: 7.2, delay: -2.1, swayDuration: 2.9, swayDistance: 24,  opacity: 0.88, blur: 0,   rotation: 15 },
    { id: 12, left: 91, size: 18, duration: 11.5, delay: -6.7, swayDuration: 4.2, swayDistance: -16, opacity: 0.50, blur: 0.9, rotation: 95 },
    { id: 13, left: 97, size: 26, duration: 8.8, delay: -1.0, swayDuration: 3.3, swayDistance: 15,  opacity: 0.72, blur: 0,   rotation: -75 },
    { id: 14, left: 15, size: 24, duration: 9.0, delay: 1.5,  swayDuration: 3.5, swayDistance: -12, opacity: 0.68, blur: 0,   rotation: 50 },
    { id: 15, left: 48, size: 22, duration: 10.0, delay: 3.2, swayDuration: 3.9, swayDistance: 18,  opacity: 0.58, blur: 0.5, rotation: -60 },
    { id: 16, left: 80, size: 30, duration: 8.2, delay: 2.4,  swayDuration: 3.2, swayDistance: -20, opacity: 0.82, blur: 0,   rotation: 130 },
  ], [])

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-[10] select-none"
      style={{
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {beans.map((bean) => (
        <div
          key={bean.id}
          className="absolute -top-20 animate-bean-fall pointer-events-none"
          style={{
            left: `${bean.left}%`,
            width: `${bean.size}px`,
            height: `${bean.size}px`,
            animationDuration: `${bean.duration}s`,
            animationDelay: `${bean.delay}s`,
            opacity: bean.opacity,
            filter: bean.blur > 0 ? `blur(${bean.blur}px)` : 'none',
          }}
        >
          <div
            className="w-full h-full animate-bean-sway pointer-events-none"
            style={{
              animationDuration: `${bean.swayDuration}s`,
            }}
          >
            <Image
              src="/images/coffee-bean-3d.png"
              alt="Falling 3D coffee bean"
              width={bean.size}
              height={bean.size}
              className="w-full h-full object-contain drop-shadow-md pointer-events-none"
              style={{
                transform: `rotate(${bean.rotation}deg)`,
              }}
              priority={bean.id <= 4}
            />
          </div>
        </div>
      ))}
    </div>
  )
}


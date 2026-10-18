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
  // Generate a consistent array of falling coffee bean particles
  const beans: BeanParticle[] = useMemo(() => [
    { id: 1,  left: 6,  size: 26, duration: 8.5, delay: 0.2, swayDuration: 3.2, swayDistance: 14, opacity: 0.75, blur: 0,   rotation: 25 },
    { id: 2,  left: 14, size: 18, duration: 11.0, delay: 3.5, swayDuration: 4.0, swayDistance: -18, opacity: 0.5,  blur: 0.8, rotation: 80 },
    { id: 3,  left: 24, size: 34, duration: 7.2, delay: 1.8, swayDuration: 2.8, swayDistance: 22, opacity: 0.85, blur: 0,   rotation: -45 },
    { id: 4,  left: 35, size: 22, duration: 9.8, delay: 5.0, swayDuration: 3.6, swayDistance: -12, opacity: 0.6,  blur: 0.5, rotation: 140 },
    { id: 5,  left: 48, size: 28, duration: 8.0, delay: 0.8, swayDuration: 3.0, swayDistance: 16, opacity: 0.7,  blur: 0,   rotation: 60 },
    { id: 6,  left: 58, size: 16, duration: 12.5, delay: 4.2, swayDuration: 4.5, swayDistance: -20, opacity: 0.45, blur: 1.2, rotation: -90 },
    { id: 7,  left: 68, size: 32, duration: 7.6, delay: 2.4, swayDuration: 3.1, swayDistance: 18, opacity: 0.85, blur: 0,   rotation: 110 },
    { id: 8,  left: 78, size: 20, duration: 10.2, delay: 6.1, swayDuration: 3.8, swayDistance: -15, opacity: 0.55, blur: 0.6, rotation: -30 },
    { id: 9,  left: 88, size: 30, duration: 8.2, delay: 1.2, swayDuration: 3.4, swayDistance: 20, opacity: 0.8,  blur: 0,   rotation: 40 },
    { id: 10, left: 95, size: 24, duration: 9.2, delay: 4.8, swayDuration: 3.7, swayDistance: -16, opacity: 0.65, blur: 0.4, rotation: -120 },
  ], [])

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-10 select-none"
      aria-hidden="true"
    >
      {beans.map((bean) => (
        <div
          key={bean.id}
          className="absolute -top-16 animate-bean-fall"
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
            className="w-full h-full animate-bean-sway"
            style={{
              animationDuration: `${bean.swayDuration}s`,
              transform: `rotate(${bean.rotation}deg)`,
            }}
          >
            <Image
              src="/images/coffee-bean-3d.png"
              alt="Falling 3D coffee bean"
              width={bean.size}
              height={bean.size}
              className="w-full h-full object-contain drop-shadow-md"
              priority={bean.id <= 3}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

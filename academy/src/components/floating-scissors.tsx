'use client'

import { useEffect, useRef } from 'react'

const SIZE = 56
const HALF = SIZE / 2
const MAX_BLADE_DEG = 22
const LERP = 0.18

/**
 * Tesoura flutuante: segue o cursor com suavidade e abre/fecha as lâminas
 * conforme o progresso do scroll (e dá um "snip" rápido na velocidade do scroll).
 * Desktop only — escondida em touch.
 */
export function FloatingScissors() {
  const rootRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<SVGGElement>(null)
  const rightRef = useRef<SVGGElement>(null)

  const mouse = useRef({ x: -999, y: -999 })
  const pos = useRef({ x: -999, y: -999 })
  const blade = useRef(0)
  const snipBoost = useRef(0)
  const lastScrollY = useRef(0)
  const lastScrollT = useRef(0)
  const visible = useRef(false)
  const raf = useRef(0)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer) return

    const root = rootRef.current
    if (!root) return

    document.documentElement.classList.add('scissors-cursor')

    const setBlade = (deg: number) => {
      const left = leftRef.current
      const right = rightRef.current
      if (!left || !right) return
      left.style.transform = `rotate(${-deg}deg)`
      right.style.transform = `rotate(${deg}deg)`
    }

    const scrollProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      if (!visible.current) {
        visible.current = true
        pos.current.x = e.clientX
        pos.current.y = e.clientY
        root.style.opacity = '1'
      }
    }

    const onLeave = () => {
      visible.current = false
      root.style.opacity = '0'
    }

    const onScroll = () => {
      const now = performance.now()
      const dy = Math.abs(window.scrollY - lastScrollY.current)
      const dt = Math.max(16, now - lastScrollT.current)
      const velocity = dy / dt
      lastScrollY.current = window.scrollY
      lastScrollT.current = now

      // snip boost decays in the animation loop
      if (velocity > 0.35) {
        snipBoost.current = Math.min(1, snipBoost.current + velocity * 0.8)
      }
    }

    const tick = () => {
      const targetX = mouse.current.x
      const targetY = mouse.current.y
      const ease = reduceMotion ? 1 : LERP

      pos.current.x += (targetX - pos.current.x) * ease
      pos.current.y += (targetY - pos.current.y) * ease

      root.style.transform = `translate3d(${pos.current.x - HALF}px, ${pos.current.y - HALF}px, 0)`

      const base = scrollProgress() * MAX_BLADE_DEG
      snipBoost.current *= reduceMotion ? 0 : 0.88
      const snip = snipBoost.current * 10
      const next = Math.min(MAX_BLADE_DEG + 8, base + snip)

      blade.current += (next - blade.current) * (reduceMotion ? 1 : 0.25)
      setBlade(blade.current)

      raf.current = requestAnimationFrame(tick)
    }

    lastScrollY.current = window.scrollY
    lastScrollT.current = performance.now()
    setBlade(scrollProgress() * MAX_BLADE_DEG)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    raf.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove('scissors-cursor')
    }
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden opacity-0 md:block"
      style={{ width: SIZE, height: SIZE, willChange: 'transform' }}
    >
      <svg
        className="h-full w-full drop-shadow-lg"
        viewBox="0 0 120 160"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="scissorsMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5f5f5" />
            <stop offset="35%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#d8d8d8" />
            <stop offset="100%" stopColor="#8a8a8a" />
          </linearGradient>
          <linearGradient id="scissorsRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4d4d4" />
            <stop offset="100%" stopColor="#606060" />
          </linearGradient>
        </defs>

        <g
          ref={leftRef}
          style={{ transformOrigin: '60px 80px' }}
        >
          <path
            d="M 60 80 L 35 25 Q 32 20 25 18 Q 15 16 12 18 Q 8 20 10 26 Q 14 32 22 36 L 55 75 Z"
            fill="url(#scissorsMetal)"
            stroke="#505050"
            strokeWidth="1"
          />
          <circle cx="12" cy="24" r="7" fill="url(#scissorsRing)" stroke="#404040" strokeWidth="1" />
          <circle cx="12" cy="24" r="4.5" fill="#e8e8e8" opacity="0.35" />
        </g>

        <g
          ref={rightRef}
          style={{ transformOrigin: '60px 80px' }}
        >
          <path
            d="M 60 80 L 35 135 Q 32 140 25 142 Q 15 144 12 142 Q 8 140 10 134 Q 14 128 22 124 L 55 85 Z"
            fill="url(#scissorsMetal)"
            stroke="#505050"
            strokeWidth="1"
          />
          <circle cx="12" cy="136" r="7" fill="url(#scissorsRing)" stroke="#404040" strokeWidth="1" />
          <circle cx="12" cy="136" r="4.5" fill="#e8e8e8" opacity="0.35" />
        </g>

        <circle cx="60" cy="80" r="5" fill="#b0b0b0" stroke="#606060" strokeWidth="0.8" />
        <circle cx="60" cy="80" r="3.5" fill="#d0d0d0" />
        <line x1="57" y1="80" x2="63" y2="80" stroke="#404040" strokeWidth="0.8" />
        <line x1="60" y1="77" x2="60" y2="83" stroke="#404040" strokeWidth="0.8" />
      </svg>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedDividerProps {
  variant?: 'line' | 'gradient' | 'accent'
  className?: string
}

export function AnimatedDivider({ variant = 'line', className = '' }: AnimatedDividerProps) {
  const dividerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const divider = dividerRef.current
    if (!divider) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.fromTo(
      divider,
      {
        scaleX: 0,
        opacity: 0,
      },
      {
        scaleX: 1,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: divider,
          start: 'top 90%',
          once: true,
        },
      }
    )
  }, [])

  const variantClasses = {
    line: 'h-px bg-border',
    gradient: 'h-px bg-gradient-to-r from-transparent via-gold to-transparent',
    accent: 'h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0 blur-sm',
  }

  return (
    <div
      ref={dividerRef}
      className={`${variantClasses[variant]} origin-left ${className}`}
      style={{ transformOrigin: 'left' }}
    />
  )
}

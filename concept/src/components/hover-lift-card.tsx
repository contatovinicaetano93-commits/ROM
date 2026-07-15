'use client'

import { useRef } from 'react'
import gsap from 'gsap'

interface HoverLiftCardProps {
  children: React.ReactNode
  className?: string
}

export function HoverLiftCard({ children, className = '' }: HoverLiftCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.to(cardRef.current, {
      y: -10,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`transition-shadow duration-300 ${className}`}
      style={{
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      {children}
    </div>
  )
}

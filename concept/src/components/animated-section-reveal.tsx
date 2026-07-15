'use client'

import { useEffect, useRef, ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedSectionRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  className?: string
}

export function AnimatedSectionReveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}: AnimatedSectionRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const fromVars: Record<string, number> = {
      opacity: 0,
    }

    if (direction === 'up') fromVars.y = 50
    else if (direction === 'down') fromVars.y = -50
    else if (direction === 'left') fromVars.x = 50
    else if (direction === 'right') fromVars.x = -50

    gsap.fromTo(
      section,
      fromVars,
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.8,
        delay: delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
        },
      }
    )
  }, [direction, delay])

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  )
}

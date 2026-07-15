'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedTextRevealProps {
  children: string
  className?: string
  delay?: number
}

export function AnimatedTextReveal({ children, className = '', delay = 0 }: AnimatedTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const words = children.split(' ')
    container.innerHTML = words
      .map((word, i) => `<span key="${i}" style="display: inline-block; overflow: hidden;"><span style="display: inline-block; opacity: 0;">${word}</span></span>`)
      .join(' ')

    const wordSpans = container.querySelectorAll('span > span')

    gsap.to(wordSpans, {
      opacity: 1,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out',
      delay: delay,
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        once: true,
      },
    })
  }, [children, delay])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

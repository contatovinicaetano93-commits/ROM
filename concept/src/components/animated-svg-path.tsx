'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedSvgPathProps {
  pathData: string
  strokeColor?: string
  strokeWidth?: number
  duration?: number
  delay?: number
  className?: string
}

export function AnimatedSvgPath({
  pathData,
  strokeColor = '#D4AF37',
  strokeWidth = 2,
  duration = 2,
  delay = 0,
  className = '',
}: AnimatedSvgPathProps) {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const length = path.getTotalLength()
    path.style.strokeDasharray = String(length)
    path.style.strokeDashoffset = String(length)

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: duration,
      delay: delay,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: path.closest('svg'),
        start: 'top 80%',
        once: true,
      },
    })
  }, [duration, delay])

  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path
        ref={pathRef}
        d={pathData}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

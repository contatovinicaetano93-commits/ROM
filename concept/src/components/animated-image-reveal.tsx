'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedImageRevealProps {
  src: string
  alt: string
  className?: string
}

export function AnimatedImageReveal({ src, alt, className = '' }: AnimatedImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const image = imageRef.current

    if (!container || !image) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.set(image, {
      clipPath: 'inset(0 0 100% 0)',
    })

    gsap.to(image, {
      clipPath: 'inset(0 0 0 0)',
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 75%',
        once: true,
      },
    })
  }, [])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div ref={imageRef}>
        <Image
          src={src}
          alt={alt}
          width={600}
          height={400}
          className="w-full h-auto object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  )
}

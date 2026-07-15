'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedGalleryItemProps {
  src: string
  alt: string
  type?: 'image' | 'video'
  poster?: string
  index?: number
}

export function AnimatedGalleryItem({
  src,
  alt,
  type = 'image',
  poster,
  index = 0,
}: AnimatedGalleryItemProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const image = imageRef.current

    if (!container || !image) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.set(image, {
      opacity: 0,
      scale: 0.9,
    })

    gsap.to(image, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      delay: index * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 75%',
        once: true,
      },
    })
  }, [index])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl aspect-video bg-surface/50 group cursor-pointer"
    >
      <div ref={imageRef} className="w-full h-full">
        {type === 'image' ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <video
            src={src}
            poster={poster}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
          <svg
            className="w-8 h-8 text-gold fill-current ml-1"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

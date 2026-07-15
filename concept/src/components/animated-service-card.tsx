'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HoverLiftCard } from '@/components/hover-lift-card'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedServiceCardProps {
  category: string
  name: string
  index: number
}

export function AnimatedServiceCard({ category, name, index }: AnimatedServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.fromTo(
      card,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true,
        },
      },
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [index])

  return (
    <HoverLiftCard className="card-border rounded-2xl p-5 transition-all duration-300 hover:border-gold/50 hover:bg-gold/5 cursor-pointer group">
      <article ref={cardRef} className="h-full">
        <p className="section-label mb-2 transition-colors group-hover:text-gold">{category}</p>
        <h3 className="text-base font-medium text-foreground transition-colors group-hover:text-gold">{name}</h3>
      </article>
    </HoverLiftCard>
  )
}

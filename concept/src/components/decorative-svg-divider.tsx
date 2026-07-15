'use client'

import { AnimatedSvgPath } from '@/components/animated-svg-path'

export function DecorativeSvgDivider() {
  return (
    <div className="flex justify-center py-8">
      <AnimatedSvgPath
        pathData="M10,50 Q50,20 90,50 T170,50"
        strokeColor="var(--gold)"
        strokeWidth={1.5}
        duration={2.5}
        className="w-32 h-16 opacity-60"
      />
    </div>
  )
}

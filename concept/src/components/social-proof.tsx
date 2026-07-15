import { CountUp } from '@/components/count-up'
import { AnimatedDivider } from '@/components/animated-divider'
import { stats } from '@/lib/content'

export function SocialProof() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <AnimatedDivider variant="gradient" className="my-8" />
      </div>
      <section className="border-y border-border bg-surface/50 py-14 md:py-16">
        <div className="mx-auto grid max-w-5xl gap-x-6 gap-y-10 px-5 sm:grid-cols-2 md:grid-cols-4 md:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <div className="medallion-ring flex size-28 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-card/60 p-3 md:size-32">
                <p className="font-serif text-lg leading-[1.15] text-gold-strong md:text-xl">
                  <CountUp value={stat.value} />
                </p>
              </div>
              <p className="mt-4 max-w-[11rem] text-xs leading-relaxed text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

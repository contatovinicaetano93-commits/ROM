'use client'

import Link from 'next/link'
import { AtSign, Clock, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react'
import { Section } from '@/components/section'
import { AnimatedImageReveal } from '@/components/animated-image-reveal'
import { HoverLiftCard } from '@/components/hover-lift-card'
import { mapUrl, salonWhatsappUrl, salons, type SalonUnit } from '@/lib/content'
import { trackEvent } from '@/lib/analytics'

const accentStyles: Record<SalonUnit['accent'], { badge: string; card: string; dot: string }> = {
  brasil: {
    badge: 'border-brasil/40 bg-brasil/10 text-brasil',
    card: 'salon-card-brasil',
    dot: 'bg-brasil',
  },
  iguatemi: {
    badge: 'border-iguatemi/40 bg-iguatemi/10 text-iguatemi',
    card: 'salon-card-iguatemi',
    dot: 'bg-iguatemi',
  },
}

function SalonCard({ salon }: { salon: SalonUnit }) {
  const styles = accentStyles[salon.accent]

  return (
    <HoverLiftCard className={`card-border flex h-full flex-col rounded-3xl overflow-hidden ${styles.card}`}>
      <article>
        <AnimatedImageReveal src={salon.image} alt={salon.name} className="mb-6 -mx-6 -mt-6 md:-mx-8 md:-mt-8" />
        <div className="px-6 md:px-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.65rem] font-semibold tracking-[0.2em] uppercase ${styles.badge}`}
              >
                {salon.shortName}
              </span>
              <h3 className="mt-4 font-serif text-2xl text-foreground md:text-3xl">{salon.name}</h3>
            </div>
            <span className={`mt-2 size-2.5 shrink-0 rounded-full ${styles.dot}`} aria-hidden />
          </div>

          <div className="mb-4 space-y-3 text-sm text-muted">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <div>
                <p className="text-foreground/90">{salon.location}</p>
                <p>{salon.address}</p>
                {salon.floor ? <p>{salon.floor}</p> : null}
                <p>São Paulo — SP · CEP {salon.cep}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-gold" />
              <a href={`tel:${salon.phone.replace(/\D/g, '')}`} className="hover:text-gold">
                {salon.phone}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <AtSign className="size-4 shrink-0 text-gold" />
              <a
                href={salon.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold"
              >
                @{salon.instagram.split('/').pop()}
              </a>
            </div>
          </div>

          <p className="mb-6 text-base leading-relaxed text-muted">{salon.description}</p>

          <ul className="mb-8 space-y-2">
            {salon.highlights.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
                <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${styles.dot}`} />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-3 sm:flex-row">
            <Link
              href={salonWhatsappUrl(salon)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('cta_salon', { unit: salon.id })}
              className="cta-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm uppercase"
            >
              <MessageCircle className="size-4" />
              Agendar aqui
            </Link>
            <Link
              href={mapUrl(salon.mapQuery)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('cta_map', { unit: salon.id })}
              className="cta-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm"
            >
              <Navigation className="size-4" />
              Como chegar
            </Link>
          </div>

          <p className="mt-4 flex items-center gap-2 text-xs text-muted">
            <Clock className="size-3.5 shrink-0" />
            {salon.hours}
          </p>
        </div>
      </article>
    </HoverLiftCard>
  )
}

export function SalonUnits() {
  return (
    <Section
      id="unidades"
      label="Onde estamos"
      title="Duas unidades em São Paulo"
      description="Escolha a unidade mais conveniente e agende #SeuMomentoROM pelo WhatsApp. A equipe confirma horário e serviço com você."
      className="bg-surface/30"
    >
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {salons.map((salon) => (
          <SalonCard key={salon.id} salon={salon} />
        ))}
      </div>
    </Section>
  )
}

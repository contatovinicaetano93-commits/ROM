import { landingHtml } from '@/lib/landing-html'

/** Markup da land page atual (rom-academy.vercel.app). A tesoura fica no layout. */
export function StaticLanding() {
  return (
    <div
      id="academy-landing"
      dangerouslySetInnerHTML={{ __html: landingHtml }}
    />
  )
}

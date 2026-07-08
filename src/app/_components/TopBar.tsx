'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, Users, ChevronRight } from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Visão geral', icon: LayoutDashboard },
  { href: '/contatos', label: 'Contatos', icon: Users },
] as const

export function TopBar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="flex items-center justify-between px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/90 active:bg-card"
          >
            <Menu size={22} />
          </button>

          <Link href="/dashboard" className="flex items-baseline gap-1">
            <span className="font-mono text-lg font-semibold tracking-[0.2em] text-gold">ROM</span>
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted">Club</span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 py-1 pl-1 pr-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-bold text-background">
              R
            </span>
            <div className="leading-tight">
              <p className="text-[0.6rem] text-muted">ROM Club</p>
              <p className="-mt-0.5 text-[0.7rem] font-semibold text-gold-strong">Recepção</p>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="animate-fade-in absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="animate-slide-in-left absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col border-r border-border bg-surface pt-[env(safe-area-inset-top)]">
            <div className="flex items-center justify-between px-5 py-5">
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-lg font-semibold tracking-[0.2em] text-gold">ROM</span>
                <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted">Club</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted active:bg-card"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-3">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl border px-3 py-3 text-sm transition-colors ${
                      active
                        ? 'border-gold/50 bg-gold/10 text-gold'
                        : 'border-transparent text-foreground/90 active:bg-card'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
                      {label}
                    </span>
                    <ChevronRight size={16} className={active ? 'text-gold/70' : 'text-muted'} />
                  </Link>
                )
              })}
            </nav>

            <div className="mt-auto px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-6">
              <p className="text-[0.65rem] text-muted">ROM · Onboarding &amp; KPIs</p>
              <p className="text-[0.6rem] text-muted/70">v0.1.0</p>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

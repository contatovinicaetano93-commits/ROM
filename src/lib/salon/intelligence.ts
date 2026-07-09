import type { SalonDailyMetrics } from '@/lib/salon/metrics'
import { getSalonUnit } from '@/lib/salon/unit'
import { formatCurrency } from '@/lib/salon/format'

export interface SalonIntelligence {
  unit: ReturnType<typeof getSalonUnit>
  /** Taxa de comparecimento: atendidos ÷ agendados (0–1) */
  attendance_rate: number | null
  /** Receita estimada perdida (no-shows × ticket médio) */
  revenue_at_risk: number
  /** Meta de faturamento do dia (R$) */
  daily_goal: number
  /** Progresso da meta (0–1) */
  goal_progress: number | null
  /** Quanto falta para a meta (R$) */
  goal_gap: number
  /** Ticket médio usado nos cálculos */
  effective_ticket_avg: number | null
  /** Capacidade diária de horários (env SALON_DAILY_CAPACITY) */
  daily_capacity: number
  /** Agendados ÷ capacidade (0–1) */
  occupancy_rate: number | null
  /** Uma linha pra equipe: meta · no-shows · ocupação */
  day_insight: string
}

function num(v: unknown): number {
  const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : 0
  return Number.isFinite(n) ? n : 0
}

export function getDailyGoal(): number {
  const raw = process.env.SALON_DAILY_GOAL
  if (!raw?.trim()) return 5000
  const n = Number(raw.replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : 5000
}

/** Horários disponíveis no dia — padrão 15 (ajustável via SALON_DAILY_CAPACITY). */
export function getDailyCapacity(): number {
  const raw = process.env.SALON_DAILY_CAPACITY
  if (!raw?.trim()) return 15
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 15
}

/** Linha única: meta · no-shows · ocupação — sem poluir a UI. */
export function buildDayInsight(input: {
  goal_gap: number
  revenue: number
  daily_goal: number
  no_shows: number
  appointments: number
  daily_capacity: number
}): string {
  const parts: string[] = []

  if (input.goal_gap <= 0 && input.revenue > 0) {
    parts.push('Meta do dia batida')
  } else if (input.goal_gap > 0) {
    parts.push(`Faltam ${formatCurrency(input.goal_gap)} pra meta`)
  } else {
    parts.push(`Meta ${formatCurrency(input.daily_goal)}`)
  }

  if (input.no_shows > 0) {
    const n = input.no_shows
    parts.push(`${n} no-show${n === 1 ? '' : 's'} · remarcar hoje`)
  }

  const cap = input.daily_capacity
  const booked = input.appointments
  parts.push(`${booked}/${cap} horários ocupados`)

  return parts.join(' · ')
}

export function computeSalonIntelligence(metrics: SalonDailyMetrics | null): SalonIntelligence {
  const unit = getSalonUnit()
  const daily_goal = getDailyGoal()
  const daily_capacity = getDailyCapacity()

  if (!metrics) {
    return {
      unit,
      attendance_rate: null,
      revenue_at_risk: 0,
      daily_goal,
      goal_progress: null,
      goal_gap: daily_goal,
      effective_ticket_avg: null,
      daily_capacity,
      occupancy_rate: null,
      day_insight: buildDayInsight({
        goal_gap: daily_goal,
        revenue: 0,
        daily_goal,
        no_shows: 0,
        appointments: 0,
        daily_capacity,
      }),
    }
  }

  const revenue = num(metrics.revenue)
  const appointments = num(metrics.appointments)
  const attended = num(metrics.attended)
  const no_shows = num(metrics.no_shows)
  const ticket_avg =
    metrics.ticket_avg != null && num(metrics.ticket_avg) > 0
      ? num(metrics.ticket_avg)
      : attended > 0
        ? revenue / attended
        : null

  const attendance_rate =
    appointments > 0 ? Math.min(1, attended / appointments) : attended > 0 ? 1 : null

  const revenue_at_risk = no_shows > 0 && ticket_avg ? no_shows * ticket_avg : 0

  const goal_progress = daily_goal > 0 ? Math.min(1, revenue / daily_goal) : null
  const goal_gap = Math.max(0, daily_goal - revenue)
  const occupancy_rate =
    daily_capacity > 0 ? Math.min(1, appointments / daily_capacity) : null

  return {
    unit,
    attendance_rate,
    revenue_at_risk,
    daily_goal,
    goal_progress,
    goal_gap,
    effective_ticket_avg: ticket_avg,
    daily_capacity,
    occupancy_rate,
    day_insight: buildDayInsight({
      goal_gap,
      revenue,
      daily_goal,
      no_shows,
      appointments,
      daily_capacity,
    }),
  }
}

export function attendanceRateLabel(rate: number | null) {
  if (rate === null) return '—'
  return `${(rate * 100).toFixed(0)}%`
}

export function goalProgressLabel(progress: number | null) {
  if (progress === null) return '—'
  return `${(progress * 100).toFixed(0)}%`
}

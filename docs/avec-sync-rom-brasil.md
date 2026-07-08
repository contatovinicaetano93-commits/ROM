# Sync Avec — ROM Brasil

## Modos

| Modo | URL | Frequência recomendada | Relatórios |
|------|-----|------------------------|------------|
| **fast** | `POST /api/avec/sync?mode=fast` | A cada 5 min | 0051, 0002, faturamento, cancelamentos (só hoje) |
| **full** | `POST /api/avec/sync?mode=full` | 1×/dia (8h) | + catálogo clientes 0004 + janela ampla |

Header: `Authorization: Bearer $CRON_SECRET`

## Vercel Hobby (plano atual)

O Hobby **só permite 1 cron/dia**. O `vercel.json` roda apenas o **full** às 8h.

### Sync fast a cada 5 min (grátis)

Use [cron-job.org](https://cron-job.org) ou similar:

```
POST https://rom-club.vercel.app/api/avec/sync?mode=fast
Header: Authorization: Bearer SEU_CRON_SECRET
Schedule: */5 * * * *
```

### Vercel Pro

Descomente no `vercel.json`:

```json
{
  "path": "/api/avec/sync?mode=fast",
  "schedule": "*/5 * * * *"
}
```

## Unidade

Todas as métricas e logs referem **ROM Brasil** (`SALON_UNIT_NAME`).

## Variáveis

```
SALON_UNIT_NAME=ROM Brasil
SALON_DAILY_GOAL=5000
AVEC_API_TOKEN=...
CRON_SECRET=...
```

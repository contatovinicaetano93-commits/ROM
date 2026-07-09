# Sync Avec — ROM Brasil

## Modos

| Modo | URL | Frequência recomendada | Relatórios |
|------|-----|------------------------|------------|
| **fast** | `POST /api/avec/sync?mode=fast` | A cada 5 min | 0051, 0002, faturamento, cancelamentos (só hoje) |
| **full** | `POST /api/avec/sync?mode=full` | 1×/dia (8h) | + catálogo clientes 0004 + janela ampla |

Header: `Authorization: Bearer $CRON_SECRET`

## Vercel Hobby (plano atual)

O Hobby **só permite 1 cron/dia**. O `vercel.json` roda apenas o **full** às 8h.

### Sync fast a cada 5 min — ativo neste Mac

LaunchAgent `com.rombrasil.avec-sync-fast` chama o endpoint a cada **300s**.

```bash
# Status
launchctl print "gui/$(id -u)/com.rombrasil.avec-sync-fast" | head -20
cat ~/Library/Application\ Support/ROM-Brasil/sync.history.log | tail -5

# Rodar agora
~/bin/rom-brasil-avec-sync-fast.sh

# Parar
launchctl bootout "gui/$(id -u)/com.rombrasil.avec-sync-fast"
```

Script do repo (manual): `scripts/avec-sync-fast.sh`

### Alternativa na nuvem (Mac desligado)

Use [cron-job.org](https://cron-job.org):

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
SALON_DAILY_CAPACITY=15
AVEC_API_TOKEN=...   # obrigatório para sync real
CRON_SECRET=...
```

## Observação

Sem `AVEC_API_TOKEN`, o cron roda a cada 5 min mas a API responde `Avec não configurado`.
Quando o token chegar, o mesmo cron passa a alimentar `/hoje` automaticamente.

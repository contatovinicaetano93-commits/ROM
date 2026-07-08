#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck disable=SC1091
set -a
source "$ROOT/.env.local"
set +a
: "${CRON_SECRET:?CRON_SECRET ausente em .env.local}"
curl -sS -X POST "https://rom-club.vercel.app/api/avec/sync?mode=fast" \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  -H "Content-Type: application/json" \
  -o /tmp/rom-avec-sync-last.json -w "%{http_code}" > /tmp/rom-avec-sync-http.txt
python3 - <<'PY'
import json
from pathlib import Path
http = Path('/tmp/rom-avec-sync-http.txt').read_text().strip()
print('HTTP', http)
try:
    d = json.loads(Path('/tmp/rom-avec-sync-last.json').read_text())
    data = d.get('data') or {}
    print('status', data.get('status'), 'kind', data.get('kind'), 'error', data.get('error'))
    stats = data.get('stats') or {}
    print('panel', stats.get('panel'), 'appointments', stats.get('appointments_synced'), 'attendances', stats.get('attendances_synced'))
except Exception as e:
    print('parse_error', e)
PY

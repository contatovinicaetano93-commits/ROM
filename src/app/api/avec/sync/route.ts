import { NextRequest } from 'next/server'
import { ok, err, handleError } from '@/lib/api-response'
import { isAvecConfigured, isAvecMock, getAvecBaseUrl, testAvecConnection } from '@/lib/avec/client'
import { runAvecSync, getLastAvecSync } from '@/lib/avec/sync'
import { isAuthorized } from '@/lib/auth'

async function authorize(req: NextRequest) {
  // Cron Vercel: Bearer CRON_SECRET ou header x-cron-secret
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    if (auth === `Bearer ${secret}` || req.headers.get('x-cron-secret') === secret) return true
  }

  // Admin logado no painel (cookie de sessão)
  if (await isAuthorized(req)) return true

  // Dev local sem CRON_SECRET e sem auth
  if (!secret) return true

  return false
}

// POST /api/avec/sync — sync manual (admin) ou Vercel Cron (Authorization: Bearer CRON_SECRET)
export async function POST(req: NextRequest) {
  try {
    if (!(await authorize(req))) return err('Não autorizado', 401)
    if (!isAvecConfigured()) return err('Avec não configurado (AVEC_API_TOKEN)', 503)

    const run = await runAvecSync()
    return ok(run)
  } catch (e) {
    return handleError(e)
  }
}

// GET /api/avec/sync — status da última sincronização + teste de conexão
export async function GET(req: NextRequest) {
  try {
    const test = req.nextUrl.searchParams.get('test') === '1'
    const last = await getLastAvecSync()
    return ok({
      configured: isAvecConfigured(),
      mock: isAvecMock(),
      base_url: getAvecBaseUrl(),
      docs: 'https://documenter.getpostman.com/view/12527228/2sA2xmUWJo',
      last,
      ...(test ? { connection: await testAvecConnection() } : {}),
    })
  } catch (e) {
    return handleError(e)
  }
}

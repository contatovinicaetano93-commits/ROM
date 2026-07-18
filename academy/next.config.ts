import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const appRoot = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  // Evita o Next subir para o monorepo rom_brasil e puxar middleware/sentry do app pai.
  turbopack: {
    root: appRoot,
  },
  outputFileTracingRoot: appRoot,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.greatpages.com.br',
      },
    ],
  },
}

export default nextConfig

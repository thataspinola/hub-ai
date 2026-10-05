import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: '/dist/hub-ai',
  basePath: '/hub-ai',
}

export default nextConfig

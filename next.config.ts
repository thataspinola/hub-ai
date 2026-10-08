import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: 'dist/react-ssr-corp-hubv-painel-administrativo',
  basePath: '/react-ssr-corp-hubv-painel-administrativo',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: '.next',
  basePath: '/react-ssr-corp-hubv-painel-administrativo',
  async redirects() {
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/',
            destination: '/react-ssr-corp-hubv-painel-administrativo',
            permanent: false,
            basePath: false,
          },
        ]
      : []
  },
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

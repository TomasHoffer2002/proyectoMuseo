/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/images/:path*',
        destination: 'http://localhost/apiLogin/imagenes/:path*',
      },
    ]
  },
}

export default nextConfig

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/v1/:path*',
        destination: '/api/:path*'
      }
    ]
  }
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.etsystatic.com', 'img.etsystatic.com'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

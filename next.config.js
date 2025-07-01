/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['cdn4.vectorstock.com', 'images.pexels.com'],
  },
}

module.exports = nextConfig
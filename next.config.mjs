/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "156.67.83.55" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
}

export default nextConfig

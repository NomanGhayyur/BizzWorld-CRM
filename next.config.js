/** @type {import('next').NextConfig} */

const urlRegex = /https?:\/\/(www\.)?([-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;

const [,,domain] = urlRegex.exec(process.env.NEXT_PUBLIC_BASE_URL);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [domain]
  },
}

module.exports = nextConfig

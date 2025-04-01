/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'raw.githubusercontent.com',
      'assets.coingecko.com',
      'tokens.1inch.io',
      'cryptologos.cc'
    ],
  },
  experimental: {
    turbo: true,
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // optimizeFonts: false,
  reactStrictMode: false,
  // reactStrictMode: true,
  images: {
    domains: ["cdn.discordapp.com"],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      http: false,
      https: false,
      crypto: false,
      stream: false,
      querystring: false,
    };

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

module.exports = nextConfig;

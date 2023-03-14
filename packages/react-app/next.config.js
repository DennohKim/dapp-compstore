/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
    };
    return config;
  },
  images: { domains: ["d3959dyu54wgqd.cloudfront.net"] },
  env: {
    PRIVATE_KEY:
      "95e5ca4eb3f5ebe4b3cdc99d0346073468679b63f5112d471076ec55875bb78f",
  },
};

module.exports = nextConfig

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
  images: {
    domains: [
      "d3959dyu54wgqd.cloudfront.net",
      "cdn.thepcenthusiast.com",
      "upload.wikimedia.org",
    ],
  },
};

module.exports = nextConfig

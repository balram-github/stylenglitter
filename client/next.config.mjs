/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d1lyfvoa64c11i.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;

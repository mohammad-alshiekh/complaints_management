/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'complaint.runasp.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

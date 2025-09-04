/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['127.0.0.1'], // أضف أي دومين خارجي آخر تستخدمه هنا
  },
};

module.exports = nextConfig;

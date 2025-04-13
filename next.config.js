/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  devIndicators: false,
  output: 'standalone',
  poweredByHeader: false, // Loại bỏ header "Powered by Next.js"
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Xóa console.log trong production
  },
  // Để tối ưu hóa các hình ảnh từ domains cụ thể
  images: {
    domains: ['your-image-domain.com'],
  },
};

module.exports = nextConfig;
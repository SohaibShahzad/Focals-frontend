/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

// /** @type {import('next').NextConfig} */
// module.exports = {
//   reactStrictMode: true,
//   async rewrites() {
//     return [
//       {
//         source: '/:path*',
//         destination: `${process.env.NEXT_PUBLIC_SERVER_URL}:path*`, // Proxy to Backend
//       },
//     ];
//   },
// };

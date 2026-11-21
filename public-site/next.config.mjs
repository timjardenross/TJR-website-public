/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    return [
      { source: '/about-me', destination: '/about', permanent: true },
      { source: '/tjrs-blog', destination: '/library', permanent: true },
      { source: '/what-is-coaching', destination: '/about', permanent: true },
      { source: '/book-a-call', destination: '/get-involved', permanent: true },
      { source: '/approach', destination: '/about', permanent: true },
      { source: '/lets-chat', destination: '/get-involved', permanent: true },
      // Understand Pain page removed for now; temporary so it can return.
      { source: '/pain/understand', destination: '/pain/care', permanent: false },
      { source: '/blog', destination: '/library', permanent: true },
      { source: '/guides', destination: '/library', permanent: true },
      { source: '/revs-articles', destination: '/library', permanent: true },
      { source: '/operational-resilience-insights', destination: '/library', permanent: true },
      { source: '/resources', destination: '/library', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/pain/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }],
      },
      {
        source: '/robots.txt',
        headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }],
      },
    ];
  },
};

export default nextConfig;

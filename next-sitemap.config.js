/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.oneclass.yoga',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  // This ensures your dynamic pages (like teacher profiles) are crawled
  generateIndexSitemap: false, 
  exclude: [
    '/dashboard',
    '/dashboard/*',
    '/auth/*',
    '/login',
    '/api/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/auth', '/api'],
      },
    ],
  },
};
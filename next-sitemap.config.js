/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.oneclass.yoga',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    '/dashboard',      // exact route
    '/dashboard/*',    // all nested routes inside dashboard
    '/auth/*',
  '/login',
  '/api/*',
    '/api/*',          
  ],
};

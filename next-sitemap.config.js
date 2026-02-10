/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.oneclass.yoga',
  generateRobotsTxt: true,
  exclude: ['/dashboard', '/dashboard/*', '/auth/*', '/login', '/api/*'],
  
  // The transform function runs for every page found during the build
  transform: async (config, path) => {
    // 1. Remove the existing locale prefix from the path to get the "raw" route
    // Example: "/en/teachers/jane" becomes "/teachers/jane"
    const rawPath = path.replace(/^\/(en|zh)/, '') || '';

    return {
      loc: path, // The current page being processed
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
      // 2. Dynamically create the alternate language links for this specific path
      alternateRefs: [
        {
          href: `${config.siteUrl}/en${rawPath}`,
          hreflang: 'en',
        },
        {
          href: `${config.siteUrl}/zh${rawPath}`,
          hreflang: 'zh',
        },
        {
          href: `${config.siteUrl}/en${rawPath}`, // Default to English
          hreflang: 'x-default',
        },
      ],
    };
  },
};
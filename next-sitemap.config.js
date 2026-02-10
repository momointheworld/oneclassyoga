/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.oneclass.yoga',
  generateRobotsTxt: true,
  exclude: ['/dashboard', '/dashboard/*', '/community/*', '/auth/*', '/login', '/api/*'],
  
  transform: async (config, path) => {
    // 1. Identify if the path already has a locale or is a base path
    // This helps prevent double-prefixing like /en/en/about
    const localeMatch = path.match(/^\/(en|zh)/);
    const rawPath = localeMatch ? path.replace(/^\/(en|zh)/, '') : path;

    return {
      loc: path, 
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
      // 2. This creates the localized alternates for Google
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
          href: `${config.siteUrl}/en${rawPath}`,
          hreflang: 'x-default',
        },
      ],
    };
  },
};
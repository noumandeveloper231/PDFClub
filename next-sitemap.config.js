/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://pdfclub.online',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.8,
  exclude: ['/api/*', '/temp/*', '/uploads/*', '/downloads/*'],
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/temp/', '/uploads/', '/downloads/'],
      },
    ],
  },
  transform: async (config, path) => {
    const customPriorities = {
      '/': 1.0,
      '/merge': 0.9,
      '/split': 0.9,
      '/compress': 0.9,
      '/about': 0.7,
      '/privacy-policy': 0.7,
      '/terms-of-service': 0.7,
      '/settings': 0.5,
    };

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: customPriorities[path] || config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};

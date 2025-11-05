/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://pdfclub.online',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.8,
  exclude: ['/api/*', '/temp/*', '/uploads/*', '/downloads/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/temp/', '/uploads/', '/downloads/'],
      },
    ],
    additionalSitemaps: [
      'https://pdfclub.online/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom priority for different pages
    const customPriorities = {
      '/': 1.0,
      '/tools/convert': 0.9,
      '/tools/compress': 0.9,
      '/tools/merge': 0.9,
      '/tools/split': 0.9,
      '/about': 0.7,
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

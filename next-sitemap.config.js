/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://freshcoffee.kz',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    changefreq: 'weekly',
    priority: 0.7,
    exclude: ['/api/*', '/account/*', '/admin/*', '/checkout'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/account/', '/admin/', '/checkout'],
            },
        ],
        additionalSitemaps: [],
    },
    transform: async (config, path) => {
        // Higher priority for main pages
        let priority = config.priority;
        let changefreq = config.changefreq;

        if (path === '/') {
            priority = 1.0;
            changefreq = 'daily';
        } else if (path === '/shop') {
            priority = 0.9;
            changefreq = 'daily';
        } else if (path.startsWith('/product/')) {
            priority = 0.8;
            changefreq = 'weekly';
        } else if (path === '/about' || path === '/contacts') {
            priority = 0.6;
            changefreq = 'monthly';
        }

        return {
            loc: path,
            changefreq,
            priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
            alternateRefs: [],
        };
    },
};

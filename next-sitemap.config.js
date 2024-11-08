/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://aiwebsitebuilder.tech',
    generateRobotsTxt: true,
    exclude: [
        '/404',
        '/500',
        '/api/*',
        '/dashboard/*',
        '/protected/*',
        '/login/*',
        '/signup/*',
    ],
    robotsTxtOptions: {
        additionalSitemaps: [],
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/*',
                    '/dashboard/*',
                    '/protected/*',
                    '/login/*',
                    '/signup/*',
                ],
            },
        ],
    },
    changefreq: 'daily',
    priority: 0.7,
    generateIndexSitemap: false, // Since your site is small, we don't need an index
}
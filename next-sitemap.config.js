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
        '/opengraph-image.png',
        '/twitter-image.png',
        '*/opengraph-image.png',
        '*/twitter-image.png',
    ],
    robotsTxtOptions: {
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
    generateIndexSitemap: false,
    sitemapSize: 5000,
}
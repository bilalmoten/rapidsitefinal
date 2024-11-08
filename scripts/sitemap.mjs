import { writeFileSync } from 'fs';
import { globby } from 'globby';

const domain = 'https://aiwebsitebuilder.tech';

async function generateSitemap() {
    // Get all routes
    const pages = await globby([
        'app/**/page.tsx',
        // Exclude routes we don't want in sitemap
        '!app/404/**',
        '!app/500/**',
        '!app/not-found/**',
        '!app/api/**',
        '!app/dashboard/**', // Exclude dashboard pages
        '!app/protected/**',
        '!app/**/[**]/**',   // Exclude dynamic routes
    ]);

    // Transform pages into sitemap format
    const sitemapEntries = pages
        .map((page) => {
            // Convert file path to public URL
            const path = page
                .replace('app', '')
                .replace('/page.tsx', '')
                .replace(/\/+/g, '/');

            return `
    <url>
        <loc>${domain}${path}</loc>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
    </url>`;
        })
        .join('');

    // Create sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${domain}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>${sitemapEntries}
</urlset>`;

    // Write sitemap to public directory
    writeFileSync('public/sitemap.xml', sitemap);
    console.log('Sitemap generated successfully!');
}

// Run the generator
(async () => {
    await generateSitemap();
})();
const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            }, {
                protocol: 'https',
                hostname: '*.supabase.co',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: '*.cloudfront.net',
                pathname: '**',
            }
        ],
    },
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

module.exports = withMDX(nextConfig);

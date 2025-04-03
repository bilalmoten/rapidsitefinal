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
    // Set the API timeout to 10 minutes (600 seconds) for long-running serverless functions
    experimental: {
        serverActionsTimeout: 3600, // in seconds (10 minutes)
        serverComponentsTimeout: 3600, // in seconds (10 minutes)
    },
};

module.exports = withMDX(nextConfig);

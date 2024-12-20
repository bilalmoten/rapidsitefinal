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
};

module.exports = nextConfig;

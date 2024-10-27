/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['d1csarkz8obe9u.cloudfront.net'],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
};

module.exports = nextConfig;

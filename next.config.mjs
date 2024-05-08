/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "merry-platypus-550.convex.cloud",
            },
            {
                hostname: "images.placeholders.dev",
            },
            {
                hostname: "vaultnet.s3.eu-central-2.amazonaws.com",
            },
        ],
    },
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        
        return config;
    }
};

export default nextConfig;

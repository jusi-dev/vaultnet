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
};

export default nextConfig;
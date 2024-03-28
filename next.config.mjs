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
        ],
    },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.NODE_ENV === "production" ? "/Headout-Assignment" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/Headout-Assignment/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {domains:["cdn.dummyjson.com"],},
    reactStrictMode: true,
    experimental: {
      appDir: true,  // Asegura que el App Router está habilitado
    },
};

export default nextConfig;

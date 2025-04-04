

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      appDir: false, // Disable App Router if you want to use Pages Router
    },
    pageExtensions: ["js", "jsx", "ts", "tsx"],
  };
  
  export default nextConfig;  

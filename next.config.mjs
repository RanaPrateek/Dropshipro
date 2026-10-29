/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      // Serve /uploads/<file> via the media route handler so runtime-uploaded
      // images are available immediately (public/ static serving caches at boot).
      beforeFiles: [{ source: "/uploads/:name", destination: "/api/media/:name" }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;

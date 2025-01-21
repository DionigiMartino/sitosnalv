/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/docs/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  output: "standalone",
  // Aggiungiamo il rewrite per /iscrizione
  async rewrites() {
    return [
      {
        source: "/iscrizione",
        destination: "https://188.34.156.42/iscrizione",
      },
    ];
  },
};

module.exports = nextConfig;

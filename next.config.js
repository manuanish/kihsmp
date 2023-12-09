/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:5328/api/:path*"
            : "http://127.0.0.1:5328/api/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      // Allow "https://mineskin.eu/helm/" + player + "/100.png"
      {
        protocol: "https",
        hostname: "mineskin.eu",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;

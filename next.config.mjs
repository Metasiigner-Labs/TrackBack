/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bioguide.congress.gov",
        pathname: "/photo/**",
      },
      {
        protocol: "https",
        hostname: "www.govtrack.us",
        pathname: "/static/legislator-photos/**",
      },
    ],
  },
};

export default nextConfig;
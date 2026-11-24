import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // The app opens straight into the demo account; old sign-in links go to the app
  async redirects() {
    return ['/sign-in', '/sign-up'].map((source) => ({ source, destination: '/', permanent: false }));
  },
};

export default nextConfig;

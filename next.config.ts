import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  // GitHub Pages 경로 설정 (repo-name을 실제 저장소 이름으로 변경)
  basePath: process.env.NODE_ENV === 'production' ? '/tux31337.github.io' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/tux31337.github.io' : '',
};

export default nextConfig;

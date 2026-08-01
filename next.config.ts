import type { NextConfig } from "next";

// Publicado no GitHub Pages: export estático servido em /strung.
// O basePath vem do build do Actions; localmente fica vazio.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

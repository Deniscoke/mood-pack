import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Koreň projektu natvrdo, nech Next nezmätie zatúlaný lockfile inde v počítači.
  turbopack: { root: __dirname },
};

export default nextConfig;

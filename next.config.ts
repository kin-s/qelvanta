import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  serverExternalPackages: [
    "@aws-sdk/client-s3", 
    "openai", 
    "resend", 
    "@prisma/client",
    "bcrypt-ts"
  ],
};

export default nextConfig;
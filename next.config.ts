import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone" as const,
  experimental: {
    serverActions: {
      bodySizeLimit: 50 * 1024 * 1024,
    },
    proxyClientMaxBodySize: 50 * 1024 * 1024,
  },
};

export default withNextIntl(nextConfig);

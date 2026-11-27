import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        // the Markdown version of an article, like /billing/utility-bills.md
        source: '/:path*.md',
        destination: '/llms.mdx/:path*.md',
      },
    ];
  },
};

export default withMDX(config);

import { llms, loader, type LoaderPlugin } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsRoute, siteUrl } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { createElement, Fragment } from 'react';
import { z } from 'zod';
import { getMDXComponents } from '@/components/mdx';
import { SoonBadge } from '@/components/coming-soon';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      /** A short label for the sidebar, so it fits on one line. Everywhere else shows the full title. */
      sidebarTitle: z.string().optional(),
      /** The guide isn't written yet: its name gets a "Soon" badge in the sidebar and on the home page. */
      comingSoon: z.boolean().default(false),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

/**
 * The sidebar label of each page: its `sidebarTitle` when it has one, and the "Soon" badge for
 * `comingSoon` pages. The home page and the previous/next links show full titles (`PageTitle`).
 */
function sidebarLabelPlugin(): LoaderPlugin {
  return {
    name: 'leaseting:sidebar-label',
    transformPageTree: {
      file(node, filePath) {
        const file = filePath ? this.storage.read(filePath) : undefined;
        if (file?.format !== 'page') return node;
        const { sidebarTitle, comingSoon } = file.data as { sidebarTitle?: string; comingSoon?: boolean };
        const label = sidebarTitle ?? node.name;
        const name = comingSoon ? createElement(Fragment, null, label, ' ', createElement(SoonBadge)) : label;
        return { ...node, name };
      },
    },
  };
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin(), sidebarLabelPlugin()],
});

/**
 * `/llms.txt` lists every article by category, `<article>.md` is one article as Markdown and
 * `/llms-full.txt` is all of them. All are generated from the MDX, so new articles appear on their own.
 */
export const docsLlms = llms(source, {
  renderUrl: (item) => new URL(item.url, siteUrl).href,
  renderPage: async (page) => {
    const url = new URL(page.url, siteUrl).href;
    const body = await page.data.getText('processed', { components: getMDXComponents() });
    return `# ${page.data.title}

URL: ${url}

${page.data.description ? `> ${page.data.description}\n\n` : ''}${body}`;
  },
});

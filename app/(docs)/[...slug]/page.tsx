import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getPageImageUrl } from '@/lib/shared';
import { findNeighbour } from 'fumadocs-core/page-tree';
import type * as PageTree from 'fumadocs-core/page-tree';
import { PageTitle } from '@/components/page-title';

// Only the articles exist under the site root, every other path is a 404.
export const dynamicParams = false;

export default async function Page(props: PageProps<'/[...slug]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = `${page.url}.md`;
  const neighbours = findNeighbour(source.getPageTree(), page.url);

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      // full titles, as the page tree holds the short sidebar labels
      footer={{ items: { previous: footerItem(neighbours.previous), next: footerItem(neighbours.next) } }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl} />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

function footerItem(node: PageTree.Item | undefined) {
  if (!node) return undefined;
  const page = source.getNodePage(node);
  return {
    name: page ? <PageTitle page={page} /> : node.name,
    description: node.description,
    url: node.url,
  };
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/[...slug]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: page.url,
      types: { 'text/markdown': `${page.url}.md` },
    },
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}

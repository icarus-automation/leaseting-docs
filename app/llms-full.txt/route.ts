import { flattenTree } from 'fumadocs-core/page-tree';
import { docsLlms, source } from '@/lib/source';

export const revalidate = false;

/** Every article as Markdown, in sidebar order (the default follows file names). */
export async function GET() {
  const pages = flattenTree(source.getPageTree().children).flatMap(
    (node) => source.getNodePage(node) ?? [],
  );
  const text = (await Promise.all(pages.map((page) => docsLlms.page(page)))).join('\n\n');

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

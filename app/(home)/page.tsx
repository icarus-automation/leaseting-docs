import { Card, Cards } from 'fumadocs-ui/components/card';
import type * as PageTree from 'fumadocs-core/page-tree';
import { source } from '@/lib/source';
import { PageTitle } from '@/components/page-title';

/** The articles of each category, in sidebar order, so a new article shows up here on its own. */
function categories() {
  return source
    .getPageTree()
    .children.filter((node): node is PageTree.Folder => node.type === 'folder')
    .map((folder) => ({
      folder,
      pages: folder.children.flatMap((node) =>
        node.type === 'page' ? { node, page: source.getNodePage(node) } : [],
      ),
    }));
}

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-(--fd-layout-width) flex-1 flex-col gap-10 px-4 py-12 md:px-6 md:py-16">
      <div className="flex max-w-2xl flex-col gap-3">
        <h1 className="text-3xl font-semibold">Leaseting Docs</h1>
        <p className="text-fd-muted-foreground">
          Step-by-step guides for property managers and staff. Pick a topic below, or search
          for what you need.
        </p>
      </div>

      {categories().map(({ folder, pages }) => (
        <section key={folder.$id ?? String(folder.name)} className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">{folder.name}</h2>
          <Cards>
            {pages.map(({ node, page }) => (
              <Card
                key={node.url}
                href={node.url}
                icon={node.icon}
                title={page ? <PageTitle page={page} /> : node.name}
                description={node.description}
              />
            ))}
          </Cards>
        </section>
      ))}
    </main>
  );
}

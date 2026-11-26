# leaseting-docs

The Leaseting help site, published at https://docs.leaseting.com. Built with
[Fumadocs](https://fumadocs.dev) on Next.js, ready to deploy on Vercel.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm types:check  # Next typegen + TypeScript
pnpm build
```

## Adding an article

Articles are MDX files in `content/docs/<category>/`. A category is a folder with a `meta.json`
(its title, description and sidebar icon). The file path is the URL, so
`content/docs/billing/utility-bills.mdx` is served at `/billing/utility-bills`.

Every article needs a `title` and a one-line `description` in its frontmatter. The description shows
under the title, on the home page and in `/llms.txt`. The order of categories is set by `pages` in
`content/docs/meta.json`. When the title is too long for one line in the sidebar, add a short
`sidebarTitle`; everywhere else keeps the full title.

A guide that isn't written yet gets `comingSoon: true` in its frontmatter, which adds a "Soon" badge
beside it in the sidebar and on the home page. Its page says so too, with a "Coming soon" callout.
Remove both when the guide is written.

Give each section heading a fixed ID so links to it keep working when the wording changes:

```mdx
## How meter readings carry over [#readings]
```

Use `<Steps>`/`<Step>` for procedures, `<Callout>` for tips and warnings, and
`<Accordions>`/`<Accordion id="...">` for FAQs. These are defined in `components/mdx.tsx`, which
also gives each one a plain Markdown form for the files below.

## For AI agents

Generated at build time from the same MDX, so new articles appear without manual edits:

| Path                       | What it is                                               |
| -------------------------- | -------------------------------------------------------- |
| `/llms.txt`                | Every article by category: title, URL and description    |
| `/<article>.md`            | One article as clean Markdown, FAQ answers in full       |
| `/llms-full.txt`           | Every article in one file                                |

A request for an article with `Accept: text/markdown` also gets the Markdown version (`proxy.ts`).

## Layout

| Path                    | What it is                                         |
| ----------------------- | -------------------------------------------------- |
| `app/(home)`            | The home page, listing articles by category        |
| `app/(docs)/[...slug]`  | Article pages, at the site root                    |
| `app/api/search`        | Search (Fumadocs default, built from the articles) |
| `app/llms.*`            | The files for agents above                         |
| `lib/source.ts`         | The content source and the `llms.txt` setup        |
| `lib/shared.ts`         | Site name and URL                                  |

import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred } from 'fumadocs-core/negotiation';

/**
 * Agents that ask for Markdown (`Accept: text/markdown`) on an article URL get its `.md` version.
 * Paths that aren't articles fall through to a 404 from the Markdown route.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isMarkdownPreferred(request)) {
    // `<article>.md` is served by the rewrite in next.config.mjs
    return NextResponse.rewrite(new URL(`${pathname}.md`, request.nextUrl), {
      // this URL has two representations, selected by `Accept`
      headers: { Vary: 'Accept' },
    });
  }

  return NextResponse.next();
}

export const config = {
  // articles only: not the home page, files with an extension, or the app's own routes
  matcher: ['/((?!api/|og/|llms\\.mdx/|_next/)[^.]+)'],
};

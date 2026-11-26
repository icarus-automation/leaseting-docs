import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Leaseting Docs';
export const siteUrl = 'https://docs.leaseting.com';
/** Articles live at the site root, like `/billing/utility-bills`. */
export const docsRoute = '/';
export const docsImageRoute = '/og/docs';

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}

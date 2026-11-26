import type { InferPageType } from 'fumadocs-core/source';
import type { source } from '@/lib/source';
import { SoonBadge } from './coming-soon';

/** A page's full title, with the "Soon" badge when the guide isn't written yet. */
export function PageTitle({ page }: { page: InferPageType<typeof source> }) {
  return (
    <>
      {page.data.title}
      {page.data.comingSoon ? (
        <>
          {' '}
          <SoonBadge />
        </>
      ) : null}
    </>
  );
}

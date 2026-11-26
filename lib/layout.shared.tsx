import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import logo from '@/public/brand/leaseting-lockup.png';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          {/* the blue lockup from the web app, turned white on the dark theme */}
          <Image
            src={logo}
            alt="Leaseting"
            priority
            className="h-7 w-auto dark:brightness-0 dark:invert"
          />
          <span className="text-fd-muted-foreground">Docs</span>
        </>
      ),
      url: '/',
    },
  };
}

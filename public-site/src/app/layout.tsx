import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PainProfileProvider } from '@/components/pain/PainProfileProvider';
import { site, absoluteUrl } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  alternates: {
    types: {
      'application/rss+xml': absoluteUrl('/library/rss.xml'),
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <PainProfileProvider>
          <main id="main-content" className="flex-1">{children}</main>
        </PainProfileProvider>
        <SiteFooter />
      </body>
    </html>
  );
}

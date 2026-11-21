import Link from 'next/link';
import { site } from '@/lib/site';
import { footerLinks } from '@/lib/nav';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-ink-light">
        <p className="mb-4 text-ink-mid">
          Chronic pain awareness, self-advocacy, and practical tools for being heard.
        </p>
        <p className="mb-4 text-sm leading-6 text-ink-mid">
          TJR Mind &amp; Body offers awareness and self-advocacy information from lived experience. It does not provide
          medical advice, diagnosis, or treatment, and it does not claim to cure or treat any condition.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {site.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-teal">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

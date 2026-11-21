import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ctaLink, footerLinks, navLinks } from '../nav';

const root = path.resolve(__dirname, '../../..');

function knownRoutes(): Set<string> {
  const routes = new Set<string>(['/', '/library/rss.xml', '/sitemap.xml']);
  const walk = (dir: string, prefix: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (/^[[(]/.test(entry.name) || entry.name === 'api') continue;
      const route = `${prefix}/${entry.name}`;
      if (existsSync(path.join(dir, entry.name, 'page.tsx'))) routes.add(route);
      walk(path.join(dir, entry.name), route);
    }
  };
  walk(path.join(root, 'src/app'), '');
  for (const file of readdirSync(path.join(root, 'content/pages'))) {
    if (file.endsWith('.md')) routes.add(`/${file.replace(/\.md$/, '')}`);
  }
  return routes;
}

const allLinks = [...navLinks, ctaLink, ...footerLinks];

describe('navigation', () => {
  it('nav, cta and footer hrefs all resolve to an existing route', () => {
    const routes = knownRoutes();
    for (const link of allLinks) {
      expect(routes.has(link.href), `${link.label} -> ${link.href}`).toBe(true);
    }
  });

  it('has no coaching language in any label', () => {
    for (const link of allLinks) {
      expect(link.label).not.toMatch(/coach/i);
    }
  });

  it('keeps the pain pathway in the primary nav', () => {
    expect(navLinks.some((link) => link.href === '/pain/understand')).toBe(true);
  });
});

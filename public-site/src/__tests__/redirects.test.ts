import { describe, expect, it } from 'vitest';
import nextConfig from '../../next.config.mjs';

type Rule = { source: string; destination: string; permanent: boolean };

async function redirectTable() {
  const rules = (await nextConfig.redirects!()) as unknown as Rule[];
  return new Map<string, Rule>(rules.map((rule) => [rule.source, rule]));
}

describe('redirects', () => {
  it('redirects retired coaching URLs to live pages', async () => {
    const table = await redirectTable();
    const expected: Record<string, string> = {
      '/approach': '/about',
      '/lets-chat': '/get-involved',
      '/what-is-coaching': '/about',
      '/book-a-call': '/get-involved',
    };
    for (const [source, destination] of Object.entries(expected)) {
      expect(table.get(source), source).toMatchObject({ destination, permanent: true });
    }
  });

  it('no redirect destination is a retired route', async () => {
    const table = await redirectTable();
    for (const rule of table.values()) {
      expect(['/coaching', '/approach', '/lets-chat']).not.toContain(rule.destination);
    }
  });
});

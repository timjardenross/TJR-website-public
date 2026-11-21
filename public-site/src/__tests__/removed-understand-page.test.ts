import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import sitemap from '../app/sitemap';

const root = path.resolve(__dirname, '../..');

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (name === '__tests__' || name === 'node_modules') return [];
    return statSync(full).isDirectory() ? files(full) : [full];
  });
}

describe('Understand Pain page removal', () => {
  it('the route no longer exists', () => {
    expect(existsSync(path.join(root, 'src/app/pain/understand'))).toBe(false);
  });

  it('nothing in the site source or content links to /pain/understand', () => {
    const offenders = [...files(path.join(root, 'src')), ...files(path.join(root, 'content'))].filter((file) =>
      readFileSync(file, 'utf8').includes('/pain/understand'),
    );
    expect(offenders.map((file) => path.relative(root, file))).toEqual([]);
  });

  it('the sitemap no longer lists it', () => {
    expect(sitemap().some((entry) => entry.url.endsWith('/pain/understand'))).toBe(false);
  });
});

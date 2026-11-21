import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import nextConfig from '../../next.config.mjs';
import { collections } from '../lib/collections';

const root = path.resolve(__dirname, '../..'); // public-site/
const repoRoot = path.resolve(root, '..');
const read = (file: string) => readFileSync(path.join(root, file), 'utf8');

const docFiles = [
  ...readdirSync(path.join(root, 'docs'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(root, 'docs', f)),
  path.join(root, 'README.md'),
  path.join(repoRoot, 'README.md'),
  path.join(root, 'package.json'),
  path.join(root, '.env.example'),
];

describe('old Sveltia editor and its GitHub login are retired', () => {
  it('the static editor folder is gone', () => {
    expect(existsSync(path.join(root, 'public/admin'))).toBe(false);
  });

  it('the GitHub OAuth login route is gone', () => {
    expect(existsSync(path.join(root, 'src/app/api/auth'))).toBe(false);
  });

  it('no /admin rewrite remains in next.config', async () => {
    const rewrites = nextConfig.rewrites ? await nextConfig.rewrites() : [];
    expect(JSON.stringify(rewrites)).not.toContain('/admin');
  });

  it('the example env file no longer asks for CMS or OAuth settings', () => {
    const env = read('.env.example');
    expect(env).not.toMatch(/GITHUB_OAUTH|NEXT_PUBLIC_CMS/);
  });

  it.each(docFiles.map((f) => [path.relative(repoRoot, f), f]))(
    '%s no longer describes the old editor or login',
    (_name, file) => {
      const text = readFileSync(file as string, 'utf8');
      expect(text).not.toMatch(/sveltia/i);
      expect(text).not.toMatch(/GITHUB_OAUTH|NEXT_PUBLIC_CMS|api\/auth|public\/admin|site-url>\/admin|localhost:3200\/admin/);
    },
  );
});

describe('docs describe Pages CMS and the branch-then-pull-request routine', () => {
  it('CMS-SETUP covers Pages CMS, the config file and permissions', () => {
    const doc = read('docs/CMS-SETUP.md');
    expect(doc).toContain('Pages CMS');
    expect(doc).toContain('.pages.yml');
    expect(doc).toMatch(/permission/i);
  });

  it('PUBLISHING-GUIDE says posts are saved to a branch and merged by pull request, not committed to main', () => {
    const doc = read('docs/PUBLISHING-GUIDE.md');
    expect(doc).toMatch(/branch/i);
    expect(doc).toMatch(/pull request/i);
    expect(doc).not.toMatch(/commits? directly to the `main`/i);
  });

  it('DISASTER-RECOVERY explains how to cut off Pages CMS access', () => {
    expect(read('docs/DISASTER-RECOVERY.md')).toMatch(/Pages CMS/);
  });
});

describe('Library page text and highlights', () => {
  const library = collections.find((c) => c.key === 'library');

  it('no longer uses the old REVS description', () => {
    expect(library?.description).not.toMatch(/REVS/i);
    expect(library?.description).toMatch(/persistent pain/i);
  });

  it('hides the old Instagram "Human Resilience" highlight', () => {
    const file = read('content/instagram-highlights/human-resilience.md');
    expect(matter(file).data.active).toBe(false);
  });
});

describe('Pages CMS config header', () => {
  it('no longer calls itself a trial', () => {
    expect(readFileSync(path.join(repoRoot, '.pages.yml'), 'utf8')).not.toMatch(/TRIAL/);
  });
});

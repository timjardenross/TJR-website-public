import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

// Repo root (this file is public-site/src/lib/__tests__).
const repoRoot = path.resolve(__dirname, '../../../..');
const configPath = path.join(repoRoot, '.pages.yml');

type Field = { name: string; type: string; required?: boolean; options?: Record<string, unknown>; list?: boolean };
type Config = {
  media?: { input: string; output: string };
  settings?: { content?: { merge?: boolean } };
  content?: { name: string; type: string; path: string; format?: string; fields: Field[] }[];
};

function load(): Config {
  // gray-matter already ships a YAML parser, so no new dependency is needed.
  return matter(`---\n${readFileSync(configPath, 'utf8')}\n---`).data as Config;
}

describe('Pages CMS trial config (.pages.yml)', () => {
  it('exists at the repo root and parses', () => {
    expect(existsSync(configPath)).toBe(true);
    expect(load().content?.length).toBeGreaterThan(0);
  });

  const posts = () => load().content?.find((c) => c.name === 'posts');

  it('edits the Library folder, where blog posts already live', () => {
    const collection = posts();
    expect(collection?.type).toBe('collection');
    expect(collection?.path).toBe('public-site/content/library');
    expect(existsSync(path.join(repoRoot, collection?.path ?? 'missing'))).toBe(true);
  });

  it('covers the frontmatter the site requires (title, date, excerpt) and marks them required', () => {
    const fields = posts()?.fields ?? [];
    for (const name of ['title', 'date', 'excerpt']) {
      const field = fields.find((f) => f.name === name);
      expect(field, name).toBeDefined();
      expect(field?.required, `${name} required`).toBe(true);
    }
  });

  it('writes dates as yyyy-MM-dd, matching existing posts', () => {
    const date = posts()?.fields.find((f) => f.name === 'date');
    expect(date?.type).toBe('date');
    expect(date?.options?.format).toBe('yyyy-MM-dd');
  });

  it('defaults new posts to draft so nothing publishes by accident', () => {
    const draft = posts()?.fields.find((f) => f.name === 'draft') as (Field & { default?: unknown }) | undefined;
    expect(draft?.type).toBe('boolean');
    expect(draft?.default).toBe(true);
  });

  it('uses the rich-text editor for the post body', () => {
    const body = posts()?.fields.find((f) => f.name === 'body');
    expect(body?.type).toBe('rich-text');
  });

  it('keeps the post form short (the old one had about twenty fields)', () => {
    expect(posts()?.fields.length).toBeLessThanOrEqual(12);
  });

  it('keeps fields it does not show instead of deleting them on save', () => {
    expect(load().settings?.content?.merge).toBe(true);
  });

  it('stores uploads where the site already serves them', () => {
    const media = load().media;
    expect(media?.input).toBe('public-site/public/uploads');
    expect(media?.output).toBe('/uploads');
  });

  it('shows no coaching or REVS jargon in the editor (comments are not checked)', () => {
    expect(JSON.stringify(load())).not.toMatch(/\bcoach|REVS\b/i);
  });
});

import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(__dirname, '../..');

describe('route and content collisions', () => {
  it('no standalone page markdown shadows a code-owned route', () => {
    const routeDirs = readdirSync(path.join(root, 'src/app'), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && existsSync(path.join(root, 'src/app', entry.name, 'page.tsx')))
      .map((entry) => entry.name);
    const shadowed = routeDirs.filter((name) => existsSync(path.join(root, 'content/pages', `${name}.md`)));
    expect(shadowed).toEqual([]);
  });
});

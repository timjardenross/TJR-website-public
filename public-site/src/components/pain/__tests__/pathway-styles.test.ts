import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('pathway rail styles', () => {
  it('visibly marks the current step, not only for screen readers', () => {
    const css = readFileSync(path.resolve(__dirname, '../../../app/globals.css'), 'utf8');
    expect(css).toMatch(/\.pain-rail nav a\.current\s*\{[^}]*font-weight/);
  });
});

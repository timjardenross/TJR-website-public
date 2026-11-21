import { execSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

describe('repository hygiene', () => {
  it('does not track TypeScript build artefacts', () => {
    const tracked = execSync('git ls-files', { encoding: 'utf8' }).split('\n');
    expect(tracked.filter((file) => file.endsWith('.tsbuildinfo'))).toEqual([]);
  });
});

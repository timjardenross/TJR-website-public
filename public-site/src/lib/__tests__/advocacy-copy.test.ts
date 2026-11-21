import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(__dirname, '../../..');

// Files whose public copy must follow the advocacy positioning.
export const guardedFiles = [
  'src/app/get-involved/page.tsx',
  'content/pages/get-involved.md',
  'src/components/ContactForm.tsx',
  'src/components/LeadMagnetForm.tsx',
  'src/components/SiteHeader.tsx',
  'src/components/SiteFooter.tsx',
  'src/lib/nav.ts',
];

const allowedDisclaimer = /does not claim to cure or treat any condition/gi;

function read(file: string): string {
  return readFileSync(path.join(root, file), 'utf8');
}

describe('advocacy copy guard', () => {
  it.each(guardedFiles)('%s contains no coaching language', (file) => {
    expect(read(file)).not.toMatch(/\bcoach/i);
  });

  it.each(guardedFiles)('%s contains no cure or treatment promises', (file) => {
    const text = read(file).replace(allowedDisclaimer, '');
    expect(text).not.toMatch(/\b(cure|heal your|guarantee)/i);
  });

  it('contact form offers no coaching inquiry and defaults to share-experience', () => {
    const form = read('src/components/ContactForm.tsx');
    expect(form).not.toContain('value="coaching"');
    expect(form).toContain('value="share-experience"');
    expect(form).toContain("useState('share-experience')");
  });

  it('names no hospital or clinician in page content', () => {
    expect(read('content/pages/get-involved.md')).not.toMatch(/hospital|clinic|\bDr\.? /i);
  });
});

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(__dirname, '../../..');
const read = (slug: string) => readFileSync(path.join(root, 'content/pages', `${slug}.md`), 'utf8');

// The only external links the Speak Up / Take Action pages may contain.
// Each was checked on 21 Nov 2026 (see docs/superpowers/plans/2026-11-21-advocacy-phases-3-4-*.md).
const ALLOWED_EXTERNAL = new Set([
  'https://www.safetyandquality.gov.au/supporting-your-health-care/ask-share-know',
  'https://www.safetyandquality.gov.au/your-rights/understanding-your-healthcare-rights',
  'https://www.healthdirect.gov.au/questions-to-ask-your-doctor',
  'https://www.aph.gov.au/Senators_and_Members/Parliamentarian_Search_Results',
  'https://consultations.health.gov.au/',
  'https://www.health.gov.au/resources/publications/the-national-strategic-action-plan-for-pain-management',
  'https://www.painaustralia.org.au/',
  'https://www.painaustralia.org.au/media/mr-2026/the-pain-you-cant-see',
]);
const RELEASE = 'https://www.painaustralia.org.au/media/mr-2026/the-pain-you-cant-see';

const externalLinks = (text: string) => [...text.matchAll(/https?:\/\/[^\s)>\]]+/g)].map((m) => m[0]);
const internalLinks = (text: string) =>
  [...text.matchAll(/\]\((\/[^)\s#]*)(?:#[^)]*)?\)/g)].map((m) => m[1]);

function knownRoutes(): Set<string> {
  const routes = new Set<string>(['/', '/library/rss.xml', '/sitemap.xml']);
  const walk = (dir: string, prefix: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || /^[[(]/.test(entry.name) || entry.name === 'api') continue;
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

const medicineAdvice =
  /\b(stop|start|increase|reduce)\s+(taking\s+)?(your\s+)?(medication|medicine|opioids?)\b/i;

// Checks every advocacy page must pass.
function commonChecks(slug: string) {
  describe(`${slug} (common)`, () => {
    const page = read(slug);
    it('has a title and a meta description', () => {
      expect(page).toMatch(/^---\ntitle: ".+"/);
      expect(page).toMatch(/\n\s+description: ".+"/);
    });
    it('links only to verified external sources', () => {
      for (const url of externalLinks(page)) expect(ALLOWED_EXTERNAL.has(url), url).toBe(true);
    });
    it('links only to routes that exist', () => {
      const routes = knownRoutes();
      for (const href of internalLinks(page)) expect(routes.has(href), href).toBe(true);
    });
    it('has no coaching language, cure promises or medicine-change advice', () => {
      expect(page).not.toMatch(/\bcoach/i);
      expect(page).not.toMatch(/\b(cure|guarantee)/i);
      expect(page).not.toMatch(medicineAdvice);
    });
  });
}

describe('medicine-advice guard (self-test)', () => {
  it.each(['stop taking your medication', 'increase your opioids', 'start your medicine'])('flags %s', (t) => {
    expect(medicineAdvice.test(t)).toBe(true);
  });
  it('does not flag asking about medicines', () => {
    expect(medicineAdvice.test('ask your doctor about medicines')).toBe(false);
  });
});

const CHARTER_RIGHTS = ['access', 'safety', 'respect', 'partnership', 'information', 'privacy', 'giving feedback'];

// --- Task 1: Speak Up ------------------------------------------------------
commonChecks('speak-up');
commonChecks('how-to-be-heard');

describe('speak-up hub', () => {
  const page = read('speak-up');
  it('links the Pathway tools and the appointment guide', () => {
    for (const href of ['/pain/understand', '/pain/care', '/pain/capacity', '/pain/flare', '/pain/plan', '/how-to-be-heard']) {
      expect(page, href).toContain(`(${href})`);
    }
  });
  it('lists all seven Charter rights and links the Charter', () => {
    for (const right of CHARTER_RIGHTS) expect(page.toLowerCase(), right).toContain(right);
    expect(page).toContain('https://www.safetyandquality.gov.au/your-rights/understanding-your-healthcare-rights');
  });
  it('states the boundary', () => {
    expect(page).toMatch(/GP or another qualified health/i);
  });
});

describe('how-to-be-heard guide', () => {
  const page = read('how-to-be-heard');
  it('uses the three verified Ask Share Know steps and links them', () => {
    expect(page).toContain('Ask questions to help get the information you need');
    expect(page).toContain('Share what matters to you');
    expect(page).toContain('Know your options');
    expect(page).toContain('https://www.safetyandquality.gov.au/supporting-your-health-care/ask-share-know');
  });
  it('covers before, during and after, and the right to give feedback', () => {
    for (const heading of ['## Before', '## In the appointment', '## After']) expect(page).toContain(heading);
    expect(page.toLowerCase()).toContain('giving feedback');
  });
  it('links the story and the Healthdirect questions', () => {
    expect(page).toContain('(/my-story)');
    expect(page).toContain('https://www.healthdirect.gov.au/questions-to-ask-your-doctor');
  });
});

// A `header` selector that starts a rule or follows a comma, i.e. not scoped with `body >`.
const BARE_HEADER = /(^|[,{]\s*)header\s*[,{]/;

describe('bare header guard (self-test)', () => {
  it('flags unscoped header rules', () => {
    expect(BARE_HEADER.test('@media print { header { display:none } }')).toBe(true);
    expect(BARE_HEADER.test('@media print { footer, header { display:none } }')).toBe(true);
  });
  it('allows the scoped selector', () => {
    expect(BARE_HEADER.test('@media print { body > header, body > footer { display:none } }')).toBe(false);
  });
});

describe('print styles', () => {
  const css = readFileSync(path.join(root, 'src/app/globals.css'), 'utf8');
  it('hide only the site header, footer and skip link when printing', () => {
    expect(css).toContain('@media print');
    const print = css.slice(css.indexOf('@media print'));
    for (const selector of ['body > header', 'body > footer', '.skip-link']) expect(print).toContain(selector);
    expect(print).not.toMatch(BARE_HEADER); // a bare `header` rule would hide Pathway page content
  });
});

export { RELEASE, read, externalLinks, internalLinks, knownRoutes, commonChecks, ALLOWED_EXTERNAL };

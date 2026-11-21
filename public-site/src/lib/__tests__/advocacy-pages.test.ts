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
  'https://www.healthdirect.gov.au/healthcare-and-services/general-health/questions-to-ask-your-doctor',
  'https://www.aph.gov.au/Senators_and_Members/Parliamentarian_Search_Results',
  'https://consultations.health.gov.au/',
  'https://www.health.gov.au/resources/publications/the-national-strategic-action-plan-for-pain-management',
  'https://www.painaustralia.org.au/',
  'https://www.painaustralia.org.au/media/mr-2026/the-pain-you-cant-see',
]);
const RELEASE = 'https://www.painaustralia.org.au/media/mr-2026/the-pain-you-cant-see';

// Every link target on a page: markdown links (with or without a title) and raw href attributes.
const linkTargets = (text: string) => [
  ...[...text.matchAll(/\]\(\s*([^)\s]+)/g)].map((m) => m[1]),
  ...[...text.matchAll(/href=["']([^"']+)["']/gi)].map((m) => m[1]),
];

// A line with a figure must carry an allow-listed source link on the same line.
const FIGURE = /\d[\d.,]*\s*(?:million|billion|%|per cent)|\b\d+\s+in\s+\d+\b/i;
const unsourcedFigureLines = (text: string) =>
  text
    .split('\n')
    .filter((line) => FIGURE.test(line))
    .filter((line) => !externalLinks(line).some((url) => ALLOWED_EXTERNAL.has(url)));

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
    it('every link target is an allowed URL or a known route', () => {
      const routes = knownRoutes();
      for (const target of linkTargets(page)) {
        const route = target.split('#')[0];
        const ok = ALLOWED_EXTERNAL.has(target) || (route.startsWith('/') && routes.has(route));
        expect(ok, target).toBe(true);
      }
    });
    it('puts a source link on every line that states a figure', () => {
      expect(unsourcedFigureLines(page)).toEqual([]);
    });
    it('has no coaching language, cure promises or medicine-change advice', () => {
      expect(page).not.toMatch(/\bcoach/i);
      expect(page).not.toMatch(/\b(cure|guarantee)/i);
      expect(page).not.toMatch(medicineAdvice);
    });
  });
}

describe('link and figure guards (self-test)', () => {
  const bad = [
    '[x](www.example.com/a)',
    '[x](HTTPS://evil.example)',
    '[x](mailto:a@b.c)',
    '[x](nope)',
    '<a href="/nope">x</a>',
    '[x](/nope "title")',
  ];
  it.each(bad)('flags link form %s', (text) => {
    const routes = knownRoutes();
    const flagged = linkTargets(text).some((t) => !(ALLOWED_EXTERNAL.has(t) || (t.startsWith('/') && routes.has(t.split('#')[0]))));
    expect(flagged).toBe(true);
  });
  it('allows known routes and allowed URLs', () => {
    const routes = knownRoutes();
    for (const t of linkTargets('[a](/speak-up) [b](https://www.painaustralia.org.au/)')) {
      expect(ALLOWED_EXTERNAL.has(t) || routes.has(t)).toBe(true);
    }
  });
  it.each(['1 in 5 Australians', '4.2 million adults', 'about 30% of people', '3 per cent'])('flags unsourced figure: %s', (t) => {
    expect(unsourcedFigureLines(t).length).toBe(1);
  });
  it('accepts a figure with an allowed source on the same line', () => {
    expect(unsourcedFigureLines('4.2 million adults ([source](https://www.painaustralia.org.au/))')).toEqual([]);
  });
});

describe('medicine-advice guard (self-test)', () => {
  it.each(['stop taking your medication', 'increase your opioids', 'start your medicine'])('flags %s', (t) => {
    expect(medicineAdvice.test(t)).toBe(true);
  });
  it('does not flag asking about medicines', () => {
    expect(medicineAdvice.test('ask your doctor about medicines')).toBe(false);
  });
});

const CHARTER_RIGHTS = ['access', 'safety', 'respect', 'partnership', 'information', 'privacy', 'give feedback'];

// --- Task 1: Speak Up ------------------------------------------------------
commonChecks('speak-up');
commonChecks('how-to-be-heard');

describe('speak-up hub', () => {
  const page = read('speak-up');
  it('links the Pathway tools and the appointment guide', () => {
    for (const href of ['/pain/care', '/pain/capacity', '/pain/flare', '/pain/plan', '/how-to-be-heard']) {
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
    expect(page.toLowerCase()).toContain('give feedback');
  });
  it('links the story and the Healthdirect questions', () => {
    expect(page).toContain('(/my-story)');
    expect(page).toContain('https://www.healthdirect.gov.au/healthcare-and-services/general-health/questions-to-ask-your-doctor');
  });
});

// Every selector in the print block must be one of these. A broader or different selector
// (for example `body header`, `main header`, `*`) could hide Pathway page content.
const PRINT_ALLOWED = new Set(['body > header', 'body > footer', '.skip-link']);
function printSelectors(css: string): string[] {
  const start = css.indexOf('@media print');
  if (start === -1) return [];
  const block = css.slice(start);
  const inner = block.slice(block.indexOf('{') + 1);
  return [...inner.matchAll(/([^{}]+)\{[^}]*\}/g)].flatMap((m) => m[1].split(',').map((sel) => sel.trim())).filter(Boolean);
}
const printIsSafe = (css: string) => {
  const selectors = printSelectors(css);
  return selectors.length > 0 && selectors.every((sel) => PRINT_ALLOWED.has(sel));
};

describe('print guard (self-test)', () => {
  it.each([
    '@media print { body header { display:none } }',
    '@media print { main header { display:none } }',
    '@media print { .x{ color:red } header { display:none } }',
    '@media print { * { display:none } }',
    '@media print { .pain-hero { display:none } }',
  ])('flags %s', (css) => {
    expect(printIsSafe(css)).toBe(false);
  });
  it('allows the scoped selectors', () => {
    expect(printIsSafe('@media print { body > header, body > footer, .skip-link { display:none } }')).toBe(true);
  });
});

describe('print styles', () => {
  const css = readFileSync(path.join(root, 'src/app/globals.css'), 'utf8');
  it('hide only the site header, footer and skip link when printing', () => {
    expect(css).toContain('@media print');
    expect(printIsSafe(css)).toBe(true);
    expect(printSelectors(css).sort()).toEqual([...PRINT_ALLOWED].sort());
  });
});

// --- Task 2: facts and awareness month ---------------------------------------
commonChecks('pain-facts');
commonChecks('pain-awareness-month');

describe('pain-facts page', () => {
  const page = read('pain-facts');
  const factsSection = page.split('## The facts')[1]?.split(/\n## /)[0] ?? '';
  const bullets = factsSection.split('\n').filter((line) => line.startsWith('- '));

  it('is dated and says estimates vary', () => {
    expect(page).toContain('As at November 2026');
    expect(page).toMatch(/Estimates vary/);
  });
  it('states the 4.2 million figure as Painaustralia\'s own', () => {
    expect(page).toContain('4.2 million');
    expect(page).toContain('Painaustralia');
  });
  it('gives every fact a source link to an allowed URL', () => {
    expect(bullets.length).toBeGreaterThanOrEqual(3);
    for (const bullet of bullets) {
      const urls = externalLinks(bullet);
      expect(bullet, bullet).toContain('Source: [');
      expect(urls.length, bullet).toBeGreaterThan(0);
      for (const url of urls) expect(ALLOWED_EXTERNAL.has(url), url).toBe(true);
    }
  });
  it('cites the 31 August 2026 release for the 4.2 million figure', () => {
    const line = bullets.find((b) => b.includes('4.2 million')) ?? '';
    expect(line).toContain(RELEASE);
    expect(line).toContain('31 August 2026');
  });
});

describe('pain-awareness-month page', () => {
  const page = read('pain-awareness-month');
  it('names the 2026 campaign day and links the release', () => {
    expect(page).toContain('1 September');
    expect(page).toContain('2026');
    expect(page).toContain(RELEASE);
  });
  it('hard-codes no date for a future year and says dates change', () => {
    expect(page).not.toMatch(/\b\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+20(2[7-9]|[3-9]\d)\b/);
    expect(page).not.toMatch(/changes? (each|every) year|dates? change/i); // the release does not say the day moves
    expect(page).toMatch(/Check .*Painaustralia.* for (this year's|the current) date/i);
  });
  it('links the facts, Get involved and Painaustralia', () => {
    expect(page).toContain('(/pain-facts)');
    expect(page).toContain('(/get-involved)');
    expect(page).toContain('https://www.painaustralia.org.au/');
  });
});

// --- Task 3: Take Action hub and templates -----------------------------------
commonChecks('take-action');
commonChecks('letter-to-your-mp');
commonChecks('consultation-submission');

describe('take-action hub', () => {
  const page = read('take-action');
  it('links the four ways to help and credits Painaustralia', () => {
    for (const href of ['/letter-to-your-mp', '/consultation-submission', '/pain-facts', '/pain-awareness-month']) {
      expect(page, href).toContain(`(${href})`);
    }
    expect(page).toContain('https://www.painaustralia.org.au/');
    expect(page).toMatch(/does not speak for Painaustralia/);
  });
});

// First-person statements about the writer's own health. "I am writing" / "I am asking" are fine.
const FIRST_PERSON_HEALTH =
  /\bI(?:'m|'ve|\u2019m|\u2019ve| was| suffer| take| live| lived| living| have| had)\b|\bI am (?!writing\b|asking\b)|\bmy (?:pain|condition|diagnosis|surgery|surgeries|medication|medicines?)\b/i;

describe('first-person health guard (self-test)', () => {
  it.each([
    'I am living with chronic pain',
    "I've lived with pain for 20 years",
    'I suffer from scoliosis',
    'I was diagnosed with something',
    'My pain began when I was 12',
    'I take opioids every day',
    "I'm in pain every day",
  ])('flags %s', (text) => {
    expect(FIRST_PERSON_HEALTH.test(text)).toBe(true);
  });
  it.each(['I am writing as a constituent in a suburb', 'I am asking you to support research', 'I would welcome a reply'])(
    'allows %s',
    (text) => {
      expect(FIRST_PERSON_HEALTH.test(text)).toBe(false);
    },
  );
});

// Bracketed fill-ins that are not markdown links.
const fillIns = (text: string) => [...text.matchAll(/\[[a-z][^\]]*\](?!\()/gi)].map((m) => m[0]);

describe.each(['letter-to-your-mp', 'consultation-submission'])('%s template', (slug) => {
  const page = read(slug);
  const template = page.split(/^## Template$/m)[1] ?? '';
  it('has a Template section with bracketed fill-ins', () => {
    expect(page).toMatch(/^## Template$/m);
    expect(fillIns(template).length).toBeGreaterThanOrEqual(3);
  });
  it('makes no first-person health claims outside fill-ins', () => {
    const withoutFillIns = page.replace(/\[[^\]]*\]/g, '');
    expect(withoutFillIns).not.toMatch(FIRST_PERSON_HEALTH);
  });
});

describe('letter-to-your-mp page', () => {
  const page = read('letter-to-your-mp');
  it('links the MP search and cites the 4.2 million figure to Painaustralia', () => {
    expect(page).toContain('https://www.aph.gov.au/Senators_and_Members/Parliamentarian_Search_Results');
    expect(page).toContain('4.2 million');
    expect(page).toContain(RELEASE);
    expect(page).toContain('Painaustralia');
  });
  it('asks for the three things and for a reply', () => {
    expect(page.toLowerCase()).toContain('multidisciplinary pain care');
    expect(page.toLowerCase()).toContain('awareness');
    expect(page.toLowerCase()).toContain('research');
    expect(page).toMatch(/reply|meeting/i);
  });
});

describe('consultation-submission page', () => {
  it('links the consultation hub and covers publication preference', () => {
    const page = read('consultation-submission');
    expect(page).toContain('https://consultations.health.gov.au/');
    expect(page).toMatch(/published/i);
  });
});

export { RELEASE, read, externalLinks, internalLinks, knownRoutes, commonChecks, ALLOWED_EXTERNAL };

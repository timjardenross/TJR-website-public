import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PathwayRail } from '../PathwayNavigation';

const hrefs = ['/pain/understand', '/pain/care', '/pain/capacity', '/pain/flare', '/pain/plan'];
const root = path.resolve(__dirname, '../../../..');
const pages = [
  'src/app/pain/understand/understand-pain-page.tsx',
  'src/app/pain/care/page.tsx',
  'src/app/pain/capacity/page.tsx',
  'src/app/pain/flare/page.tsx',
  'src/app/pain/plan/page.tsx',
];

describe('PathwayRail', () => {
  it('renders all five steps for every current value', () => {
    for (let current = 1; current <= 5; current += 1) {
      const html = renderToStaticMarkup(createElement(PathwayRail, { current }));
      for (const href of hrefs) expect(html, `current=${current} ${href}`).toContain(`href="${href}"`);
    }
  });

  it('marks only the current step with aria-current', () => {
    for (let current = 1; current <= 5; current += 1) {
      const html = renderToStaticMarkup(createElement(PathwayRail, { current }));
      expect(html.match(/aria-current="step"/g)).toHaveLength(1);
    }
  });
});

describe('pathway pages', () => {
  it.each(pages)('%s uses PathwayRail and no inline rail', (file) => {
    const source = readFileSync(path.join(root, file), 'utf8');
    expect(source).toContain('<PathwayRail');
    expect(source).not.toContain('<aside className="pain-rail"');
  });
});

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PathwayRail } from '../PathwayNavigation';

const hrefs = ['/pain/care', '/pain/capacity', '/pain/flare', '/pain/plan'];
const root = path.resolve(__dirname, '../../../..');
const pages = [
  'src/app/pain/care/page.tsx',
  'src/app/pain/capacity/page.tsx',
  'src/app/pain/flare/page.tsx',
  'src/app/pain/plan/page.tsx',
];

describe('PathwayRail', () => {
  it('renders all four steps for every current value', () => {
    for (let current = 1; current <= 4; current += 1) {
      const html = renderToStaticMarkup(createElement(PathwayRail, { current }));
      for (const href of hrefs) expect(html, `current=${current} ${href}`).toContain(`href="${href}"`);
    }
  });

  it('marks only the current step with aria-current', () => {
    for (let current = 1; current <= 4; current += 1) {
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

describe('pathway without the Understand Pain step', () => {
  it('does not link the removed page and shows four numbered steps', () => {
    const html = renderToStaticMarkup(createElement(PathwayRail, { current: 1 }));
    expect(html).not.toContain('/pain/understand');
    for (const label of ['01', '02', '03', '04']) expect(html).toContain(`<span>${label}</span>`);
    expect(html).not.toContain('<span>05</span>');
  });

  it.each([
    ['src/app/pain/care/page.tsx', 1, '01 / Find help'],
    ['src/app/pain/capacity/page.tsx', 2, '02 / Manage your capacity'],
    ['src/app/pain/flare/page.tsx', 3, '03 / Prepare for flares'],
    ['src/app/pain/plan/page.tsx', 4, '04 / My Pain Plan'],
  ])('%s sits at step %i and its hero label matches', (file, step, label) => {
    const source = readFileSync(path.join(root, file), 'utf8');
    expect(source).toContain(`<PathwayRail current={${step}} />`);
    expect(source).toContain(label);
  });
});

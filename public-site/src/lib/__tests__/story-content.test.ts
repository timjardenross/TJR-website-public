import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(__dirname, '../../..');
const read = (slug: string) => readFileSync(path.join(root, 'content/pages', `${slug}.md`), 'utf8');

// Targets named institutions and clinicians, not the plain word "hospital"
// (the story legitimately says "in hospital").
const namesOrDates =
  /\b[A-Z][\w'’]+(\s[A-Z][\w'’]+)*\s(Hospital|Clinic|Medical Centre|Health)\b|\bDr\.?\s[A-Z]|\b\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\b/;
const placeholders = /\[|TBD|your words|TODO/i;

describe('my-story page', () => {
  const story = read('my-story');

  it('opens with a content note naming Lifeline 13 11 14 and Beyond Blue 1300 224 636', () => {
    const top = story.slice(0, story.indexOf('## My story'));
    expect(top).toContain('Content note');
    expect(top).toContain('13 11 14');
    expect(top).toContain('1300 224 636');
  });

  it('has no placeholder text', () => {
    const body = story.replace(/\]\([^)]*\)/g, ''); // ignore markdown link targets
    expect(body.replace(/\[([^\]]*)\]/g, '$1')).not.toMatch(placeholders);
  });

  it('names no employer, hospital or clinician and gives no exact dates', () => {
    expect(story).not.toMatch(namesOrDates);
  });

  it('describes therapies only as short-term relief, never as what works', () => {
    expect(story).toContain('short-term relief');
    expect(story).not.toMatch(/\byou should\b|\bworks? for everyone\b|\bI recommend\b|\bcured\b/i);
  });

  it('states the written date and yearly review', () => {
    expect(story).toContain('Written November 2026');
    expect(story).toContain('I review this page each year');
  });

  it('keeps the timeline in an expandable details block with the not-advice line', () => {
    expect(story).toContain('<details>');
    expect(story).toContain('<summary>My timeline</summary>');
    expect(story).toContain('It is not advice about what anyone else should do');
  });

  it('contains no coaching language', () => {
    expect(story).not.toMatch(/\bcoach/i);
  });
});

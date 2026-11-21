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
// Markdown links are fine; only bare brackets count as placeholders.
const stripLinks = (text: string) => text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

describe('my-story page', () => {
  const story = read('my-story');

  it('opens with a content note naming Lifeline 13 11 14 and Beyond Blue 1300 224 636', () => {
    const top = story.slice(0, story.indexOf('## My story'));
    expect(top).toContain('Content note');
    expect(top).toContain('13 11 14');
    expect(top).toContain('1300 224 636');
  });

  it('has no placeholder text', () => {
    expect(stripLinks(story)).not.toMatch(placeholders);
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

describe('story-and-consent page', () => {
  const page = read('story-and-consent');

  it('says visitor stories are not open yet', () => {
    expect(page).toContain('Visitor stories are not open yet');
  });

  it('states the consent rules', () => {
    for (const phrase of ['how you are identified', 'change your mind', 'fundraising', 'review']) {
      expect(page, phrase).toContain(phrase);
    }
  });

  it('names the support lines', () => {
    expect(page).toContain('13 11 14');
    expect(page).toContain('1300 224 636');
  });

  it('has no placeholder text', () => {
    expect(stripLinks(page)).not.toMatch(placeholders);
  });

  it('names no employer, hospital or clinician', () => {
    expect(page).not.toMatch(namesOrDates);
  });

  it('links to the privacy policy', () => {
    expect(page).toContain('(/privacy-policy)');
  });
});

describe('placeholder guard', () => {
  it('still flags a bare bracketed placeholder and ignores real links', () => {
    expect(stripLinks('see [this page](/x)')).not.toMatch(placeholders);
    expect(stripLinks('[Your words: why advocacy]')).toMatch(placeholders);
  });
});

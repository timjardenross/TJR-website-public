import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(__dirname, '../../..');
const read = (slug: string) => readFileSync(path.join(root, 'content/pages', `${slug}.md`), 'utf8');

// --- Guards -----------------------------------------------------------------
// These are text scans. They catch realistic named hospitals, clinicians, exact
// dates and placeholder forms. They CANNOT detect an employer name: that relies
// on human review of the PR.

const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
const MONTHS_ABBR = 'Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec';

// Bare hospital names people actually use in Australia.
const knownHospitals =
  /\b(the Alfred|RPA|Royal Prince Alfred|the Mater|Mater|St Vincent['’]?s|Westmead|Epworth|Royal North Shore|Royal Melbourne|Royal Children['’]?s|Prince of Wales|Liverpool Hospital|Austin Health)\b/;
const namedInstitution =
  /\b(?:[A-Z][\w'’]+\s)+(?:Hospital|Clinic|Medical Centre|Medical Center|Health)\b|\b(?:[A-Z][\w'’]+\s){2,}hospital\b|\bHospital of\s[A-Z]/;
const clinicianTitle = /\b(?:Dr|Mr|Ms|Mrs|Miss|Mx|Prof|Professor|A\/Prof|Doctor)\.?\s[A-Z][a-z]/;
const exactDate = new RegExp(
  [
    `\\b\\d{1,2}(?:st|nd|rd|th)?\\s+(?:${MONTHS}|${MONTHS_ABBR})\\b`, // 3 March, 3rd Mar
    `\\b(?:${MONTHS}|${MONTHS_ABBR})\\s+\\d{1,2}(?:st|nd|rd|th)?\\b`, // March 3, March 3rd
    '\\b\\d{1,2}[/.-]\\d{1,2}[/.-]\\d{2,4}\\b', // 03/03/2016
    '\\b\\d{4}-\\d{2}-\\d{2}\\b', // 2016-03-03
  ].join('|'),
  'i',
);
// "Written November 2026" and "I review this page each year" are month-year only: not matched.

function namesHospitalOrClinicianOrExactDate(text: string): boolean {
  return knownHospitals.test(text) || namedInstitution.test(text) || clinicianTitle.test(text) || exactDate.test(text);
}

// Markdown links are fine; bare brackets and common placeholder forms are not.
const stripLinks = (text: string) => text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
const placeholderForms =
  /\{\{|<!--|\bTBD\b|\bTBC\b|\bTODO\b|\bXXX\b|lorem ipsum|\bplaceholder\b|to be confirmed|\(Tim to |\[(?:insert|add|your|reason|tbd|todo)[^\]]*\]|\byour words:/i;
function hasPlaceholder(text: string): boolean {
  return placeholderForms.test(text) || /\[/.test(stripLinks(text));
}

describe('guards catch what they claim (self-test)', () => {
  const bad = [
    'at the Alfred',
    'at RPA',
    'Royal Prince Alfred',
    'the Mater',
    "St Vincent's Private",
    'Royal North Shore hospital',
    'Hospital of St John',
    'my surgeon, Mr John Smith',
    'Professor Jane Citizen',
    'Doctor Smith',
    'March 3, 2016',
    '3rd March 2016',
    '3 Mar 2016',
    '03/03/2016',
    '2016-03-03',
    '3 march 2016',
  ];
  it.each(bad)('flags %s', (text) => {
    expect(namesHospitalOrClinicianOrExactDate(text)).toBe(true);
  });

  const fine = [
    'infections I picked up in hospital',
    'In hospital I felt unheard',
    'This page mentions surgery, hospital and mental health themes.',
    'Written November 2026',
    'In 2016 I had the first of four spinal surgeries',
    'a new pain specialist',
    'a 12-day stay in intensive care',
  ];
  it.each(fine)('does not flag %s', (text) => {
    expect(namesHospitalOrClinicianOrExactDate(text)).toBe(false);
  });

  const placeholders = [
    '{{reason}}',
    '(Tim to add)',
    'TBC',
    'to be confirmed',
    'XXX',
    'Lorem ipsum dolor',
    'PLACEHOLDER',
    '<!-- reason -->',
    '[insert reason here](#)',
    '[Your words: why advocacy]',
    'TODO: write this',
  ];
  it.each(placeholders)('flags placeholder %s', (text) => {
    expect(hasPlaceholder(text)).toBe(true);
  });

  const realCopy = ['told in your own words', 'Mastodon is a social network', 'see [this page](/x) for more'];
  it.each(realCopy)('does not flag real copy: %s', (text) => {
    expect(hasPlaceholder(text)).toBe(false);
  });
});

describe('my-story page', () => {
  const story = read('my-story');
  const body = story.replace(/^---[\s\S]*?---\s*/, '');

  it('opens with a content note, before anything else', () => {
    expect(body.startsWith('> **Content note')).toBe(true);
    const note = body.slice(0, body.indexOf('\n\n'));
    expect(note).toContain('13 11 14');
    expect(note).toContain('1300 22 4636');
    expect(note).toContain('000');
    expect(note).toContain('Lifeline');
    expect(note).toContain('Beyond Blue');
  });

  it('has no placeholder text', () => {
    expect(hasPlaceholder(story)).toBe(false);
  });

  it('names no hospital or clinician and gives no exact dates', () => {
    expect(namesHospitalOrClinicianOrExactDate(story)).toBe(false);
  });

  it('describes therapies only as short-term relief, never as what works', () => {
    expect(story).toContain('short-term relief');
    expect(story).not.toMatch(
      /\byou should\b|\byou could try\b|\bworks? for everyone\b|\b(?:I['’]d |highly |I )?recommend\b|\bcured\b|\bworked for me\b|\bfixed my pain\b/i,
    );
  });

  it('omits the 2025 specialist entry, as Tim decided', () => {
    expect(story).not.toMatch(/2025|specialist/i);
  });

  it('says he is back in a corporate role', () => {
    expect(story).toMatch(/back in a corporate role/);
  });

  it('closes with specific next steps that exist on the site', () => {
    expect(story).toContain('(/pain/care)');
    expect(story).toContain('(/get-involved)');
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
    expect(page).toContain('1300 22 4636');
  });

  it('has no placeholder text', () => {
    expect(hasPlaceholder(page)).toBe(false);
  });

  it('names no hospital or clinician and gives no exact dates', () => {
    expect(namesHospitalOrClinicianOrExactDate(page)).toBe(false);
  });

  it('links to the privacy policy', () => {
    expect(page).toContain('(/privacy-policy)');
  });
});

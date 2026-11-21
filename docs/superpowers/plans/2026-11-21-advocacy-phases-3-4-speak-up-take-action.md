# Advocacy Pivot, Phases 3 and 4: Speak Up and Take Action — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (Tim chose native, inline execution). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Speak Up self-advocacy section (phase 3) and the Take Action section (phase 4), wired into the nav, homepage and About page.

**Architecture:** All new pages are Markdown content pages in `public-site/content/pages/` (CMS-editable, flat root routes, in the sitemap automatically; no code-route directories, so no markdown/route collision). One tests file pins what the pages may link to, what they must cite, and what they must not say. Only verified sources are used (list below).

**Tech Stack:** Next.js 14, MDX (`next-mdx-remote`), Vitest. All commands run from `public-site/`.

**Spec:** `docs/superpowers/specs/2026-11-21-advocacy-pivot-design.md` (sections 6, 8 phases 3 and 4, 9).

## Verified sources (the only external links these pages may contain)

Checked 21 Nov 2026 by reading the pages or search results:
- Ask Share Know (Australian Commission on Safety and Quality in Health Care): `https://www.safetyandquality.gov.au/supporting-your-health-care/ask-share-know`. Its three steps are exactly: "Ask questions to help get the information you need", "Share what matters to you", "Know your options".
- Australian Charter of Healthcare Rights (same Commission): `https://www.safetyandquality.gov.au/your-rights/understanding-your-healthcare-rights`. Seven rights, as labelled on that page: Access, Safety, Respect, Partnership, Information, Privacy, Give feedback.
- Healthdirect, questions to ask your doctor: `https://www.healthdirect.gov.au/healthcare-and-services/general-health/questions-to-ask-your-doctor` (the short `/questions-to-ask-your-doctor` address redirects here).
- Find your federal MP (Parliament of Australia): `https://www.aph.gov.au/Senators_and_Members/Parliamentarian_Search_Results`.
- Department of Health consultation hub: `https://consultations.health.gov.au/`.
- National Strategic Action Plan for Pain Management (Department of Health): `https://www.health.gov.au/resources/publications/the-national-strategic-action-plan-for-pain-management`.
- Painaustralia home: `https://www.painaustralia.org.au/`.
- Painaustralia media release "The pain you can't see…", dated 31 August 2026: `https://www.painaustralia.org.au/media/mr-2026/the-pain-you-cant-see`. It says Wear Red for Pain is on 1 September and that chronic pain affects "4.2 million adults"; it encourages Australians, workplaces, health professionals, community pharmacies and organisations to wear red that day. It does not define chronic pain.

## Global Constraints

- Use only the claims and links above. Never invent a statistic, date, URL or policy position. Statistics are attributed, dated and linked ("as at November 2026").
- No medical advice, diagnosis, treatment advice or treatment ranking; no promises of cure or outcomes. Educational and self-advocacy only. An individual voice, not an official body; Painaustralia is the national peak body and is credited as such, never spoken for.
- Do not hard-code future campaign dates. Say dates change each year and to check Painaustralia.
- No employer, hospital or clinician names; no new personal health detail beyond what is already on `/my-story`. Any first-person line may only restate what that page already says.
- Templates keep bracketed fill-ins (for example `[your suburb]`) on purpose; the story-page placeholder rule does not apply to them. Any other published page has no placeholders.
- No coaching language. Australian English, plain language, tone of the existing Pathway.
- CI and branch protection stay intact: keep `.github/workflows/ci.yml` and the required check `test-and-build`; never bypass or rename it; never push to `main`; merge only through the PR after `test-and-build` passes on the final PR commit and Tim says to merge; update CI in the same PR if scripts, paths or build commands change. `src/middleware.ts` unchanged (production stays locked to `/coming-soon`).

## Review Focus

- An external link not on the verified list, or a statistic without a source and "as at" date. Pinned in Task 2.
- Printing a Speak Up page must not hide Pathway page content (the Pathway pages use their own `<header>`). Pinned in Task 1.
- Template pages must read as templates, not as Tim's own statements. Pinned in Task 3.
- Every new nav, homepage and About link resolves. Pinned in Task 4.
- Nothing reads as medical advice. Pinned in Tasks 1 to 3.

---

### Task 1: Speak Up hub, appointment guide and print styles

**Files:**
- Create: `public-site/content/pages/speak-up.md`, `public-site/content/pages/how-to-be-heard.md`
- Modify: `public-site/src/app/globals.css` (append print rules)
- Create: `public-site/src/lib/__tests__/advocacy-pages.test.ts` (shared helpers plus the tests below)

**Interfaces:**
- Produces: routes `/speak-up`, `/how-to-be-heard`. Exports from the test file nothing; later tasks add tests to the same file using its helpers `read(slug)`, `externalLinks(text)`, `internalLinks(text)`, `ALLOWED_EXTERNAL: Set<string>` (the verified list above), `knownRoutes(): Set<string>`.

Content (wording is my call; Tim reviews in the PR). `speak-up.md`, title "Speak up": intro (being heard is a skill you can prepare for; you are not doing it wrong); **Before / In the appointment / After** one-line summaries linking to `/how-to-be-heard`; **Tools on this site** linking `/pain/understand` (map your pain story), `/pain/care` (who can help, questions to ask), `/pain/capacity`, `/pain/flare` (Flare Card), `/pain/plan` (My Pain Plan, with save, print and export); **Your rights** (the seven Charter rights, linking the Charter page); a boundary line (educational, talk to your GP or another qualified health professional). `how-to-be-heard.md`, title "How to be heard in an appointment": **Before** (write your pain story: where, what, when, what changes it, what it affects; note what matters most to you; list your questions; bring someone or your notes), **In the appointment** (Ask Share Know, using the three verified step names with the link; say when you have not understood; ask what happens next and when it will be reviewed), **After** (write down what was agreed; book the follow-up), **Your rights** (Charter, including the right to give feedback), one first-person line that links to `/my-story` and says speaking up in the medical system is still hard for Tim (restating the story page), the Healthdirect questions link, and the boundary line.

- [ ] **Step 1: Write the failing tests** in `advocacy-pages.test.ts` for `speak-up` and `how-to-be-heard`: front matter has a `title` and `seo.description`; every external `https://` link is in `ALLOWED_EXTERNAL`; every internal link resolves via `knownRoutes()`; contains the three Ask Share Know step names verbatim (guide only); contains all seven Charter right names (hub); no `/\bcoach/i`; no `/\b(cure|guarantee)/i`; no medicine-change advice (`/\b(stop|start|increase|reduce)\s+(taking\s+)?(your\s+)?(medication|medicine|opioids?)\b/i`); links to `/my-story` (guide). Add `it('print styles hide only the site header, footer and skip link')` reading `globals.css`: contains `@media print`, contains `body > header`, `body > footer` and `.skip-link`, and does NOT contain a bare `header {` or `header,` rule inside the print block.
- [ ] **Step 2: Run** `npx vitest run src/lib/__tests__/advocacy-pages.test.ts`. Expected: FAIL (files missing).
- [ ] **Step 3: Create** the two pages per the content outline; append `@media print { body > header, body > footer, .skip-link { display: none !important; } }` to `globals.css`.
- [ ] **Step 4: Run** the test file, then `npm run lint && npx tsc --noEmit && npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `git add public-site && git commit -m "feat(speak-up): add Speak Up hub, appointment guide and print styles"`

### Task 2: Pain facts and Pain Awareness Month pages

**Files:**
- Create: `public-site/content/pages/pain-facts.md`, `public-site/content/pages/pain-awareness-month.md`
- Test: extend `advocacy-pages.test.ts`

**Interfaces:**
- Produces: routes `/pain-facts`, `/pain-awareness-month`.

Content. `pain-facts.md`, title "Pain facts": a short sharable list, each item with its source and date, under a line "As at November 2026. Reviewed each year." Items: (1) "Painaustralia's 2026 awareness campaign says chronic pain affects 4.2 million adults in Australia" with the line "Estimates vary by year and by how they are counted, so treat this as Painaustralia's current figure." Source link: the 31 August 2026 release. (2) "Chronic pain is often invisible: many people manage its impact every day without those around them knowing" (paraphrasing the release), same source link. (3) "Australia has a National Strategic Action Plan for Pain Management" linking the Department of Health page. Closing: how to share (copy the page link) and a note that Painaustralia is the national peak body (link). `pain-awareness-month.md`, title "Pain Awareness Month": September is International Pain Awareness Month; Painaustralia's Wear Red for Pain campaign was on 1 September in 2026 and the day changes by year, so check Painaustralia; how to take part (per the release: individuals, workplaces, health professionals, community pharmacies and organisations wear red); links to the release and Painaustralia; "Share the [pain facts](/pain-facts)" and "[Get involved](/get-involved)".

- [ ] **Step 1: Write the failing tests** for both pages: front matter present; external links all in `ALLOWED_EXTERNAL`; internal links resolve; `pain-facts` contains "As at November 2026" and "4.2 million" and every bullet under the facts list carries a `Source:` link (assert the count of `Source:` equals the count of fact bullets and each is a markdown link to an allowed URL); `pain-awareness-month` contains "1 September" and "2026", contains no other specific calendar date for a future year (`/\b\d{1,2}\s+(January|…|December)\s+20(2[7-9]|[3-9]\d)\b/`), and links the 31 August 2026 release; no coaching; no cure or guarantee language.
- [ ] **Step 2: Run** the test file. Expected: FAIL (files missing).
- [ ] **Step 3: Create** the two pages per the content outline.
- [ ] **Step 4: Run** the test file, then `npm run lint && npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `git add public-site && git commit -m "feat(take-action): add pain facts and Pain Awareness Month pages"`

### Task 3: Take Action hub and letter templates

**Files:**
- Create: `public-site/content/pages/take-action.md`, `letter-to-your-mp.md`, `consultation-submission.md` (all under `public-site/content/pages/`)
- Test: extend `advocacy-pages.test.ts`

**Interfaces:**
- Produces: routes `/take-action`, `/letter-to-your-mp`, `/consultation-submission`.

Content. `take-action.md`, title "Take action": four ways, each one link: write to your MP (`/letter-to-your-mp`), have your say in a consultation (`/consultation-submission`), share the facts (`/pain-facts`), join Pain Awareness Month (`/pain-awareness-month`); a line crediting Painaustralia as the national peak body (link) and saying this site is an individual voice. `letter-to-your-mp.md`, title "Write to your MP": how to find your MP (the Parliament of Australia search link), tips (one page; say your suburb so the office knows you are a constituent; keep personal health detail to what you are comfortable sharing), then a section headed "Template" with bracketed fill-ins: greeting, `[your suburb]`, an optional personal paragraph (`[one or two sentences about how pain affects your life, only what you are comfortable sharing]`), the sourced statistic (4.2 million adults, Painaustralia 2026, linked), and three asks (timely and affordable access to multidisciplinary pain care; greater awareness of chronic pain; support for pain research), a line saying these match the priorities consumers raised in the national action plan consultation (link the Department of Health plan page), a request for a reply or a meeting, and a sign-off. `consultation-submission.md`, title "Have your say in a consultation": the consultation hub link, tips (read the questions; answer the question asked; keep your story short; check whether your submission will be published and what you can choose), and a "Template" with headings: who I am, my interest, my answer, my ask, my publication preference.

- [ ] **Step 1: Write the failing tests:** front matter; external links all in `ALLOWED_EXTERNAL`; internal links resolve; `take-action` links all four internal pages and the Painaustralia link; each of the two template pages contains a heading line exactly `## Template` and at least three bracketed fill-ins matching `/\[[a-z][^\]]*\]/i`; `letter-to-your-mp` contains "4.2 million" with the release link and "Painaustralia"; neither template page contains first-person health claims beyond a bracketed fill-in (assert no `/\bI (have|had|live with)\b/i` outside brackets, after stripping bracketed text); no coaching; no cure/guarantee/medicine-change advice.
- [ ] **Step 2: Run** the test file. Expected: FAIL (files missing).
- [ ] **Step 3: Create** the three pages per the content outline.
- [ ] **Step 4: Run** the test file, then `npm run lint && npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `git add public-site && git commit -m "feat(take-action): add Take Action hub and letter templates"`

### Task 4: Wire into nav, homepage and About

**Files:**
- Modify: `public-site/src/lib/nav.ts`, `public-site/src/app/page.tsx`, `public-site/content/pages/about.md`
- Test: `public-site/src/lib/__tests__/nav.test.ts`, `public-site/src/lib/__tests__/advocacy-copy.test.ts`, `public-site/src/app/__tests__/sitemap.test.ts`

**Interfaces:**
- Consumes: `navLinks: readonly NavLink[]` (`{ label: string; href: string }`) from `src/lib/nav.ts`; the existing nav test already asserts every nav, CTA and footer href resolves to a route or a `content/pages/*.md` slug.

Changes: `navLinks` becomes About `/about`, My Story `/my-story`, Understand Pain `/pain/understand`, Speak Up `/speak-up`, Take Action `/take-action` (this matches spec section 6). Homepage pillars: "Speak up" links to `/speak-up` ("Prepare for appointments"), "Take action" gains `href: '/take-action'` and `cta: 'See ways to help'`, and its detail text no longer says "being added over time". `about.md`: the "Tools for speaking up" and "Ways to take action" bullets drop "Over time, …" and link to `/speak-up` and `/take-action`.

- [ ] **Step 1: Write the failing tests:** `nav.test.ts`, lists Speak Up and Take Action in the primary nav; `advocacy-copy.test.ts`, homepage contains `href: '/speak-up'` and `href: '/take-action'` and neither homepage nor About contains "being added over time" or "Over time, this site will add" or "Over time, you will"; About links `(/speak-up)` and `(/take-action)`; `sitemap.test.ts`, the sitemap contains `/speak-up`, `/how-to-be-heard`, `/take-action`, `/letter-to-your-mp`, `/consultation-submission`, `/pain-facts`, `/pain-awareness-month`.
- [ ] **Step 2: Run** `npx vitest run`. Expected: the new nav and copy assertions FAIL (sitemap ones pass if Tasks 1 to 3 are present).
- [ ] **Step 3: Apply** the changes above.
- [ ] **Step 4: Run** `npm run lint && npx tsc --noEmit && npm test`. Expected: all PASS.
- [ ] **Step 5: Commit** `git add public-site && git commit -m "feat: link Speak Up and Take Action from nav, homepage and About"`

### Task 5: Build and link verification

**Files:** none expected; fix only if a check fails.

- [ ] **Step 1: Build** `npm run build > /tmp/build5.log 2>&1`. Expected: exit 0.
- [ ] **Step 2: Serve and check** `npx next start -p 3295`, then curl each of the seven new routes: HTTP 200, and `/` and `/about` contain `href="/speak-up"` and `href="/take-action"`; `/sitemap.xml` lists all seven. Stop the server.
- [ ] **Step 3: Check external links** with `curl -s -o /dev/null -w "%{http_code}"` for every URL in the verified list; report each status. A 403 or proxy block from the sandbox is reported as "not checkable from here", not as a pass; a 404 is a failure to fix.
- [ ] **Step 4: Run** `npm run lint && npm test`. Expected: PASS.

### Task 6: Review, PR and CI handoff (after Task 5 and the final review)

**Files:** none expected; `.github/workflows/ci.yml` stays unchanged.

- [ ] **Step 1:** `git diff origin/main -- .github/workflows/ci.yml public-site/src/middleware.ts` is empty; the job name is still `test-and-build`.
- [ ] **Step 2:** `npm ci && npm run lint && npm test && npm run build` exit 0.
- [ ] **Step 3:** Push the branch and open a draft PR listing, for Tim: the copy to review, the external links that could not be checked from the sandbox, and the fact that no future dates are hard-coded.
- [ ] **Step 4:** Confirm `test-and-build` passed on the final PR head SHA (read the check runs for that SHA).
- [ ] **Step 5: Stop for Tim's go-ahead.** Mark ready and merge through the PR only after Tim says to; then confirm the `main` push run of `test-and-build` passes.
- [ ] **Step 6:** Do not edit branch protection.

---

## Self-review

- **Spec coverage:** phase 3 (printable self-advocacy tools via existing Pathway pages, "how to be heard in an appointment") in Task 1; phase 4 (MP letter and consultation templates, sourced and dated fact sheet, September awareness page linking Painaustralia) in Tasks 2 and 3; nav and homepage wiring (spec section 6) in Task 4. Out of scope: video/audio, visitor submissions, privacy and terms review, `/library` decision, launch.
- **Name consistency:** slugs `speak-up`, `how-to-be-heard`, `take-action`, `letter-to-your-mp`, `consultation-submission`, `pain-facts`, `pain-awareness-month` are identical across tasks, tests and links; `ALLOWED_EXTERNAL` is the verified list above.
- **Proportion:** six tasks, mostly content; copy is specified by outline, not transcribed.
- **Known risks:** regex content guards are text scans; external links cannot all be verified from the sandbox; the 4.2 million figure is Painaustralia's own estimate with no methodology confirmed, which the page says.

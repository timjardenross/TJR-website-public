# Advocacy Pivot, Phase 2: My Story — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (Tim chose native, inline execution in this session). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Tim's story page and a story consent and safeguards page, and link them from the nav, homepage and About page.

**Architecture:** Both pages are Markdown content pages under `public-site/content/pages/` (CMS-editable, rendered at the site root by the existing `[collection]` route, listed in the sitemap automatically). No new route directories, so there is no code-route/markdown collision. Content rules are enforced by a vitest content-guard test, in the same style as `advocacy-copy.test.ts`.

**Tech Stack:** Next.js 14, MDX via `next-mdx-remote`, Vitest. All commands run from `public-site/`.

**Spec:** `docs/superpowers/specs/2026-11-21-advocacy-pivot-design.md` (sections 7, 8 phase 2, 9). Phase 1 plan: `docs/superpowers/plans/2026-11-21-advocacy-phase-1-reposition.md`.

**Source copy (kept outside the repo; ask Tim or the session owner for it):** the story text approved by Tim as a starting point. If the source copy is unavailable, the source is Tim's approved 300-word draft in the session transcript plus his Google Doc "My Authentic Story". Never invent facts; stop and ask Tim.

## Global Constraints

- Story facts come only from Tim's Google Doc and his stated answers (spec section 7). Tim's decisions are recorded in spec section 7: detailed level, his chosen wording for current treatments and duration, which identifying details may be public, and that the employer is never named.
- Never name the employer, any hospital or any clinician. Years only, no exact dates. No treatment recommendations or ratings: therapies are described as "short-term relief" for Tim, never as what works.
- Content note with Lifeline 13 11 14 and Beyond Blue 1300 224 636 at the top of the story page. Both numbers must be re-verified before launch (see Review Focus).
- No placeholder text (`[`…`]`, "TBD", "your words") in any published page.
- The page is dated ("Written November 2026") and states a yearly review.
- Consent page must not imply a story-submission process exists: visitor stories are not open (spec phase 5). Visitor stories are never stored in this repo.
- CI and branch protection stay intact: keep `.github/workflows/ci.yml` and the required check `test-and-build`; never bypass or rename it; never push directly to `main`; merge only through the PR after `test-and-build` passes on the final PR commit and Tim says to merge; update CI in the same PR if scripts, paths or build commands change.
- Production stays locked to `/coming-soon` (`src/middleware.ts` unchanged).
- Australian English, plain language, tone of the existing Pathway.

## Review Focus

- A published page must never contain placeholder text. Pinned in Task 1 and Task 2.
- No employer, hospital or clinician name, and no exact dates, on either page. Pinned in Task 1.
- The consent page must say visitor stories are not open yet. Pinned in Task 2.
- The `<details>` timeline must actually render in a built page, not be escaped as text. Pinned in Task 4.
- Every new nav and homepage link resolves to a live page. Pinned in Task 3.

---

### Task 1: My Story page

**Files:**
- Create: `public-site/content/pages/my-story.md`
- Test: `public-site/src/lib/__tests__/story-content.test.ts`

**Interfaces:**
- Produces: route `/my-story` (served by the existing `[collection]` page route; slug is the filename).

Front matter: `title: "My story"`, `seo.description: "Tim's story of living with chronic pain, told to help others feel less alone and be better prepared to speak up."`. Indexable (my call; Tim may add `seo.noindex: true` in the CMS). Body: the source copy file, verbatim from the `> **Content note…` blockquote through the closing `</details>` (do not include the lines above `---` or the facts-for-Tim list).

- [ ] **Step 1: Write the failing test** `story-content.test.ts` reading `content/pages/my-story.md` with: `it('opens with a content note naming Lifeline 13 11 14 and Beyond Blue 1300 224 636')`; `it('has no placeholder text')` (no `[`, `TBD`, `your words`, `TODO`); `it('names no employer, hospital or clinician and gives no exact dates')` (no `/\bhospital\b|\bclinic\b|\bclinician\b|\bDr\.? /i` and no `/\b\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\b/i`); `it('describes therapies only as short-term relief, never as what works')` (contains "short-term relief"; no `/\byou should\b|\bworks? for everyone\b|\bI recommend\b|\bcured\b/i`); `it('states the written date and yearly review')` (contains "Written November 2026" and "I review this page each year"); `it('keeps the timeline in an expandable details block with the not-advice line')` (contains `<details>`, `<summary>My timeline</summary>`, "It is not advice about what anyone else should do"); `it('contains no coaching language')`.
- [ ] **Step 2: Run** `npx vitest run src/lib/__tests__/story-content.test.ts`. Expected: FAIL (file not found).
- [ ] **Step 3: Create** `my-story.md` from the source copy as described above.
- [ ] **Step 4: Run** the same test, then `npm test`. Expected: all PASS.
- [ ] **Step 5: Commit** `git add public-site && git commit -m "feat(story): add My Story page"`

### Task 2: Story consent and safeguards page

**Files:**
- Create: `public-site/content/pages/story-and-consent.md`
- Test: extend `public-site/src/lib/__tests__/story-content.test.ts`

**Interfaces:**
- Produces: route `/story-and-consent`.

Content (spec section 9; wording is my call, Tim reviews in the PR). Title "How stories are handled". Sections: **Whose stories are here** (Tim's own story is the only one published; it is Tim's experience, not advice; written November 2026, reviewed yearly). **Visitor stories are not open yet** (nothing sent through the Get involved form is published; if stories open later, these rules apply first). **If stories open:** you choose how you are identified (full name, first name, or anonymous); you can change your mind and ask for a story to be removed; nothing is published without your review; a story is never used for fundraising without your explicit permission; stories are reviewed for dignity, with no sensationalism. **Support:** content notes on every story; Lifeline 13 11 14 and Beyond Blue 1300 224 636. **Privacy:** submissions are never stored in this website's repository; link to `/privacy-policy`.

- [ ] **Step 1: Write the failing tests** in `story-content.test.ts` for `story-and-consent.md`: `it('says visitor stories are not open yet')` (contains "Visitor stories are not open yet"); `it('states the consent rules')` (contains "how you are identified", "change your mind", "fundraising", "review"); `it('names the support lines')`; `it('has no placeholder text')`; `it('names no employer, hospital or clinician')`; `it('links to the privacy policy')` (contains `(/privacy-policy)`).
- [ ] **Step 2: Run** `npx vitest run src/lib/__tests__/story-content.test.ts`. Expected: FAIL (file not found).
- [ ] **Step 3: Create** `story-and-consent.md` per the content outline above.
- [ ] **Step 4: Run** the test file, then `npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `git add public-site && git commit -m "feat(story): add story consent and safeguards page"`

### Task 3: Wire the story into nav, homepage and About

**Files:**
- Modify: `public-site/src/lib/nav.ts`, `public-site/src/app/page.tsx`, `public-site/content/pages/about.md`, `public-site/src/app/__tests__/sitemap.test.ts`
- Test: `public-site/src/lib/__tests__/nav.test.ts` (existing), `public-site/src/lib/__tests__/advocacy-copy.test.ts` (existing)

**Interfaces:**
- Consumes: `navLinks: readonly NavLink[]` from `src/lib/nav.ts` (phase 1). The existing nav test asserts every href resolves to a route or a `content/pages/*.md` slug.

Changes: `navLinks` becomes About `/about`, My Story `/my-story`, Understand Pain `/pain/understand` (in that order). Homepage "A lived-experience voice" block: replace "Tim's story is coming soon." with a link "Read Tim's story" to `/my-story`; keep the rest. `about.md`: replace "My own story is coming to this site soon." with a link to `[my story](/my-story)`; add one line linking to `/story-and-consent` ("How stories are handled"). Footer gets no new links.

- [ ] **Step 1: Write the failing tests:** in `nav.test.ts`, `it('lists My Story in the primary nav')` (href `/my-story`); in `advocacy-copy.test.ts`, `it('homepage and About no longer say the story is coming soon')` (neither `src/app/page.tsx` nor `content/pages/about.md` contains "story is coming" or "coming to this site soon") and `it('about links to the story and the consent page')`; in `sitemap.test.ts`, assert the sitemap contains `/my-story` and `/story-and-consent`.
- [ ] **Step 2: Run** `npx vitest run`. Expected: the new nav, copy and sitemap assertions FAIL (sitemap ones pass if Tasks 1 and 2 are present; the nav and copy ones fail).
- [ ] **Step 3: Apply** the changes above.
- [ ] **Step 4: Run** `npm run lint && npx tsc --noEmit && npm test`. Expected: all PASS, including the existing "every href resolves" nav test.
- [ ] **Step 5: Commit** `git add public-site && git commit -m "feat(story): link My Story from nav, homepage and About"`

### Task 4: Rendering and build verification

**Files:** none expected; fix only if a check fails.

- [ ] **Step 1: Build** `npm run build > /tmp/build3.log 2>&1`. Expected: exit 0; `/my-story` and `/story-and-consent` listed.
- [ ] **Step 2: Serve and check** `npx next start -p 3297` then curl `/my-story`: HTML contains `<details`, `<summary>My timeline</summary>`, `Lifeline`, and does not contain the escaped text `&lt;details`. Curl `/story-and-consent`: contains "Visitor stories are not open yet". Curl `/` and `/about`: contain `href="/my-story"`. Check `/sitemap.xml` lists both new URLs. Stop the server.
- [ ] **Step 3: If `<details>` is escaped or stripped,** rule on the smallest fix (for example render the timeline as a plain headed list) in the ledger, add a test that pins the chosen markup, and re-run Steps 1 and 2.
- [ ] **Step 4: Run** `npm run lint && npm test` once more. Expected: PASS.

### Task 5: Review, PR and CI handoff (runs after Task 4 and the final review)

**Files:** none expected; `.github/workflows/ci.yml` must stay unchanged.

- [ ] **Step 1: Confirm CI untouched:** `git diff origin/main -- .github/workflows/ci.yml` is empty and the job name is still `test-and-build`.
- [ ] **Step 2: Run the CI commands locally:** `npm ci && npm run lint && npm test && npm run build`. Expected: exit 0.
- [ ] **Step 3: Push the branch** (`claude/dazzling-albattani-h8huus`, restarted from `main`; its old history is already merged, so use `git push --force-with-lease`) and open a draft PR whose description lists, for Tim to confirm, the six open points recorded in the source copy (timing of one event, one 2025 entry, the order of two events, the bridging paragraph, the lack of a specific closing ask, and the two support-line numbers) plus anything the reviewer flagged.
- [ ] **Step 4: Confirm `test-and-build` passes on the final PR head SHA** (read the check runs; not an earlier commit).
- [ ] **Step 5: Stop for Tim.** Tim reads the story page on the preview and in the PR, confirms the six facts and says to merge. Mark ready only then.
- [ ] **Step 6: Merge through the PR only** (never push to `main`, no bypass); then confirm the `main` push run of `test-and-build` passes.
- [ ] **Step 7: Branch protection:** do not edit it; ask Tim to confirm in repo settings that the required check, strict mode, admin enforcement, no force pushes, no branch deletion and the PR workflow are all still on.

---

## Self-review

- **Spec coverage (phase 2):** story page with content note, timeline, relatability rules and "written/reviewed yearly" (Task 1); consent and safeguards page (Task 2); nav, homepage and About links (Task 3); build and rendering proof (Task 4); CI, PR and merge discipline (Task 5). Out of scope: video/audio, speaker kit, visitor submissions, hospital-photo placement (still Tim's call).
- **Type and name consistency:** only `navLinks` changes shape; slugs `my-story` and `story-and-consent` match across tasks, tests and links.
- **Proportion:** five tasks; the story copy lives in the source file, not the plan.
- **Known risks:** the content-guard tests are text scans (regex false positives possible); the timeline's "Years later" date is unconfirmed; the closing line has no specific ask until Tim chooses one; whether `<details>` renders under MDX is verified only in Task 4.

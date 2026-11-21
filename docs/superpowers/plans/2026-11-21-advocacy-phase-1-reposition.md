# Advocacy Pivot, Phase 1: Reposition — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the public site from resilience coaching to chronic pain awareness and advocacy, without building the story page or later phases.

**Architecture:** Keep the Next.js 14 app, CMS and Persistent Pain Pathway. Centralise primary navigation in one module, make the Pathway side menu consistent via the existing `PathwayRail`, rewrite coaching copy, rename the contact route, and add redirects so no old URL 404s. Copy rules are enforced by a vitest copy-guard test.

**Tech Stack:** Next.js 14 (app router), TypeScript, Tailwind, Vitest (`npm test`), ESLint (`npm run lint`). All commands run from `public-site/`.

**Spec:** `docs/superpowers/specs/2026-11-21-advocacy-pivot-design.md` (sections 5, 6 and 8, phase 1). Approved by Tim.

## Global Constraints

- Positioning line, verbatim: "Chronic pain awareness and advocacy: helping people be heard, and helping others understand."
- No coaching offer anywhere in public copy, forms, SEO descriptions or footer. Words "coach" and "coaching" may appear only in redirect source paths.
- No diagnosis, treatment advice, or treatment recommendation or rating. Keep the educational, self-advocacy-only disclaimer.
- An individual voice, not an official body. Never claim to speak for Painaustralia.
- Never name Tim's employer, hospitals or clinicians.
- Do not put the My Story draft or Tim's health details in any file in this phase. `/my-story`, Speak Up and Take Action are NOT built here (phases 2 to 4), so they are NOT in the nav yet.
- `src/middleware.ts` coming-soon lock on production stays as is.
- Retired routes redirect, never 404. Off-mission code (`/discover-your-capacity`, `products/groundwork-planner`, the climate download) is unlinked, not deleted.
- Australian English, plain language, tone of the existing Pathway.
- All copy is a draft for Tim to review in the PR before merge.
- CI and branch protection (audit finding closed 21 Nov 2026; preserve it): keep `.github/workflows/ci.yml` and the required job/check name `test-and-build`; never rename it without updating branch protection; never disable or bypass the check; never push directly to `main`; never weaken protection (strict required checks, admin enforcement, no force pushes, no branch deletion, PR workflow). If dependencies, scripts, paths or build commands change, update CI in the same PR.

## Review Focus

- Old URLs `/approach`, `/lets-chat`, `/what-is-coaching`, `/book-a-call` must reach a live page. Pinned in Task 3.
- Every Pathway page shows all five steps in its side menu, with the current one marked. Pinned in Task 2.
- Every nav and footer link points at a route that exists. Pinned in Task 1.
- Production still redirects non-allowlisted paths to `/coming-soon`. Pinned in Task 5.
- The contact form must not offer a coaching enquiry type, and no copy may promise cures or treatment. Pinned in Task 4.

---

### Task 1: Central navigation module

**Files:**
- Create: `public-site/src/lib/nav.ts`
- Create: `public-site/src/lib/__tests__/nav.test.ts`
- Modify: `public-site/src/components/SiteHeader.tsx` (use `navLinks`, CTA label and href)
- Modify: `public-site/src/components/SiteFooter.tsx` (use `footerLinks`)

**Interfaces:**
- Produces: `export type NavLink = { label: string; href: string }`, `export const navLinks: readonly NavLink[]`, `export const ctaLink: NavLink`, `export const footerLinks: readonly NavLink[]`. Later tasks assume `/get-involved` exists.

Values (my call, to be reviewed by Tim): `navLinks` = About `/about`; Understand Pain `/pain/understand`. `ctaLink` = Get involved `/get-involved`. `footerLinks` = Privacy `/privacy-policy`; Terms `/terms-conditions`; RSS `/library/rss.xml`; Sitemap `/sitemap.xml`; Get involved `/get-involved`. Library leaves the nav (empty, off-mission) but its route stays.

- [ ] **Step 1: Write the failing test** `nav.test.ts` with: `it('nav, cta and footer hrefs all resolve to an existing route')` — for each href, assert it is in a known-routes set built from `src/app` directory names plus `content/pages/*.md` slugs plus `/library/rss.xml` and `/sitemap.xml`; `it('has no coaching language in any label')` asserting `/coach/i` does not match any label; `it('keeps the pain pathway in the primary nav')`.
- [ ] **Step 2: Run** `npx vitest run src/lib/__tests__/nav.test.ts`. Expected: FAIL, module `../nav` not found.
- [ ] **Step 3: Implement** `nav.ts` with the values above; update `SiteHeader.tsx` and `SiteFooter.tsx` to render from it (keep markup and classes unchanged).
- [ ] **Step 4: Run** the same test. Expected: the route-existence test FAILS only for `/get-involved` (page is built in Task 4); the others PASS. Mark that assertion `it.skip` with a `// enabled in Task 4` comment, and re-enable it in Task 4.
- [ ] **Step 5: Commit** `git add public-site/src && git commit -m "feat(nav): centralise primary nav and footer links"`

### Task 2: Consistent Pathway side menu

**Files:**
- Modify: `public-site/src/app/pain/care/page.tsx`, `capacity/page.tsx`, `flare/page.tsx`, `plan/page.tsx`, `understand/understand-pain-page.tsx` (replace each inline `<aside className="pain-rail">` with `<PathwayRail current={n} />` from `@/components/pain/PathwayNavigation`; n = 1 understand, 2 care, 3 capacity, 4 flare, 5 plan)
- Test: `public-site/src/components/pain/__tests__/PathwayNavigation.test.tsx`

**Interfaces:**
- Consumes: existing `PathwayRail({ current: number })`, `PathwayProgress`, `steps` (not exported; the test reads rendered output).

- [ ] **Step 1: Write the failing test.** Using `renderToStaticMarkup` from `react-dom/server`: `it('renders all five steps for every current value')` asserting each of the five hrefs (`/pain/understand`, `/pain/care`, `/pain/capacity`, `/pain/flare`, `/pain/plan`) appears for `current` 1 to 5; `it('marks only the current step with aria-current')` asserting exactly one `aria-current="step"`. Add `it('every pain page uses PathwayRail')` that reads the five page source files and asserts each contains `PathwayRail` and does not contain `className="pain-rail"` outside `PathwayNavigation.tsx`.
- [ ] **Step 2: Run** `npx vitest run src/components/pain`. Expected: first two PASS, the file-scan test FAILS (pages still use inline asides).
- [ ] **Step 3: Replace** the inline asides in the five pages as listed. Keep each page's other content unchanged. Do not rename the hero kickers ("04 / Manage your capacity" etc.); note any numbering mismatch you see in the PR description for Tim, do not fix it here.
- [ ] **Step 4: Run** `npx vitest run src/components/pain && npm run lint`. Expected: all PASS.
- [ ] **Step 5: Commit** `git commit -am "fix(pain): use one PathwayRail on every pathway page"`

### Task 3: Retire coaching pages and redirect old URLs

**Files:**
- Modify: `public-site/next.config.mjs` (redirects)
- Delete: `public-site/content/pages/approach.md`
- Modify: `public-site/src/app/__tests__/sitemap.test.ts`
- Test: `public-site/src/__tests__/redirects.test.ts`

**Interfaces:**
- Consumes: `nextConfig.redirects()` from `../../next.config.mjs`.
- Produces: redirect table other tasks rely on: `/approach` → `/about`, `/lets-chat` → `/get-involved`, `/what-is-coaching` → `/about`, `/book-a-call` → `/get-involved`, all `permanent: true`.

- [ ] **Step 1: Write the failing test** `redirects.test.ts`: `it('redirects retired coaching URLs to live pages')` asserting the four mappings above; `it('no redirect destination is a retired route')` asserting no destination equals `/coaching`, `/approach` or `/lets-chat`.
- [ ] **Step 2: Run** `npx vitest run src/__tests__/redirects.test.ts`. Expected: FAIL (`/approach`, `/lets-chat` absent; `/what-is-coaching` points to `/coaching`).
- [ ] **Step 3: Implement** the redirect changes in `next.config.mjs` (fix the existing `/what-is-coaching` and `/book-a-call` entries too), delete `approach.md`, and update `sitemap.test.ts`: replace the `/approach` and `/lets-chat` expectations with `/get-involved`, add `expect(urls).not.toContain(`${site.url}/approach`)`.
- [ ] **Step 4: Run** `npx vitest run src/__tests__/redirects.test.ts`. Expected: PASS. (`sitemap.test.ts` stays red until Task 4 adds the page; that is expected.)
- [ ] **Step 5: Commit** `git commit -am "feat(redirects): retire coaching pages and redirect old URLs"`

### Task 4: Get involved page, forms and copy-guard test

**Files:**
- Move: `public-site/src/app/lets-chat/page.tsx` → `public-site/src/app/get-involved/page.tsx`
- Move: `public-site/content/pages/lets-chat.md` → `public-site/content/pages/get-involved.md`
- Modify: `public-site/src/components/ContactForm.tsx`, `LeadMagnetForm.tsx`, `SiteFooter.tsx`
- Modify: `public-site/src/lib/__tests__/nav.test.ts` (re-enable the `/get-involved` assertion)
- Test: `public-site/src/lib/__tests__/advocacy-copy.test.ts`

**Interfaces:**
- Produces: route `/get-involved`. Contact API payload shape in `/api/contact` is unchanged; only the inquiry option values change.

Copy decisions (spec section 6; wording is my call):
- Page title "Get involved"; description "Share your experience, volunteer, or collaborate on chronic pain awareness and advocacy."
- ContactForm intro: "To share your experience, volunteer, or work together on chronic pain awareness, use the form below or email support@tjrmindbody.com."
- Inquiry options (replace "Coaching"): `share-experience` "Share my experience", `volunteer` "Volunteer or help out", `collaborate` "Collaborate or partner", `media` "Media or speaking", `other` "Something else". Default `share-experience`.
- LeadMagnetForm blurb: "Get occasional updates on chronic pain awareness, self-advocacy tools, and ways to take action, delivered to your inbox."
- Footer line: "Chronic pain awareness, self-advocacy, and practical tools for being heard." Footer disclaimer: "TJR Mind & Body offers awareness and self-advocacy information from lived experience. It does not provide medical advice, diagnosis, or treatment, and does not claim to cure or treat any condition."
- Page body disclaimer on `get-involved`: "This is an individual voice, not an official body or a substitute for medical advice."

- [ ] **Step 1: Write the failing test** `advocacy-copy.test.ts` reading these files as text: `src/app/page.tsx`, `src/app/get-involved/page.tsx`, `src/app/coming-soon/page.tsx`, `src/components/{ContactForm,LeadMagnetForm,SiteHeader,SiteFooter}.tsx`, `src/lib/site.ts`, `content/pages/*.md`. Assertions: `it('contains no coaching language')` (`/\bcoach/i` absent); `it('contains no cure or treatment promises')` (`/\b(cure|heal your|guarantee)/i` absent, allowing the existing disclaimer sentence "does not claim to cure or treat" via an explicit allowance for that exact phrase); `it('contact form offers no coaching inquiry')` asserting `value="coaching"` absent and `share-experience` present; `it('names no employer, hospital or clinician')` asserting none of `/hospital|clinic|Dr\.? /i` appear in `content/pages/*.md`.
- [ ] **Step 2: Run** `npx vitest run src/lib/__tests__/advocacy-copy.test.ts`. Expected: FAIL (coaching language still in homepage, forms, footer, `site.ts`, pages).
- [ ] **Step 3: Implement** the file moves with `git mv`, apply the copy decisions above to the forms, footer and page, and re-enable the nav route test. Grep for remaining links to `/lets-chat` and `/approach` in `src/` and `content/` (`grep -rn "lets-chat\|/approach" src content`) and repoint each to `/get-involved` or `/about`.
- [ ] **Step 4: Run** `npx vitest run`. Expected: `advocacy-copy` still FAILS only on homepage, `site.ts`, `coming-soon` and `about.md`/`privacy-policy.md`/`terms-conditions.md` if they contain coaching language (fixed in Task 5); `nav`, `redirects` and `sitemap` tests PASS.
- [ ] **Step 5: Commit** `git add -A public-site && git commit -m "feat(get-involved): replace coaching contact page and forms"`

### Task 5: Homepage, About, site config, and final guards

**Files:**
- Modify: `public-site/src/app/page.tsx`, `public-site/content/pages/about.md`, `public-site/src/lib/site.ts`, `public-site/src/app/coming-soon/page.tsx`
- Modify: `public-site/content/pages/privacy-policy.md`, `terms-conditions.md` only where they say coaching
- Test: `public-site/src/__tests__/middleware.test.ts`

**Interfaces:**
- Consumes: `middleware(request: NextRequest)` from `@/middleware`.

Copy decisions (wording is my call; Tim reviews in the PR):
- `site.tagline` = the positioning line, verbatim.
- Homepage hero: kicker "Chronic pain awareness and advocacy"; H1 "Be heard. Be understood. Be prepared."; sub "Tools and a lived-experience voice for people with persistent pain, and for the people who want to understand it."; disclaimer "Awareness and self-advocacy from lived experience, not medical advice." Buttons: "Understand your pain" → `/pain/understand`, "Get involved" → `/get-involved`.
- Replace the Mind / Body / Resilience pillars with three: "Understand" (the Pathway), "Speak up" (preparing for appointments; link to `/pain/plan` until phase 3), "Take action" (describe awareness and advocacy; no link until phase 4, so render as non-link text, not a dead link). Keep the lead-magnet and "Latest from the Library" blocks; the Library block already hides when empty.
- Remove the founder-story block that references coaching; keep the three founder photos in a section titled "A lived-experience voice" with a link to `/about` and a one-line note that Tim's story is coming. Do not include story or health details.
- `about.md` (short, "Who I am and who I am not"): Tim lives with chronic pain and has for most of his life; works in operational resilience in a corporate role and does this advocacy alongside it; is not a clinician, not a peak body, not Painaustralia; link to Painaustralia (`https://www.painaustralia.org.au/`) as the national peak body. No health detail beyond "lives with chronic pain". Keep front-matter `seo.description` consistent with the positioning.
- `coming-soon/page.tsx`: replace the coaching sentence with a one-line advocacy description; keep `robots: noindex`.

- [ ] **Step 1: Write the failing middleware test** `middleware.test.ts`: with `process.env.VERCEL_ENV = 'production'`, `middleware(new NextRequest('https://x.test/about'))` returns a redirect (`status` 307) whose `location` ends with `/coming-soon`; `/coming-soon`, `/robots.txt` and `/api/contact` pass through (no redirect); with `VERCEL_ENV = 'preview'`, `/about` passes through.
- [ ] **Step 2: Run** `npx vitest run src/__tests__/middleware.test.ts`. Expected: PASS already (lock unchanged); this pins the Global Constraint. If it FAILS, stop and report; do not edit the middleware.
- [ ] **Step 3: Apply** the copy decisions to the homepage, About, `site.ts`, `coming-soon` and the policy pages.
- [ ] **Step 4: Run** `npm run lint && npm test && npm run build`. Expected: all PASS, including `advocacy-copy`; build lists `/get-involved`, `/about` and no `/approach` or `/lets-chat` page routes.
- [ ] **Step 5: Commit** `git add -A public-site && git commit -m "feat: reposition homepage, about and site config for advocacy"`

### Task 6: Verify and unlink off-mission content

**Files:**
- Modify: whichever file links to `/discover-your-capacity`, the planner or the climate download (found by grep). If nothing links to them, change nothing.

- [ ] **Step 1: Run** `grep -rn "discover-your-capacity\|groundwork-planner\|climate-resilience-package" src content ../products` and list every public link to them.
- [ ] **Step 2: Remove** each public link or reference (keep `src/app/discover-your-capacity/**`, `products/` and `public/downloads/` untouched; the capacity route is already `noindex` and private).
- [ ] **Step 3: Run** `npm run lint && npm test && npm run build`. Expected: all PASS.
- [ ] **Step 4: Check the Vercel preview** for the branch: `/`, `/about`, `/get-involved`, `/pain/understand`, `/pain/care`, `/pain/capacity`, `/pain/flare`, `/pain/plan` each load with the new menu and no coaching language. Redirects: `/approach` and `/lets-chat` land on live pages. Note anything off in the PR for Tim.
- [ ] **Step 5: Commit** (only if files changed) `git commit -am "chore: unlink off-mission tools from public pages"`, then push and update PR #6 with a summary and the copy for Tim to review.

### Task 7: CI and branch-protection handoff (runs after Task 6 and the final review)

**Files:** none expected. `.github/workflows/ci.yml` must stay unchanged unless a script, path, dependency or build command changed (none in phase 1; the only tooling change is `esbuild.jsx` in `vitest.config.mts`, which CI's `npm test` already covers).

**Verified state as of 21 Nov 2026 (from Tim):** CI runs on pull requests and pushes to `main`; required check is `test-and-build`; `main` is protected (strict required checks, admin enforcement, no force pushes, no branch deletion, PR workflow); latest `main` run passed ("ci: test and build the public site (#4)"); CI has passed on `claude/dazzling-albattani-h8huus`.

- [ ] **Step 1: Confirm CI is untouched.** Run `git diff origin/main -- .github/workflows/ci.yml`. Expected: empty. Confirm the job id/name in the file is still `test-and-build`.
- [ ] **Step 2: Run the CI commands locally** from `public-site/`: `npm ci && npm run lint && npm test && npm run build`. Expected: all exit 0.
- [ ] **Step 3: Confirm the check on the final PR head.** After the last push, read PR #6's check runs and confirm `test-and-build` is completed and successful on the head SHA of the final commit (not an earlier commit). If it failed, fix the root cause; never skip or disable the check.
- [ ] **Step 4: Stop for Tim's approval to merge.** Tim reviews the draft copy in PR #6 (homepage, About, forms, footer, policy pages) and the personal details in the design doc, and says to merge. Mark the PR ready for review first if it is still a draft.
- [ ] **Step 5: Merge through the pull request only**, never a direct push to `main`. Do not use any admin bypass.
- [ ] **Step 6: Confirm the merged `main` workflow passed** (the push-to-`main` run of `test-and-build`). Expected: success.
- [ ] **Step 7: Confirm protection is intact.** Do not edit protection settings. If the tools available cannot read branch protection, say so and ask Tim to confirm in repo settings that: required check `test-and-build` (strict), admin enforcement, force pushes disabled, branch deletion disabled, PR workflow all remain on.

Acceptance: the final PR commit has a passing `test-and-build`; tests and production build both pass; `main` remains protected with force pushes and branch deletion disabled; the merged `main` workflow passes.

---

## Self-review

- **Spec coverage (phase 1, sections 5, 6, 8):** positioning line (Tasks 4, 5); nav change (Task 1); "Let's Chat" → "Get involved" (Task 4); homepage hero and pillars (Task 5); approach retired and parked (Task 3); off-mission unlinked (Task 6); Pathway nav fixed (Task 2); `/coming-soon` lock kept (Task 5). Phases 2 to 6 and the story page are intentionally excluded, so My Story, Speak Up and Take Action are not in the nav.
- **Type consistency:** `navLinks`, `ctaLink`, `footerLinks` and `NavLink` are defined in Task 1 and consumed only by `SiteHeader`/`SiteFooter`. `PathwayRail({ current })` signature matches `PathwayNavigation.tsx`.
- **Proportion:** the plan has six tasks of mostly copy and wiring; code blocks are limited to test intent and signatures.
- **Known risks:** the `advocacy-copy` test is a blunt file scan (it can false-positive on legitimate words); the Task 2 renderToStaticMarkup test depends on `react-dom/server` working under Vitest's node environment; hero and about copy is my draft and may need several rounds with Tim.

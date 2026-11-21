# Advocacy pivot: design

Status: **draft for approval.** Nothing in this document has been built.
Date: 2026-11-21
Owner: Tim

## 1. Intent and why

TJR Mind & Body currently presents as a resilience coaching and educational
business. Tim wants to move away from that concept for now and focus on
**chronic pain awareness and advocacy**: helping people with persistent pain be
heard, be better prepared to speak up, and be better understood by others.

Tim has lived with pain for most of his life (scoliosis-related pain from age
12, multiple spinal surgeries, ICU stay, implant failure and revision, ongoing
injections and nerve treatments). Telling that story is a core part of the
advocacy, not a side feature. He still works in corporate operational
resilience and does this work alongside it.

Tim's own words that anchor the direction:

- He felt unheard when clinicians discussed his case without including him.
- He still finds it hard to advocate for himself in the medical system, for
  fear of being dismissed.
- The point of the story is "me too": readers should recognise themselves, not
  see a recovery triumph. There was no single breakthrough.

## 2. Goals, non-goals, anti-goals

**Goals**

- Reposition the site from coaching to chronic pain awareness and advocacy.
- Make Tim's story a first-class, central part of the site.
- Help visitors feel less alone and be better prepared to self-advocate.
- Give visitors credible, low-effort ways to take action and spread awareness.
- Reuse the existing Persistent Pain Pathway as the practical core.

**Non-goals (for now)**

- Offering or selling coaching.
- Becoming a peak body, charity, or fundraising entity.
- Medical, diagnostic or treatment advice.
- Open community storytelling (visitor submissions) before safeguards exist.

**Anti-goals (would make this a failure even if it works technically)**

- A recovery-triumph or "inspiring survivor" framing.
- Anything that reads as recommending or rating a treatment.
- Publishing details Tim later cannot take back or is not comfortable with.
- Implying the site speaks for Painaustralia or any official body.
- Naming Tim's employer, hospitals or clinicians.

## 3. Current state (what exists)

- Next.js 14 site in `public-site/`, Git-based CMS (Sveltia), content as
  Markdown. Library collection is empty.
- Production is locked to `/coming-soon` by `src/middleware.ts`; previews and
  local builds show the full site. This allows restructuring before launch.
- Coaching framing in: homepage hero, pillars (Mind / Body / Resilience),
  `content/pages/about.md`, `approach.md`, `lets-chat.md`, the contact form,
  footer, SEO descriptions, `lib/site.ts` tagline.
- Strongest asset: the Persistent Pain Pathway (`/pain/*`, five steps),
  Australian, no clinical claims, profile data local to the device unless the
  user saves it.
- Pathway nav is inconsistent: the Care and Capacity side menus omit "My plan".
- Not aligned with the new focus: `/discover-your-capacity` (private
  assessment), `products/groundwork-planner`, the climate-resilience download.
- Reusable: CMS, Mailchimp subscribe, contact form, RSS, sitemap, Instagram
  highlights, founder photos.

## 4. Approaches considered

1. **Reposition in place (chosen).** Keep the codebase, brand name and
   Pathway. Rewrite copy and navigation, add a story page and an advocacy
   section in phases. Lowest risk and cost; reuses what exists.
2. **New advocacy brand and site.** Cleaner message, but discards the working
   Pathway, CMS and SEO groundwork and delays launch. Rejected for now.
3. **Pathway-only microsite.** Fast, but it drops the story and the action
   layer, which are what make this advocacy and not another resource list.
   Rejected.

Decision: approach 1. Tim approved the direction in conversation; this is
recorded here as his decision. Keeping the "TJR Mind & Body" name is my call
and can be revisited.

## 5. Positioning

"Chronic pain awareness and advocacy: helping people be heard, and helping
others understand." Tim's lived experience is the voice. Operational
resilience is the method (preparing, responding, recovering) applied to
navigating the system. Coaching language is removed. At most there is a short
"not currently offering coaching" note if needed.

## 6. Information architecture

Primary navigation (replaces About / Approach / Library / Pain Pathway):

| Item | Purpose |
|---|---|
| Understand Pain | Pathway steps 1 and 2 reframed, plus sourced facts |
| Speak Up | Self-advocacy toolkit: appointment preparation, pain story worksheet, My Pain Plan, flare card |
| My Story | Tim's story (see section 7) |
| Take Action | Contact your MP, consultations, awareness kit, links to Painaustralia campaigns |
| About | Short "who I am and who I am not" page |

Other changes:

- "Let's Chat" becomes "Get involved" (share your story, volunteer, collaborate),
  not coaching enquiries.
- Homepage hero: a "Does this sound familiar?" lead into the story, then Speak
  Up and Take Action. Pillars (Mind / Body / Resilience) replaced.
- `approach.md` is retired or folded into About. The REVS and Resilience Cycle
  material is parked, not deleted.
- `/discover-your-capacity`, Groundwork Planner and the climate download are
  unlinked from public navigation; code is kept.
- Pathway navigation made consistent across all five steps and linked from
  Speak Up.

## 7. Tim's story: design

**Page:** `/my-story`, in the main navigation.

**Structure:** story of self, story of us, story of now (a common advocacy
narrative structure; from general knowledge, not from a cited source in this
project).

- Self: onset at 12, the surgeries, ICU, implant failure, what was tried.
- Us: what many people with persistent pain share: being disbelieved, being
  talked about and not with, isolation, mental health alongside pain.
- Now: the current stretch, Tim's reason for advocacy, and the reader's next
  step.

**Layers:** a 50-word summary for bios; a 300-word version for the homepage
and social; the full page; later a short video or audio piece and a
speaker/media kit. A "My timeline" section sits below the main story, expandable,
for readers who want the specifics.

**Relatability rules:**

- Open with the shared experience, not the career.
- List what was tried without ranking it. Say what happened for Tim, never
  what others should do.
- Name the rarely-said parts: being disbelieved, grief, anxiety and depression,
  the guilt of cancelling.
- Keep "no single breakthrough". The ending is honest and unresolved.
- Show the present tense, including flares.

**Tim's decisions (from conversation):**

- Level of detail: detailed.
- Operational resilience career until redundancy, which gave time to heal;
  currently back in a corporate operational resilience role, with advocacy
  alongside.
- Current treatments described as "injections and nerve treatments".
- Describe the duration as "for most of my life".
- Location, ICU stay, years and redundancy may be public.
- Employer is not named anywhere.
- First surgery was stopped because spinal cord monitoring stopped working and
  staff suspected a problem; cement was used in a later surgery because screws
  were loosening.
- Source document: Tim's Google Doc "My Authentic Story", last edited April
  2025. It is a source only and is not modified. It is stale on current status.

**My calls (to be checked by Tim):**

- Alternative therapies are written as "short-term relief for me", never as
  what works.
- Hospitals and clinicians are not named.
- A content note and Australian support lines (Lifeline 13 11 14, Beyond Blue
  1300 224 636) sit at the top of the page. Numbers to be re-verified before
  launch.
- The story is dated and reviewed yearly.
- The reason for moving to advocacy is left as a gap for Tim to fill in his own
  words. It is not invented.

**Open:** Tim's reason for advocacy now; current treatment status once he has
recovered; whether the hospital photo appears on the homepage or only on the
story page.

## 8. Phasing

1. **Reposition.** Rewrite homepage, About, nav, footer, contact page, SEO
   descriptions and `lib/site.ts`. Fix Pathway nav. Unlink off-mission
   content.
2. **My Story.** Build `/my-story` and the timeline from the approved copy,
   plus the consent and safeguards page.
3. **Speak Up.** Package the existing Pathway pieces as printable
   self-advocacy tools; add "how to be heard in an appointment".
4. **Take Action and awareness.** MP letter and consultation templates, a
   shareable fact sheet with dated, cited statistics, a September awareness
   page linking to Painaustralia.
5. **Community stories.** Open submissions only after the consent policy and a
   review process exist.
6. **Measure.** Replace the generic subscribe form with an advocacy list
   ("one action a month") and track actions taken.

## 9. Safeguards and constraints

- **Privacy.** The CMS commits directly to GitHub, so anything published is
  public and hard to retract. Tim reviews the final copy before it is
  committed. Visitor-submitted stories are never stored in this repo.
- **Consent for any future visitor stories:** ongoing consent, right to
  withdraw, choice of how to be identified, no use for fundraising without
  explicit permission, review before publishing, support signposting.
- **Accuracy.** Statistics are dated and sourced. Surgery detail is checked
  against Tim's records before publication.
- **Boundaries.** Educational and self-advocacy content only; no diagnosis or
  treatment advice. The Pathway's treatment-sensitive wording still needs the
  clinical review flagged in `docs/persistent-pain-pathway-prototype.md`.
- **Voice.** An individual voice, not an official body. Link to and amplify
  Painaustralia instead of competing with it.
- **Employment.** Tim should check whether his contract or social media policy
  covers public advocacy. The employer is not named.
- **Emotional cost.** Drafting happens in short sessions; Tim sets limits on
  public replies.
- **Production lock.** The `/coming-soon` middleware stays on until Tim chooses
  to launch.

## 10. Research notes (not verified beyond search results)

- Painaustralia's consultation found consumers wanted self-advocacy kits, a
  consumer advocacy strategy and trained peer mentors, and named timely,
  affordable, multidisciplinary care as a priority.
- International Pain Awareness Month is in September. Painaustralia's Wear Red
  for Pain was 1 September in 2026 and 19 September in 2025; check dates before
  planning a 2027 campaign.
- Ethical storytelling guidance converges on ongoing consent, withdrawal, control
  of identity and use, avoiding sensationalism, and support before and after.
- Research on pain advocates notes emotional cost, unequal partnerships, and
  payment for involvement widening participation.

## 11. Left to the builder

- Exact copy for every page beyond the story, using the tone of the existing
  Pathway.
- Component and layout decisions within the current Tailwind and Next.js setup.
- URL redirects for retired pages, and sitemap and SEO updates.
- Test updates for changed routes (`sitemap.test.ts`, collection tests).
- The Mailchimp and contact-form changes needed for "Get involved".

## 12. Approval

Not approved yet. When Tim approves, the next step is an implementation plan
(phase 1 first). No product code is written until then.

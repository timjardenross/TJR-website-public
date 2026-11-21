# Publishing Guide

This is for whoever is writing content. You do not need to know code or Git, but
you do need a GitHub account with access to the repository. Posts are edited in
[Pages CMS](https://pagescms.org) (see `CMS-SETUP.md` for connecting it).

## Writing a blog post

1. Open the repository in Pages CMS and pick your working **branch** (not `main`;
   see "Saving and publishing" below).
2. Open **Blog posts**, then click **Add an entry**.
3. Fill in:
   - **Title** — required.
   - **Date** — used for sorting and the published date shown on the page.
   - **Draft** — on by default. While it is on, the post is saved but **not shown
     on the public site**. Turn it off to publish.
   - **Summary** — one or two plain sentences. Shown on listing cards, in search
     results, and as the fallback social-share description.
   - **Tags** — optional, used for tag pages, related posts and search.
   - **Main image** and **Main image description** — optional. Describe the image
     for people who cannot see it.
   - **Author** — filled in for you.
   - **Search and sharing** — optional **Search description** (overrides the
     summary for search engines) and **Hide from search engines**.
   - **Post** — the post itself, in the rich-text editor. Use headings (they
     build the on-page table of contents), lists, links, quotes and images. The
     **Source** view shows the underlying Markdown if you want it.
4. Save. This commits the post to your branch.

## Saving and publishing

`main` is protected: pull requests are required and the `test-and-build` check
must pass, so Pages CMS cannot save straight to `main`.

1. **Save on a branch.** Every save is a commit on the branch you chose in Pages CMS.
2. **Open a pull request** on GitHub from that branch into `main` when you are ready.
3. **Wait for the checks**, then **merge**. The site rebuilds and deploys. There is no
   separate "deploy" step, and a published post is typically live within a minute or
   two of merging.
4. Keep **Draft** on until the moment you want the post public.

Every change is a Git commit, so full history is kept and any past version can be
recovered (see `DISASTER-RECOVERY.md`).

## Editing an existing post

Open **Blog posts**, click the entry, edit and save on a branch, then open a pull
request as above.

## Images

Upload images in the **Main image** field or with the editor's image button. Uploads
are committed into the repo under `public-site/public/uploads/` and served from
`/uploads/...`, with no external image host.

## Standalone pages, Instagram highlights and access codes

These are not in the editor. Edit the Markdown files directly on a branch and merge
through a pull request:

- **Standalone pages**: `public-site/content/pages/` (for example `about.md`
  becomes `/about`). They have no categories, tags or related-posts sidebar.
- **Instagram highlights**: `public-site/content/instagram-highlights/`. Each file is a
  selected post, not a live feed. Set `active: false` to hide one without deleting it.
  The homepage and Library page show up to three active highlights.
- **Discover Your Capacity access codes**: `public-site/content/discover-capacity-codes/`.

**Reserved names** — a few slugs are off-limits because the site already uses that
URL for something else:

- Any post slug of exactly `rss.xml` — that URL is the collection's own RSS feed.
- A **standalone page** slug cannot be `admin`, `search`, `search-index.json`,
  `rss.xml`, `sitemap.xml`, `robots.txt`, or a collection name such as `library`.
  Those routes always take priority, so a colliding page would silently never appear.

If you hit one of these the file still saves, but it will not appear on the live site,
and a build-log warning names the file to rename.

## Tags and search

Tags are not managed in a separate list. A new tag is created the first time you type
it into a post. Tag pages and the sitewide `/search` page pick up new values on the
next deploy with no extra step.

Older posts may carry extra front-matter fields that the short form does not show.
They are kept when you save.

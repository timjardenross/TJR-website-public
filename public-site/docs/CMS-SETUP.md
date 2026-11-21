# CMS Setup — Pages CMS

Blog posts are edited in [Pages CMS](https://pagescms.org), a free, open-source
editor that works directly on the Markdown files in this repository. There is no
separate content database and nothing to host or configure on the website itself:
no login code, no secrets, no environment variables.

## How it fits together

- **The editor** is the hosted app at `app.pagescms.org`. You sign in with GitHub.
- **The configuration** is one file, `.pages.yml`, at the repository root. Pages CMS
  reads it from whichever branch you are editing, so changes to the form go through
  a pull request like any other change.
- **The content** is the Markdown files in `public-site/content/`. Posts live in
  `public-site/content/library/` and appear on the site at `/library/<slug>`.
- **Uploaded images** are committed to `public-site/public/uploads/` and served from
  `/uploads/...`.

## Connecting the repository

1. Go to `app.pagescms.org` and sign in with GitHub.
2. When Pages CMS asks for access, **check the permission screen** before you
   approve. Pages CMS needs permission to read and write repository contents.
   Install it on **this repository only** (`TJR-website-public`), not on all of
   your repositories.
3. Open the repository. Do **not** use the "create from a template" options; they
   create a new, separate repository.
4. Use the **branch selector** to pick the branch you are editing on.

You can review or narrow what Pages CMS can reach at any time in GitHub under
Settings → Applications.

## Saving: branch first, then a pull request

`main` is protected. Pull requests are required, and the `test-and-build` check
must pass before anything merges, so Pages CMS cannot save straight to `main`.

1. Edit on a branch (create one in the branch selector, or on GitHub).
2. Pages CMS saves each change to that branch as a commit.
3. When you are ready to publish, open a pull request from that branch into
   `main` on GitHub. The checks run.
4. Merge the pull request. The site rebuilds and deploys.

See `PUBLISHING-GUIDE.md` for the step-by-step version.

## What `.pages.yml` configures

- **Blog posts**: a short form (title, date, draft switch, summary, tags, main image
  and description, author, search description, and a rich-text post) over
  `public-site/content/library`. New posts start as drafts.
- **Media**: uploads go to `public-site/public/uploads` and are written into posts as
  `/uploads/...`.
- **Keep unknown fields**: `settings.content.merge: true` keeps any front-matter fields
  the form does not show, so saving a post never deletes them.

## What is not in the editor

Standalone pages (About, My Story and so on), Instagram highlights and the Discover
Your Capacity access codes are not configured in Pages CMS. Edit those Markdown files
through a pull request. Standalone pages are left out on purpose: My Story uses an
expandable `<details>` block, which a rich-text editor may not preserve.

## Adding a new content collection later

1. Add an entry to `collections` in `src/lib/collections.ts`.
2. Add a matching block under `content:` in `.pages.yml` with its
   `path: public-site/content/<key>`.
3. Create `content/<key>/` (Git will not track an empty folder, so commit a real
   entry or a `.gitkeep`).

No other code changes are required. See `ARCHITECTURE.md`.

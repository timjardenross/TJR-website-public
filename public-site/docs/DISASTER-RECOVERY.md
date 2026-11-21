# Disaster Recovery Notes

## What's at risk, and what isn't

Because this is a Git-based CMS with no external database:

- **All content, media and configuration live in the `TJR-website-public` GitHub
  repository.** There is no separate content database to lose. As long as
  the GitHub repo exists, the entire content platform (every article,
  image, and CMS config) can be reconstructed.
- **Every edit is a Git commit.** Full history of every article — every
  draft, every publish, every past version — is preserved in Git history
  under `public-site/content/`. Nothing is ever silently overwritten.
- **The deployed site is fully static (SSG).** If Vercel is unreachable,
  the last successful deployment continues serving from Vercel's edge
  cache/CDN until a new deploy succeeds.

## Recovering a deleted or corrupted article

```bash
# Find the last commit that touched the file:
git log --follow -- public-site/content/library/my-post.md

# Restore it from a specific commit:
git checkout <commit-sha> -- public-site/content/library/my-post.md
git commit -m "restore: recover my-post.md"
git push
```

## Recovering from a bad deploy

Vercel keeps every previous deployment. In the Vercel dashboard:
Project → Deployments → find the last known-good deployment → **Promote to
Production**. This is instant and doesn't require a new Git commit.

To fix the underlying code/content and redeploy properly:

```bash
git revert <bad-commit-sha>
git push
```

## Cutting off or recovering Pages CMS access

Pages CMS reaches the repository through a GitHub app authorised on your account. If
you lose a device, suspect a compromised account, or simply want to stop the editor
working:

1. GitHub → Settings → Applications. Open **Pages CMS** and **Revoke** it (or, under
   installed apps, **Configure** it to narrow which repositories it can reach).
2. To restore access, sign in again at `app.pagescms.org` and approve the permission
   screen, installing it on `TJR-website-public` only.

No content or media is affected: revoking access only stops edits through the editor.
Protected `main` and the required `test-and-build` check still apply to anything that
reaches the live site.

## Recovering uploaded media

Uploaded images live under `public-site/public/uploads/` in Git, same as
content — they're recovered the same way as any other file (`git log` /
`git checkout <sha> -- <path>`). There is no separate media host to worry
about losing access to.

## Full repository loss

If the GitHub repository itself were somehow lost:

- Anyone with a local clone (including this repo's collaborators, and any
  CI/CD runner that has checked it out) has a complete copy of content
  history up to their last fetch.
- Vercel also retains the source it built from for each deployment for a
  period of time (see Vercel's own retention policy) — sufficient as a
  secondary recovery path in the worst case, though GitHub itself (with
  standard GitHub-side backups) is the primary source of truth and the
  first thing to restore before anything else.

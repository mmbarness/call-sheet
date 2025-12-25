# Review Sandbox

This repo is set up as a sandbox for reviewing external code.

## Fetching repos for review

Download repos as tarballs (no git nesting issues):

```bash
curl -sL https://github.com/OWNER/REPO/archive/refs/heads/main.tar.gz | tar -xz -C reviews/
```

This extracts to `reviews/REPO-main/` with no `.git` folder.

For a different branch:
```bash
curl -sL https://github.com/OWNER/REPO/archive/refs/heads/BRANCH.tar.gz | tar -xz -C reviews/
```

## Directory structure

- `reviews/` - External repos go here (gitignored)
- Everything else - Legacy code, ignore it

## Workflow

1. User provides a GitHub repo URL or `owner/repo`
2. Fetch the tarball into `reviews/`
3. Analyze/review as requested

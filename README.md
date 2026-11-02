# Mister Pandit Website

A responsive static website built with HTML, CSS, and JavaScript. It has no
runtime dependencies or package installation step.

## Run locally

From this folder, start a local server:

```powershell
python -m http.server 4173
```

Then open <http://localhost:4173>.

## Build the deployable site

Use Node.js to create the production output:

```powershell
node build.mjs
```

The script creates `dist/` with only the site entry point, styles, JavaScript,
assets, and Cloudflare response headers. Repository documentation and Git files
are kept out of the published output.

## Cloudflare Pages

Connect this GitHub repository to Cloudflare Pages and use:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `node build.mjs` |
| Build output directory | `dist` |
| Root directory | Repository root (default) |

Cloudflare Pages will build and publish each update to `main`. The build copies
the root `_headers` file into `dist`, so the configured security and caching
headers are applied to the deployed site.

After the first deployment, add the GoDaddy-registered domain in the Pages
project's **Custom domains** settings and follow the DNS instructions Cloudflare
provides. An apex domain requires the domain's nameservers to point to
Cloudflare. This repository does not change domain registration or DNS records.

## Current website behavior

- Browse and filter pandit profiles by ceremony, city, and ritual language.
- Save profiles in the current browser.
- Select ceremony details and see a local planning confirmation.
- Profile and ceremony information is currently static; authentication,
  payments, and booking submission need a backend integration before accepting
  real customer requests.

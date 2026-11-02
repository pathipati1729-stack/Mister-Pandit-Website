# Mister Pandit website preview

A lightweight, responsive sample website for the Pandit ceremony-booking idea. It uses plain HTML, CSS, and JavaScript so the demo can run without an account, API, database, or package installation.

## Run locally

Open index.html in a browser, or start a small local server from this folder:

    python -m http.server 4173

Then visit http://localhost:4173.

## What you can try

- Search sample pandit profiles by ceremony and city.
- Filter by ceremony, city, or ritual language.
- Save profiles in this browser.
- Choose a ceremony using artwork shared with the customer app.
- Open the planning form and preview a ceremony, date, time, location, place,
  and language selection.
- Use the responsive navigation and sample confirmation flow.

## Demo boundaries

The pandit profiles are fictional examples. The request form shows a local confirmation only; it does not send, store, or create a real booking. There is no live authentication, backend, payment, or contact with a pandit.

## Cloudflare Pages

This is a static site: `index.html`, `styles.css`, `app.js`, and `assets/` are
ready to serve from the repository root. No framework, package installation, or
build step is required.

For a Git-connected Cloudflare Pages project, use:

- Production branch: `main`
- Build command: `exit 0`
- Build output directory: `.`

The root `_headers` file supplies security and cache headers. After the first
Pages deployment, add the GoDaddy domain under the Pages project’s **Custom
domains** settings and use the DNS instructions Cloudflare provides. No domain
or DNS records are managed by this repository.

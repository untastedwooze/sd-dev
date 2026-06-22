# b2bandits

Sam Duffy's portfolio site — a small static site with no build step, no backend,
and no dependencies to install. It's plain HTML, CSS, and vanilla JavaScript
(ES6 modules). Chart.js and Google Fonts load from public CDNs.

## Structure

```
index.html            Landing page (links to the apps)
shared/               Shared site header (header.js / header.css)
apps/
  b2bandits/          Multi-Armed Bandit simulator (the main interactive demo)
  cv/                 Résumé / CV page
  talk.html           Talk page (embedded video)
```

All internal links are relative, so the site works at any URL root.

## Local preview

The pages use ES6 `import` modules, which browsers **refuse to load over
`file://`**. So don't open `index.html` directly — serve it over HTTP:

```bash
python -m http.server 8080
```

Then open <http://localhost:8080>. (Any static HTTP server works; this is just a
local convenience — nothing Python-related is deployed.)

## How to publish a change

The site is hosted on **GitHub Pages** and deploys automatically:

1. Edit files, commit, and push to `main`.
2. The **Deploy to GitHub Pages** GitHub Action
   (`.github/workflows/deploy-pages.yml`) runs and publishes the site.
3. The change is live in about a minute. Watch progress in the repo's
   **Actions** tab.

GitHub Pages serves the files over HTTPS — doing in production exactly what
`python -m http.server` does locally.

## One-time hosting setup

### 1. Enable Pages

In the repo: **Settings → Pages → Build and deployment → Source → GitHub
Actions**. After that, every push to `main` deploys via the workflow.

Without a custom domain the site is reachable at
`https://untastedwooze.github.io/b2bandits/`.

### 2. Register a custom domain (optional)

You don't need a domain to go live, but to use one, register a name at any
registrar — good options: **Cloudflare Registrar** (at-cost, but the domain's
nameservers must move to Cloudflare), **Porkbun**, or **Namecheap**. A `.com` is
typically ~$10–15/yr.

### 3. Point the domain at GitHub Pages (apex + www)

Once you own `yourdomain.com`, add **both** of these in the registrar's DNS
panel:

- **Apex** (`yourdomain.com`) — four `A` records to the GitHub Pages IPs:

  ```
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
  ```

  Optionally also the IPv6 `AAAA` records:

  ```
  2606:50c0:8000::153
  2606:50c0:8001::153
  2606:50c0:8002::153
  2606:50c0:8003::153
  ```

- **www** (`www.yourdomain.com`) — one `CNAME` record pointing to
  `untastedwooze.github.io`.

> **Using Cloudflare for DNS?** Set these records to **DNS-only (grey cloud)**,
> not proxied (orange cloud), so GitHub Pages can issue its own HTTPS cert.

### 4. Tell GitHub the domain

- Create a file named `CNAME` at the repo root containing **only** your apex
  domain, e.g.:

  ```
  yourdomain.com
  ```

- Then in **Settings → Pages → Custom domain**, enter `yourdomain.com`, wait for
  the DNS check to pass, and enable **Enforce HTTPS** (may take a few minutes
  while the certificate is provisioned).

With the apex in the `CNAME` file, GitHub serves `yourdomain.com` and
automatically redirects `www.yourdomain.com` → apex. DNS changes can take
minutes to a few hours to propagate.

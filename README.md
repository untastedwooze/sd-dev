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

### 2. Custom domain

The site uses **`samuelduffy.dev`**, registered at **Porkbun**. The repo-root
`CNAME` file already contains `samuelduffy.dev`, so GitHub serves the apex and
auto-redirects `www.samuelduffy.dev` → apex.

> **`.dev` is HTTPS-only.** The `.dev` TLD is on the browser HSTS preload list,
> so the site won't load over plain HTTP at all. GitHub Pages provisions HTTPS
> automatically, but expect a short window after DNS resolves where the cert
> isn't ready yet and the site won't load — then it works.

### 3. Point the domain at GitHub Pages (Porkbun DNS)

In Porkbun: **Domain Management → `samuelduffy.dev` → DNS / Edit records**.

First **delete Porkbun's default records** for the domain (the parking `ALIAS`
on the apex and the default `www` record) so they don't conflict. Then add:

- **Apex** — four `A` records. Host field **left blank** (= `samuelduffy.dev`),
  one record per IP:

  ```
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
  ```

  Optionally also four `AAAA` records (host blank) for IPv6:

  ```
  2606:50c0:8000::153
  2606:50c0:8001::153
  2606:50c0:8002::153
  2606:50c0:8003::153
  ```

- **www** — one `CNAME` record. Host = `www`, Answer = `untastedwooze.github.io`.

(Porkbun also supports an `ALIAS` record on the apex pointing to
`untastedwooze.github.io` as an alternative to the four `A` records — either
approach works.)

### 4. Finish in GitHub

In **Settings → Pages → Custom domain**, enter `samuelduffy.dev`, wait for the
DNS check to pass, then enable **Enforce HTTPS** (may take a few minutes while
the certificate is provisioned). DNS changes can take minutes to a few hours to
propagate.

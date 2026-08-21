# M2 Solution

One-page site for [M2 Solution](https://m2solution.ca) — Mathis Côté et Mathieu Laureti. We build digital tools for business.

Static HTML/CSS in `site/`, published to GitHub Pages from `main`. English at `/`, French at `/fr/`. Placeholder mark is `site/logo.png` — replace that file when you have the real logo.

## Preview locally

Open `site/index.html` in a browser, or serve the folder:

```bash
python3 -m http.server --directory site
```

Then visit http://localhost:8000.

## Deploy

Pushes to `main` run [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml), which uploads `site/` and deploys it with GitHub Actions.

You can also run the workflow by hand: Actions → Deploy GitHub Pages → Run workflow.

**Visibility:** this repo must be **public** for GitHub Pages on a free GitHub account. Private Pages need GitHub Pro (or Team).

Live URL: [m2solution.ca](https://m2solution.ca) (GitHub Pages fallback: https://thehaccon.github.io/mm_dev_website/)

## Custom domain (m2solution.ca)

`site/CNAME` is already set to `m2solution.ca`. After the domain is registered:

1. At the registrar (or DNS host), point the apex at GitHub Pages:

   | Type | Name | Value |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `thehaccon.github.io` |

2. In the repo: **Settings → Pages → Custom domain** → `m2solution.ca`, then enable **Enforce HTTPS** once the certificate is ready.
3. Set up mailbox or forwarding for `contact@m2solution.ca` (the address shown on the site). That is separate from Pages DNS.

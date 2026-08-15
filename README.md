# M2 Solutions

One-page site for [M2 Solutions](https://mathieulaureti.github.io/mm_dev_website/) — Mathieu Laureti et Mathis Côté. We create web solutions for business.

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

Live URL until a custom domain is set: https://mathieulaureti.github.io/mm_dev_website/

## Custom domain (later)

After the domain is bought:

1. Add a `CNAME` file in `site/` with the domain (for example `m2solutions.com`).
2. Point DNS at GitHub Pages.
3. Set the custom domain in the repo: Settings → Pages.

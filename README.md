# Skrautás

Website for Skrautás ehf., publisher of Grafarvogsblaðið, Árbæjarblaðið and Grafarholtsblaðið. People use it to open and download the papers. The pages are built with Eleventy and published by GitHub Pages. Homepage text, contact details, and issues are edited in Decap CMS at `/admin`.

## Edit the site

The owners publish from `/admin`. They do not edit code.

To add an issue:

1. Open `/admin` and sign in.
2. Choose the paper, for example **Grafarvogsblaðið**.
3. Open the year, for example **2026**. The newest year is at the bottom of the list.
4. Click **Add Tölublað**.
5. Type the issue number and paste the Issuu link.
6. Click **Publish**.

A new year is **New Ár** inside that paper. Phone and email addresses are under **Sími og netföng**. The short homepage text is under **Texti á forsíðu**. A whole year cannot be deleted from the editor.

Decap writes to this repository. A push to `main` rebuilds the site.

Sign-in needs a small login service, because GitHub Pages cannot keep the OAuth secret. This site uses the same Cloudflare Worker as Tilveran. Until that service allows this site, the public pages still build. Only `/admin` login waits on it.

## Work locally

```bash
npm install
npm start
```

Open `http://localhost:8080`.

## What has to be done in GitHub and Cloudflare

1. Make this repository public if the GitHub account is on the free plan. GitHub Pages on a free account publishes public repositories. Making the repository public does not let strangers edit it.
2. In the repository, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. Commit these files and push them to `main`. The workflow publishes the site, usually at `https://flickers.github.io/skrautas/`.
4. The login service is the [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) Worker already used for Tilveran: `https://sveltia-cms-auth.flickers.workers.dev`. It works with Decap.
5. On that Worker, `ALLOWED_DOMAINS` must include `flickers.github.io`. When the real domain is connected, add `www.skrautas.is` and `skrautas.is` as well.
6. The GitHub OAuth app behind the Worker must allow the Pages address. Its callback stays on the Worker: `https://sveltia-cms-auth.flickers.workers.dev/callback`.
7. Open `https://flickers.github.io/skrautas/admin/` and sign in with a GitHub user who can push to this repository.

Anyone who should publish an issue needs write access to `flickers/skrautas`. Do not turn on open authoring.

A custom domain is set in the Pages settings. The build picks up the site's path on its own. After the domain is connected, change `site_url` and `display_url` in `src/admin/config.yml` to `https://www.skrautas.is`.

## Content files

| What | File |
| --- | --- |
| Homepage text | `src/content/home.md` |
| Phone and email addresses | `src/_data/site.yml` |
| Paper names | `src/_data/papers.yml` |
| Issues, one folder per paper and one file per year | `src/volumes/` |

## Imported archive

The issues were copied from the previous site: 578 links, Grafarvogsblaðið and Árbæjarblaðið from 2006, Grafarholtsblaðið from 2020. They open the same Issuu publications as before. A few 2026 issues were listed twice under the same number. Both links are kept, and the second is marked as another edition. A handful of older links point at the same document as the issue next to them. Those can be corrected in the CMS.

Grafarholtsblaðið uses `gv@skrautas.is`, which is the address published on the previous website. Fjölmiðlanefnd lists `abl@skrautas.is` for that paper. Change it under **Sími og netföng** if the desk address should be the other one.

# shashankshirol.github.io

My personal website, built with [Astro](https://astro.build) and TypeScript and hosted on GitHub Pages.

## Run it

```bash
npm install
npm run dev
```

`npm run build` type-checks the project and writes the static site to `dist/`.

## Edit it

- **CV content** (experience, education, skills, links): `src/data/cv.ts`
- **Projects**: generated at build time from your public GitHub repositories (the newest three and the three most-starred). Counts, hidden repositories and custom names or descriptions are set in `src/data/projects.ts`. The Languages row under Skills comes from the same repositories. Re-run the deploy workflow to pick up changes made on GitHub.
- **Posts**: add a Markdown file to `src/content/writing/`. See `example-draft.md` for the format.
- **Colours and type**: the variables at the top of `src/styles/global.css`

## Deploy

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site and publishes it.
In the repository settings, Pages → Build and deployment → Source must be set to **GitHub Actions**.

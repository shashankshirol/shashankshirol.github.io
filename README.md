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

The site currently deploys to GitHub Pages: pushing to `master` runs `.github/workflows/deploy.yml`.
It is also set up to run on Cloudflare Workers, which is what makes the blog paywall below possible.

## Charging AI agents for blog posts (x402)

`worker/index.ts` is a Cloudflare Worker that sits in front of `/writing/`. People in browsers and
ordinary search engines read posts for free. A visitor that identifies as an AI agent (the list is in
`worker/agents.ts`) gets `402 Payment Required` with [x402](https://x402.org) payment details, and
receives the post after paying. The list of posts and the RSS feed stay free.

GitHub Pages cannot do this, so the paywall only exists on the Cloudflare copy of the site.

Settings are under `vars` in `wrangler.jsonc`:

| Setting | Meaning |
| --- | --- |
| `PAY_TO` | Your wallet's public address. The paywall is off while this is empty. |
| `PRICE` | Price per post in US dollars, paid in USDC. |
| `NETWORK` | `eip155:84532` is Base Sepolia (testnet, play money). `eip155:8453` is Base (real money). |
| `FACILITATOR_URL` | The service that verifies payments. Must match the network. |

### Try it locally

```bash
cp .dev.vars.example .dev.vars
npm run worker
```

Then compare a browser with an AI crawler (use the address of a published post):

```bash
curl -i -A "Mozilla/5.0" http://localhost:8787/writing/my-post/
curl -i -A "GPTBot/1.2" http://localhost:8787/writing/my-post/
```

### Go live on Cloudflare

1. Create a free Cloudflare account.
2. Put your wallet's public address in `PAY_TO` in `wrangler.jsonc`. Stay on the testnet settings at first.
3. Run `npx wrangler login`, then `npm run deploy`. Wrangler prints the site's `workers.dev` address.
4. For automatic deploys on every push, add to this repository on GitHub:
   - variable `SITE_URL`: the address from step 3
   - secret `CLOUDFLARE_API_TOKEN`: a token made from Cloudflare's "Edit Cloudflare Workers" template
   - secret `CLOUDFLARE_ACCOUNT_ID`: shown on the Cloudflare dashboard
5. To take real payments, switch `NETWORK` to `eip155:8453` and `FACILITATOR_URL` to a production
   facilitator, then deploy again. Test with a small amount first.

### Retire the GitHub Pages copy

Until this is done, posts are also readable for free at `shashankshirol.github.io` and in this public repository.

1. Rename this repository (for example to `website`) and make it private.
2. Delete `.github/workflows/deploy.yml`.
3. Create a new public repository named `shashankshirol.github.io` containing one `index.html` that
   redirects to the Cloudflare address, so old links keep working.

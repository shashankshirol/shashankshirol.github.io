# shashankshirol.github.io

My personal website, built with [Astro](https://astro.build) and TypeScript. It is hosted on GitHub Pages for now and is moving to Cloudflare Workers; see the checklist at the end.

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

Today the site deploys to GitHub Pages: pushing to `master` runs `.github/workflows/deploy.yml`.
The plan is to move it to Cloudflare Workers, which is what makes the blog paywall possible.
The checklist for that move is at the end of this file.

## Charging AI agents for blog posts (x402)

`worker/index.ts` is a Cloudflare Worker that sits in front of `/writing/`.

- People in browsers and ordinary search engines read posts for free.
- A visitor that identifies as an AI agent (the list is in `worker/agents.ts`) gets
  `402 Payment Required` with [x402](https://x402.org) payment details, and receives the post after paying.
- The home page, the list of posts and the RSS feed are always free.

GitHub Pages cannot do this, so the paywall only exists on the Cloudflare copy of the site.

Settings are under `vars` in `wrangler.jsonc`:

| Setting | Meaning |
| --- | --- |
| `PAY_TO` | Your wallet's public address. The paywall is off while this is empty. |
| `PRICE` | Price per post in US dollars, paid in USDC. |
| `NETWORK` | `eip155:84532` is Base Sepolia (testnet, play money). `eip155:8453` is Base (real money). |
| `FACILITATOR_URL` | The service that verifies and settles payments. Must match the network. |

Limits worth knowing:

- An agent that pretends to be a normal browser reads for free. Detection goes by the `User-Agent` it sends.
- Few crawlers pay x402 today, so most listed agents will simply be turned away.

### Try it locally

```bash
cp .dev.vars.example .dev.vars
npm run worker
```

Then compare a browser with an AI crawler, using the address of a published post
(drafts are not built, so `example-draft` will not work):

```bash
curl -i -A "Mozilla/5.0" http://localhost:8787/writing/my-post/
curl -i -A "GPTBot/1.2" http://localhost:8787/writing/my-post/
```

The first returns `200`, the second `402` with a `PAYMENT-REQUIRED` header.

## Checklist: move to Cloudflare and switch the paywall on

Work through these in order. The site keeps running on GitHub Pages until part 5.

### 1. Get a wallet address

- [ ] Create or pick an EVM wallet (MetaMask, Coinbase Wallet or similar). The same address works on
      the Base testnet and on Base mainnet.
- [ ] Copy its **public address** (starts with `0x`). Never put a private key or seed phrase in this repository.
- [ ] Paste the address into `PAY_TO` in `wrangler.jsonc`. Leave `NETWORK` and `FACILITATOR_URL` on
      the testnet values for now.

### 2. First deploy to Cloudflare

- [ ] Create a free account at [dash.cloudflare.com](https://dash.cloudflare.com).
- [ ] Log in from the terminal:

```bash
npx wrangler login
```

- [ ] Deploy. The first run may ask you to choose a `workers.dev` subdomain for your account.

```bash
npm run deploy
```

- [ ] Note the address Wrangler prints, in the form `https://shashankshirol.<your-subdomain>.workers.dev`.
- [ ] In `astro.config.mjs`, replace `https://shashankshirol.github.io` with that address, so links in
      the sitemap, RSS feed and page metadata point to the new home.
- [ ] Open the address in a browser and check the site looks right.

### 3. Check the paywall on testnet

- [ ] Publish at least one post: add a Markdown file to `src/content/writing/` without `draft: true`,
      delete `example-draft.md`, and run `npm run deploy` again.
- [ ] Check a browser gets the post and an AI crawler gets the payment request:

```bash
curl -i -A "Mozilla/5.0" https://YOUR-ADDRESS/writing/my-post/
curl -i -A "GPTBot/1.2" https://YOUR-ADDRESS/writing/my-post/
```

- [ ] Optional but recommended: make one real test payment. This needs a second, throwaway wallet
      holding free testnet USDC from the [Coinbase faucet](https://docs.cdp.coinbase.com/faucets/introduction/welcome)
      and a small script using an x402 client such as `@x402/fetch`, described in the
      [x402 quickstart for buyers](https://docs.x402.org/getting-started/quickstart-for-buyers).
      A successful payment returns the post and the test USDC arrives at `PAY_TO`.
      This step has not been tried yet; everything up to the `402` response has.

### 4. Deploy automatically on every push

In the GitHub repository, under Settings → Secrets and variables → Actions:

- [ ] Add a **variable** `SITE_URL` with the `workers.dev` address. This also switches the
      `Deploy to Cloudflare` workflow on.
- [ ] Add a **secret** `CLOUDFLARE_API_TOKEN`. Create it in Cloudflare under My Profile → API Tokens →
      Create Token, using the "Edit Cloudflare Workers" template.
- [ ] Add a **secret** `CLOUDFLARE_ACCOUNT_ID`. It is shown on the Workers overview page of the
      Cloudflare dashboard.
- [ ] Commit and push the changes from parts 1 to 3, then check that the `Deploy to Cloudflare`
      run in the Actions tab succeeds.

### 5. Retire GitHub Pages and hide the post sources

Until this is done, every post is also free to read at `shashankshirol.github.io` and as Markdown
in this public repository.

- [ ] Delete `.github/workflows/deploy.yml`, commit and push.
- [ ] In the repository settings, under Pages, unpublish the site.
- [ ] In the repository settings, under General → Danger Zone, change the visibility to **private**.
      On a free GitHub plan this also takes the Pages site down. GitHub Actions and the Cloudflare
      deploy keep working.
- [ ] Optional: rename the repository, since it no longer serves `shashankshirol.github.io`.
      If you do, update the remote locally with `git remote set-url origin <new address>`.
- [ ] Update the website link wherever it is used: GitHub profile, LinkedIn, CV, email signature.

The Projects section is unaffected: it only ever lists public repositories.

### 6. Take real payments

Only after part 3 works on testnet.

- [ ] In `wrangler.jsonc`, set `NETWORK` to `eip155:8453`.
- [ ] Set `FACILITATOR_URL` to a production facilitator, for example `https://facilitator.payai.network`
      or Coinbase's `https://api.cdp.coinbase.com/platform/v2/x402`. The testnet facilitator does not
      work on mainnet, and a production one may need its own account or API key; check its documentation.
- [ ] Set `PRICE` to what a post should cost.
- [ ] Commit and push (or run `npm run deploy`), then repeat the two `curl` checks from part 3.
      The `402` response should now name the `eip155:8453` network.

### Later, if you want it

- A custom domain: add it to the Worker in the Cloudflare dashboard under Settings → Domains & Routes,
  then update `SITE_URL` and `astro.config.mjs`.
- Changing who pays: edit the list in `worker/agents.ts`.

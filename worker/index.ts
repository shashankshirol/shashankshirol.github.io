// The Cloudflare Worker in front of the blog.
//
// Cloudflare serves the built site (./dist) directly. Requests under /writing/
// come through here first: people and ordinary search engines get the page as
// usual, while visitors that identify as AI agents (see agents.ts) are answered
// with "402 Payment Required" and the x402 payment details. Once an agent
// retries with a valid payment, it gets the post.
//
// Settings live under "vars" in wrangler.jsonc.

import { Hono, type MiddlewareHandler } from 'hono';
import { paymentMiddleware, x402ResourceServer } from '@x402/hono';
import { ExactEvmScheme } from '@x402/evm/exact/server';
import { HTTPFacilitatorClient } from '@x402/core/server';
import { isAiAgent } from './agents';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  /** Public wallet address that receives payments. The paywall is off while this is empty. */
  PAY_TO: string;
  /** Network in CAIP-2 form: eip155:84532 is Base Sepolia (testnet), eip155:8453 is Base (mainnet). */
  NETWORK: string;
  /** Price for one post, in US dollars, paid in USDC. For example "$0.01". */
  PRICE: string;
  /** The service that verifies and settles payments. */
  FACILITATOR_URL: string;
}

type Network = `${string}:${string}`;

// A post is /writing/<something>/. The list of posts at /writing/ stays free
// so that agents can see what there is to buy.
const isPost = (path: string) => /^\/writing\/[^/]+/.test(path);

let paywall: MiddlewareHandler | undefined;

function getPaywall(env: Env): MiddlewareHandler {
  if (!paywall) {
    const facilitator = new HTTPFacilitatorClient({ url: env.FACILITATOR_URL });
    const server = new x402ResourceServer(facilitator).register(env.NETWORK as Network, new ExactEvmScheme());
    paywall = paymentMiddleware(
      {
        'GET /writing/*': {
          accepts: [
            {
              scheme: 'exact',
              price: env.PRICE,
              network: env.NETWORK as Network,
              payTo: env.PAY_TO,
            },
          ],
          description: 'One blog post by Shashank Shirol',
          mimeType: 'text/html',
        },
      },
      server,
    );
  }
  return paywall;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', async (c, next) => {
  const charge = c.env.PAY_TO && isPost(c.req.path) && isAiAgent(c.req.header('user-agent'));
  if (!charge) return next();

  // Never ask for payment for a page that is not there.
  const probe = await c.env.ASSETS.fetch(new Request(c.req.url, { method: 'HEAD' }));
  if (probe.status !== 200) return next();

  return getPaywall(c.env)(c, next);
});

app.all('*', async (c) => {
  const page = await c.env.ASSETS.fetch(c.req.raw);
  // The answer depends on who is asking, so caches must not share it between visitors.
  const response = new Response(page.body, page);
  response.headers.append('Vary', 'User-Agent');
  return response;
});

export default app;

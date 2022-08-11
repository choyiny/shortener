import { Router } from "itty-router";

const router = Router();

export interface Env {
  SHORTENER_KV: KVNamespace;
  HOST_URL: string;
}

router.post("/", async (request: Request, env: Env) => {
  const json = await request.json();
  const longLink = json?.url;
  // generate a random slug - this is not cryptographically random but works in our case
  let slug = btoa(Math.random() + "").slice(0, 9);
  // generate a new slug if the previous one is already existing
  let existing = await env.SHORTENER_KV.get(slug);
  while (existing) {
    slug = btoa(Math.random() + "").slice(0, 9);
    existing = await env.SHORTENER_KV.get(slug);
  }
  // generate shortened URL and return to user
  await env.SHORTENER_KV.put(slug, longLink);
  return new Response(JSON.stringify({ url: `${env.HOST_URL}/${slug}` }), {
    headers: { "content-type": "application/json" },
  });
});

router.get("/:slug", async (request: Request, env: Env) => {
  const slug = request.params.slug;
  const redirectTo = await env.SHORTENER_KV.get(slug);
  return Response.redirect(redirectTo, 302);
});

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return router.handle(request, env, ctx).then((res: Response) => {
      console.log("HTTP Response", request.url, res.status);
      return res;
    });
  },
};

import { Router } from "itty-router";

const router = Router();

export interface Env {
  SHORTENER_KV: KVNamespace;
	HOST_URL: string;
}

router.post("/", async (request: Request, env: Env) => {
  // TODO: Post request to shorten a URL
});

router.get("/:slug", async (request: Request, env: Env) => {
  // TODO: redirect shortened URL to application URL
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

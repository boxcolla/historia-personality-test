declare module "cloudflare:workers" {
  export const env: Record<string, unknown>;
}

type D1Database = any;
type Fetcher = { fetch(request: Request): Promise<Response> };

import { authorizeSession } from "../../../../lib/access";

export async function GET(request: Request) {
  return Response.json({ authorized: Boolean(await authorizeSession(request)) });
}

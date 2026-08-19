import { authorizeSession } from "../../../../lib/access";
import { publicQuestions, type TestPreference } from "../../../../lib/test-data";

export async function GET(request: Request) {
  if (!await authorizeSession(request)) return Response.json({ error: "请先验证订单" }, { status: 401 });
  const url = new URL(request.url);
  const requestedPreference = url.searchParams.get("preference");
  const preference: TestPreference = requestedPreference === "female" || requestedPreference === "male" ? requestedPreference : "all";
  const retake = url.searchParams.get("retake") === "1";
  return Response.json({ questions: publicQuestions(preference, retake) });
}

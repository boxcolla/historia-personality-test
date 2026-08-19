import { authorizeSession, recordTestCompletion } from "../../../../lib/access";
import { calculateResult, QUESTION_SET_SIZE, questions } from "../../../../lib/test-data";

export async function POST(request: Request) {
  const session = await authorizeSession(request);
  if (!session) return Response.json({ error: "授权已失效，请重新验证" }, { status: 401 });
  const payload = await request.json().catch(() => ({})) as { questionIds?: number[]; answers?: number[]; preference?: "female"|"male"|"all" };
  const questionIds = payload.questionIds ?? [];
  const answers = payload.answers ?? [];
  const knownQuestionIds = new Set(questions.map(({ id }) => id));
  const hasInvalidQuestions = questionIds.length !== QUESTION_SET_SIZE
    || new Set(questionIds).size !== QUESTION_SET_SIZE
    || questionIds.some((id) => !knownQuestionIds.has(id));
  if (hasInvalidQuestions || answers.length !== QUESTION_SET_SIZE || answers.some((value) => !Number.isInteger(value) || value < 0 || value > 3)) {
    return Response.json({ error: "答题数据不完整" }, { status: 400 });
  }
  const result = calculateResult(questionIds, answers, payload.preference ?? "all");
  if (!await recordTestCompletion(session, request)) {
    return Response.json({ error:"体验次数已用完" }, { status:403 });
  }
  return Response.json({ result });
}

import type { CreateQuestionRequest, ErrorResponse } from "@/generated";
import { proxyCreateQuestion } from "@/lib/api-server";

export async function POST(request: Request) {
  let value: unknown;
  try {
    value = await request.json();
  } catch {
    return Response.json({ code: "INVALID_REQUEST", message: "Request body must be valid JSON." } satisfies ErrorResponse, { status: 400 });
  }
  if (!value || typeof value !== "object") {
    return Response.json({ code: "VALIDATION_ERROR", message: "Question data is invalid." } satisfies ErrorResponse, { status: 400 });
  }
  const item = value as Record<string, unknown>;
  if (typeof item.question !== "string" || !Array.isArray(item.alternatives) || item.alternatives.length !== 4 || !item.alternatives.every((answer) => typeof answer === "string") || typeof item.correctAlternativeIndex !== "number" || !Number.isInteger(item.correctAlternativeIndex)) {
    return Response.json({ code: "VALIDATION_ERROR", message: "Question data is invalid." } satisfies ErrorResponse, { status: 400 });
  }
  const body: CreateQuestionRequest = {
    question: item.question,
    alternatives: item.alternatives as [string, string, string, string],
    correctAlternativeIndex: item.correctAlternativeIndex,
  };
  return proxyCreateQuestion(body);
}

import "server-only";
import { createClient } from "@/generated/client";
import { createQuestion, getQuiz } from "@/generated";
import type { CreateQuestionRequest, ErrorResponse, Question, QuizResponse } from "@/generated";

const jsonHeaders = { "content-type": "application/json" };

function apiError(status: number, code: string, message: string): Response {
  return Response.json({ code, message } satisfies ErrorResponse, { status, headers: jsonHeaders });
}

function isErrorResponse(value: unknown): value is ErrorResponse {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.code === "string" && typeof item.message === "string";
}

function isQuestion(value: unknown): value is Question {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "number" && Number.isInteger(item.id) && item.id > 0 &&
    typeof item.question === "string" && item.question.length > 0 && item.question.length <= 500 &&
    Array.isArray(item.alternatives) && item.alternatives.length === 4 &&
    item.alternatives.every((answer) => typeof answer === "string" && answer.length > 0 && answer.length <= 200) &&
    typeof item.correctAlternativeIndex === "number" && Number.isInteger(item.correctAlternativeIndex) &&
    item.correctAlternativeIndex >= 0 && item.correctAlternativeIndex <= 3;
}

function isQuiz(value: unknown): value is QuizResponse {
  if (!value || typeof value !== "object") return false;
  const questions = (value as Record<string, unknown>).questions;
  return Array.isArray(questions) && questions.length === 10 && questions.every(isQuestion) && new Set(questions.map((item) => item.id)).size === 10;
}

function serverClient() {
  const baseUrl = process.env.KTOR_BASE_URL;
  if (!baseUrl) return null;
  return createClient({ baseUrl });
}

export async function proxyQuiz(): Promise<Response> {
  const client = serverClient();
  if (!client) return apiError(503, "API_UNAVAILABLE", "Quiz service is unavailable.");
  try {
    const result = await getQuiz({ client, cache: "no-store" });
    const status = result.response?.status;
    if (!status) return apiError(503, "API_UNAVAILABLE", "Quiz service is unavailable.");
    if (result.data !== undefined && status === 200 && isQuiz(result.data)) return Response.json(result.data, { status, headers: jsonHeaders });
    if (result.error !== undefined && isErrorResponse(result.error)) return Response.json(result.error, { status, headers: jsonHeaders });
    return apiError(502, "MALFORMED_RESPONSE", "Quiz service returned an invalid response.");
  } catch {
    return apiError(503, "API_UNAVAILABLE", "Quiz service is unavailable.");
  }
}

export async function proxyCreateQuestion(body: CreateQuestionRequest): Promise<Response> {
  const client = serverClient();
  if (!client) return apiError(503, "API_UNAVAILABLE", "Quiz service is unavailable.");
  try {
    const result = await createQuestion({ client, body });
    const status = result.response?.status;
    if (!status) return apiError(503, "API_UNAVAILABLE", "Quiz service is unavailable.");
    if (result.data !== undefined && status === 201 && isQuestion(result.data)) return Response.json(result.data, { status, headers: jsonHeaders });
    if (result.error !== undefined && isErrorResponse(result.error)) return Response.json(result.error, { status, headers: jsonHeaders });
    return apiError(502, "MALFORMED_RESPONSE", "Quiz service returned an invalid response.");
  } catch {
    return apiError(503, "API_UNAVAILABLE", "Quiz service is unavailable.");
  }
}

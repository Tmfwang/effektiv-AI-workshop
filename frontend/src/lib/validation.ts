import type { CreateQuestionRequest } from "@/generated";

export type QuestionDraft = {
  question: string;
  alternatives: [string, string, string, string];
  correctAlternativeIndex: number | null;
};

export type DraftErrors = Partial<Record<"question" | "alternative-0" | "alternative-1" | "alternative-2" | "alternative-3" | "alternatives" | "correctAlternativeIndex", string>>;

export function validateDraft(draft: QuestionDraft): DraftErrors {
  const errors: DraftErrors = {};
  const question = draft.question.trim();
  if (!question) errors.question = "Enter a question.";
  else if (question.length > 500) errors.question = "Use 500 characters or fewer.";

  draft.alternatives.forEach((value, index) => {
    const field = `alternative-${index}` as keyof DraftErrors;
    const alternative = value.trim();
    if (!alternative) errors[field] = "Enter an alternative.";
    else if (alternative.length > 200) errors[field] = "Use 200 characters or fewer.";
  });
  const normalized = draft.alternatives.map((value) => value.trim().toLocaleLowerCase());
  if (normalized.every(Boolean) && new Set(normalized).size !== 4) errors.alternatives = "Alternatives must be unique.";
  if (draft.correctAlternativeIndex === null || !Number.isInteger(draft.correctAlternativeIndex) || draft.correctAlternativeIndex < 0 || draft.correctAlternativeIndex > 3) errors.correctAlternativeIndex = "Choose the correct answer.";
  return errors;
}

export function toRequest(draft: QuestionDraft): CreateQuestionRequest {
  if (draft.correctAlternativeIndex === null) throw new Error("A correct answer is required");
  return {
    question: draft.question.trim(),
    alternatives: draft.alternatives.map((value) => value.trim()) as [string, string, string, string],
    correctAlternativeIndex: draft.correctAlternativeIndex,
  };
}

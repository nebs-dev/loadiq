"use server";
import { currentUser } from "@/lib/current-user";
import { coachApiRequest } from "@/lib/loadiq-api";
import type {
  CoachMessageInput,
  CoachNote,
  CoachReply,
  CoachStatus,
} from "@/lib/coach-types";

async function safely<T>(operation: () => Promise<T>) {
  await currentUser();
  try {
    return { ok: true as const, data: await operation() };
  } catch {
    return {
      ok: false as const,
      error:
        "Coach unavailable. Please retry or reload to check the latest state.",
    };
  }
}
export async function loadCoach() {
  return safely(async () => {
    const [status, brief, notes] = await Promise.all([
      coachApiRequest<CoachStatus>("/status"),
      coachApiRequest<CoachReply>("/brief"),
      coachApiRequest<CoachNote[]>("/context"),
    ]);
    return { status, brief, notes };
  });
}
export async function sendCoachMessage(input: CoachMessageInput) {
  return safely(() =>
    coachApiRequest<CoachReply>("/chat", "POST", {
      message: input.message,
      previousQuestions: input.previousQuestions,
      previousAnswers: input.previousAnswers,
      conversationContext: input.conversationContext,
      from: input.from,
      to: input.to,
    }),
  );
}
export async function changeCoachConsent(
  enabled: boolean,
  policyVersion: string,
) {
  return safely(() =>
    coachApiRequest<CoachStatus>("/consent", "POST", {
      enabled,
      policyVersion,
    }),
  );
}
export async function saveCoachNote(text: string, confirmed: boolean) {
  return safely(() =>
    coachApiRequest<CoachNote>("/context", "POST", { text, confirmed }),
  );
}
export async function removeCoachNote(id: string) {
  return safely(() =>
    coachApiRequest<{ removed: boolean }>(
      `/context/${encodeURIComponent(id)}`,
      "DELETE",
    ),
  );
}

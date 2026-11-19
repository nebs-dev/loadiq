export interface CoachBlock {
  id: string;
  kind: "FACT" | "TREND" | "HYPOTHESIS" | "ACTION" | "UNKNOWN";
  text: string;
  supports: string[];
  dates?: string[];
  values?: number[];
}
export interface CoachReply {
  headline: string;
  answer: string;
  period: { from: string; to: string; days: number };
  today: string;
  timezone: string;
  confidence: "limited" | "moderate";
  latestWearableDate: string | null;
  latestImportedDate?: string | null;
  completion?: "ai_assisted" | "ai_partial" | "evidence_only";
  answerStatus?: "complete" | "partial" | "fallback" | "unavailable";
  partialNotice?: string;
  task?: {
    intent: string;
    status: "complete" | "partial" | "unavailable";
    issues: string[];
    requestedItems: number;
    patterns: number;
    actionItems: number;
  };
  rendering?: {
    modelParagraphs: number;
    validatedParagraphs: number;
    displayedParagraphs: number;
    omittedParagraphs: number;
    actionItems: number;
    requiredActionItems: number;
  };
  conversationContext?: CoachConversationContext;
  fallbackNotice?: string;
  failure?: { category: string; stage: string; retryable: boolean };
  blocks: CoachBlock[];
  followUp: string | null;
  mode: string;
  attribution: string;
  context: {
    states: { type: string; date: string; confidence: number }[];
    recommendations: { type: string; date: string; confidence: number }[];
  };
}
export interface CoachStatus {
  configured: boolean;
  providerReady?: boolean;
  consented: boolean;
  policyVersion: string;
  provider: string;
  notice: string;
}
export interface CoachNote {
  id: string;
  text: string;
  confirmedAt: string;
}
export interface CoachMessageInput {
  message: string;
  previousQuestions?: string[];
  previousAnswers?: string[];
  conversationContext?: CoachConversationContext;
  from?: string;
  to?: string;
}
export interface CoachConversationContext {
  period?: { from: string; to: string };
  topics?: string[];
  reportedCircumstances?: string[];
  conclusions?: {
    kind: "HYPOTHESIS" | "UNKNOWN";
    text: string;
    evidenceIds: string[];
  }[];
  offeredActionIds?: string[];
  followUps?: { id: string; status: "asked" | "answered" }[];
}

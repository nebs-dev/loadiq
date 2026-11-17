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
  from?: string;
  to?: string;
}

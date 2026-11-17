"use client";
import { useState, type FormEvent } from "react";
import {
  changeCoachConsent,
  loadCoach,
  removeCoachNote,
  saveCoachNote,
  sendCoachMessage,
} from "@/app/app/coach-actions";
import type { CoachNote, CoachReply, CoachStatus } from "@/lib/coach-types";

const button =
  "rounded-xl bg-[#0F8F63] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50";
const field =
  "w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900";

export function WellbeingCoach({
  initial,
}: {
  initial: Awaited<ReturnType<typeof loadCoach>>;
}) {
  const [brief, setBrief] = useState<CoachReply | null>(
    initial.ok ? initial.data.brief : null,
  );
  const [status, setStatus] = useState<CoachStatus | null>(
    initial.ok ? initial.data.status : null,
  );
  const [notes, setNotes] = useState<CoachNote[]>(
    initial.ok ? initial.data.notes : [],
  );
  const [messages, setMessages] = useState<
    { question: string; reply: CoachReply }[]
  >([]);
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [note, setNote] = useState("");
  const [confirmNote, setConfirmNote] = useState(false);
  const [confirmAi, setConfirmAi] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initial.ok ? "" : initial.error);

  async function reload() {
    const result = await loadCoach();
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setStatus(result.data.status);
    setBrief(result.data.brief);
    setNotes(result.data.notes);
    setError("");
  }
  async function ask(event: FormEvent) {
    event.preventDefault();
    if (busy || !message.trim()) return;
    setBusy(true);
    setError("");
    const hr = /[čćžšđ]|\b(moje|sam|sna|stres|zašto|kako|što|predloži)\b/i.test(
      message,
    );
    try {
      const result = await sendCoachMessage({
        message,
        previousQuestions: messages.slice(-4).map((m) => m.question),
        previousAnswers: messages
          .slice(-4)
          .map((m) => m.reply.answer.slice(0, 2000)),
        ...(from && to ? { from, to } : {}),
      });
      if (!result.ok) {
        setError(
          hr
            ? "Odgovor Coacha nije moguće dovršiti. Pokušajte ponovno."
            : result.error,
        );
        return;
      }
      setMessages((previous) => [
        ...previous.slice(-5),
        { question: message, reply: result.data },
      ]);
      setMessage("");
    } catch {
      setError(
        hr
          ? "Odgovor Coacha nije moguće dovršiti. Pokušajte ponovno."
          : "Coach unavailable. Please retry.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function consent(enabled: boolean) {
    if (!status) return;
    setBusy(true);
    try {
      const result = await changeCoachConsent(enabled, status.policyVersion);
      if (!result.ok) setError(result.error);
      else {
        setStatus(result.data);
        setConfirmAi(false);
        if (!enabled) setMessages([]);
      }
    } catch {
      setError("Consent could not be updated. Please retry.");
    } finally {
      setBusy(false);
    }
  }
  async function remember(event: FormEvent) {
    event.preventDefault();
    if (!confirmNote || !note.trim()) return;
    setBusy(true);
    try {
      const result = await saveCoachNote(note, confirmNote);
      if (!result.ok) setError(result.error);
      else {
        setNote("");
        setConfirmNote(false);
        await reload();
      }
    } catch {
      setError("Context could not be saved.");
    } finally {
      setBusy(false);
    }
  }
  async function forget(id: string) {
    setBusy(true);
    try {
      const result = await removeCoachNote(id);
      if (!result.ok) setError(result.error);
      else await reload();
    } catch {
      setError("Context could not be removed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      aria-label="Wellbeing Coach"
      className="rounded-3xl border border-white bg-white p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Daily Wellbeing Brief
          </p>
          <h2 className="mt-1 text-2xl font-semibold">
            Your wellbeing, in context
          </h2>
        </div>
        <a
          href="#coach-question"
          className="text-sm font-semibold text-emerald-800"
        >
          Discuss these signals ↓
        </a>
      </div>
      {!brief && !error && (
        <p role="status" className="mt-4">
          Loading your evidence…
        </p>
      )}
      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800"
        >
          {error}{" "}
          <button onClick={() => void reload()} className="underline">
            Retry coach
          </button>
        </div>
      )}
      {brief && <Reply reply={brief} compact />}
      {status && (
        <details className="mt-5 rounded-xl bg-slate-50 p-4 text-sm">
          <summary className="cursor-pointer font-semibold">
            AI processing & privacy —{" "}
            {status.configured && status.consented
              ? "enabled"
              : "off; evidence-only mode"}
          </summary>
          <p className="mt-3">{status.notice}</p>
          <p className="mt-2">
            <a
              className="underline"
              href="https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data"
              target="_blank"
              rel="noreferrer"
            >
              Anthropic data controls
            </a>{" "}
            ·{" "}
            <a
              className="underline"
              href="https://www.anthropic.com/legal/data-processing-addendum"
              target="_blank"
              rel="noreferrer"
            >
              Provider DPA
            </a>
          </p>
          {!status.configured && (
            <p className="mt-2">
              {(status.providerReady ?? status.configured)
                ? "AI is paused. You can record consent now; questions remain evidence-only until the local operator enables AI."
                : "AI provider is not configured. No data will be sent to an LLM."}
            </p>
          )}
          {status.consented ? (
            <button
              className={button + " mt-3"}
              disabled={busy}
              onClick={() => void consent(false)}
            >
              Revoke AI consent
            </button>
          ) : (
            <>
              <label className="mt-3 flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={confirmAi}
                  onChange={(e) => setConfirmAi(e.target.checked)}
                />
                I explicitly consent to the described Anthropic processing of my
                questions, recent conversation summaries, wearable summaries and
                context categories.
              </label>
              <button
                className={button + " mt-3"}
                disabled={
                  busy ||
                  !confirmAi ||
                  !(status.providerReady ?? status.configured)
                }
                onClick={() => void consent(true)}
              >
                {status.configured
                  ? "Enable AI processing"
                  : "Record AI consent"}
              </button>
            </>
          )}
        </details>
      )}
      <div className="mt-6 space-y-4" aria-live="polite">
        {messages.map((entry, i) => (
          <article key={i} className="rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold">You: {entry.question}</h3>
            <Reply
              reply={entry.reply}
              language={
                /[čćžšđ]|\b(moje|sam|sna|stres|zašto|kako|što|predloži)\b/i.test(
                  entry.question,
                )
                  ? "hr"
                  : "en"
              }
            />
          </article>
        ))}
        {busy && <p role="status">Working with your evidence…</p>}
      </div>
      <form onSubmit={ask} className="mt-5 space-y-3">
        <label htmlFor="coach-question" className="block font-semibold">
          Ask your Wellbeing Coach
        </label>
        <textarea
          id="coach-question"
          className={field}
          rows={3}
          maxLength={1000}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Why has my HRV changed? How did my sleep change this month?"
        />
        <details className="text-sm">
          <summary className="cursor-pointer">
            Choose historical dates (optional, up to 90 days)
          </summary>
          <div className="mt-2 flex flex-wrap gap-3">
            <label>
              From
              <input
                aria-label="Coach from date"
                type="date"
                className={field}
                value={from}
                max={brief?.today}
                onChange={(e) => setFrom(e.target.value)}
              />
            </label>
            <label>
              To
              <input
                aria-label="Coach to date"
                type="date"
                className={field}
                value={to}
                max={brief?.today}
                onChange={(e) => setTo(e.target.value)}
              />
            </label>
          </div>
        </details>
        <p className="text-xs text-slate-600">
          Replies stay in this page’s memory, not a transcript database. With AI
          consent, your questions and recent conversation summaries are sent to
          Anthropic together with summarized evidence. Saved notes are not sent
          verbatim. Do not include names, contact details, locations or secrets.
        </p>
        <button
          className={button}
          disabled={busy || !brief || !message.trim() || !!from !== !!to}
        >
          Ask coach
        </button>
        {messages.length > 0 && (
          <button
            type="button"
            className="ml-3 text-sm underline"
            onClick={() => setMessages([])}
          >
            Clear conversation
          </button>
        )}
      </form>
      <details className="mt-6 border-t border-slate-200 pt-4 text-sm">
        <summary className="cursor-pointer font-semibold">
          Personal context — review, confirm or remove
        </summary>
        <p className="mt-2 text-slate-600">
          Only notes you explicitly confirm are saved. Notes are your reports,
          not verified measurements or recorded workouts. Only recognized
          categories are shared with AI.
        </p>
        <ul className="mt-3 space-y-2">
          {notes.map((n) => (
            <li key={n.id} className="rounded-lg bg-slate-50 p-3">
              <p>{n.text}</p>
              <time className="text-xs text-slate-600">
                Confirmed {n.confirmedAt.slice(0, 10)}
              </time>
              <button
                className="ml-3 underline"
                disabled={busy}
                onClick={() => void forget(n.id)}
              >
                Remove saved context
              </button>
            </li>
          ))}
        </ul>
        {!notes.length && <p className="mt-2">No saved personal context.</p>}
        <form onSubmit={remember} className="mt-3 space-y-3">
          <label className="block">
            Context to remember
            <textarea
              className={field}
              maxLength={300}
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="My goal is to sleep better."
            />
          </label>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={confirmNote}
              onChange={(e) => setConfirmNote(e.target.checked)}
            />
            I confirm that I want to save this note for future conversations.
          </label>
          <button
            className={button}
            disabled={busy || !confirmNote || !note.trim()}
          >
            Save confirmed context
          </button>
        </form>
      </details>
    </section>
  );
}

function Reply({
  reply,
  compact = false,
  language = "en",
}: {
  reply: CoachReply;
  compact?: boolean;
  language?: "hr" | "en";
}) {
  const hr = language === "hr";
  return (
    <div className="mt-4 text-sm text-slate-700">
      <h3 className="font-semibold text-slate-900">{reply.headline}</h3>
      <p className="mt-1 text-xs">
        {reply.period.from}–{reply.period.to} · {reply.timezone} ·
        {hr ? "Zadnji signal za Coach" : "Latest coaching signal"}:{" "}
        {reply.latestWearableDate ?? "unknown"} ·{" "}
        {hr ? "Zadnji uvezeni dan" : "Latest imported day"}:{" "}
        {reply.latestImportedDate ?? reply.latestWearableDate ?? "unknown"} ·{" "}
        {hr ? "Pokrivenost" : "Data coverage"}:{" "}
        {hr
          ? reply.confidence === "limited"
            ? "ograničena"
            : "umjerena"
          : reply.confidence}{" "}
        ·{" "}
        {reply.mode === "ai_selected"
          ? hr
            ? "AI potpomognuti odgovor"
            : "AI-assisted answer"
          : hr
            ? "Odgovor iz podataka — bez AI objašnjenja"
            : "Evidence-only answer — not AI-generated"}
      </p>
      {!compact && (
        <p
          aria-label="Coach answer"
          className="mt-3 whitespace-pre-line leading-relaxed"
        >
          {reply.answer}
        </p>
      )}
      <details open={compact || undefined} className="mt-3">
        <summary className="cursor-pointer font-semibold">
          {compact
            ? "Key observations"
            : hr
              ? "Mjerenja, dokazi i ograničenja"
              : "Measurements, evidence & limitations"}
        </summary>
        <ul className="mt-3 space-y-3">
          {reply.blocks.map((block, i) => (
            <li key={block.id + i}>
              <span className="mr-2 rounded bg-slate-100 px-2 py-1 text-xs font-bold">
                {block.kind}
              </span>
              {block.text}
              {!compact && (block.dates?.length || block.supports.length) ? (
                <details className="mt-1 text-xs">
                  <summary className="cursor-pointer">
                    Evidence {block.id}
                  </summary>
                  <p>
                    Supporting evidence:{" "}
                    {block.supports.join(", ") || "direct measurements"}
                  </p>
                  {block.dates && <p>Dates: {block.dates.join(", ")}</p>}
                  {block.values && <p>Values: {block.values.join(", ")}</p>}
                </details>
              ) : null}
            </li>
          ))}
        </ul>
        {!compact && reply.context.states.length > 0 && (
          <p className="mt-3">
            Existing detected states:{" "}
            {reply.context.states
              .map((s) => `${s.type} (${s.date})`)
              .join(", ")}
          </p>
        )}
        {!compact && reply.context.recommendations.length > 0 && (
          <p className="mt-2">
            Existing engine recommendations:{" "}
            {reply.context.recommendations
              .map((r) => `${r.type} (${r.date})`)
              .join(", ")}
          </p>
        )}
        {!compact && reply.failure && (
          <p className="mt-2 text-xs">
            {hr
              ? "Tehnička kategorija neuspjeha"
              : "Technical failure category"}
            : {reply.failure.stage} / {reply.failure.category}
          </p>
        )}
      </details>
      <p className="mt-3 text-xs text-slate-500">{reply.attribution}</p>
    </div>
  );
}

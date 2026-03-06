export const metadata = {
  title: "Medical and Fitness Disclaimer - LoadIQ",
  description: "Medical and fitness disclaimer for LoadIQ.",
};

import { LegalPageShell } from "@/components/legal/legal-page";

export default function DisclaimerPage() {
  return (
    <LegalPageShell
      eyebrow="Disclaimer"
      title="Medical and Fitness Disclaimer"
      intro="LoadIQ provides fitness, recovery, training, and wearable-data interpretations for informational and educational purposes only."
    >
        <div className="space-y-5 text-[#9CA3AF]">
          <p>
            LoadIQ is <span className="font-medium text-[#F9FAFB]">not</span>{" "}
            a medical device, doctor, healthcare provider, diagnostic service,
            or emergency service.
          </p>
          <p>
            Any insights, recommendations, summaries, scores, predictions,
            weight-trend explanations, recovery interpretations, or
            AI-generated outputs provided by LoadIQ:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>do not constitute medical advice</li>
            <li>do not diagnose, treat, cure, or prevent any disease or medical condition</li>
            <li>may be incomplete, delayed, or incorrect</li>
            <li>
              should not be relied upon as the sole basis for health, training,
              nutrition, or treatment decisions
            </li>
          </ul>
          <p>
            Always use your own judgment and consult a qualified physician or
            other licensed healthcare professional before making decisions that
            may affect your health or safety.
          </p>
          <p>
            Do not ignore professional medical advice or delay seeking it
            because of information provided by LoadIQ.
          </p>
          <p>
            If you think you may have a medical issue or emergency, contact a
            doctor or emergency services immediately.
          </p>
          <p>
            Wearable devices and third-party integrations may produce estimates
            or imperfect signals. Recovery metrics, HRV, sleep scores,
            body-weight trends, training-load indicators, calorie estimates,
            and similar outputs are not guaranteed to be accurate or suitable
            for your circumstances.
          </p>
          <p>
            By using LoadIQ, you acknowledge that any training, nutrition,
            recovery, body-composition, or performance decision you make is
            your own responsibility.
          </p>
        </div>
    </LegalPageShell>
  );
}

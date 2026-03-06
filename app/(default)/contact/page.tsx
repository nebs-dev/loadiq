export const metadata = {
  title: "Contact - LoadIQ",
  description: "Contact details for LoadIQ.",
};

import { LegalPageShell } from "@/components/legal/legal-page";

export default function ContactPage() {
  return (
    <LegalPageShell
      eyebrow="Contact"
      title="Contact"
      intro="Questions about LoadIQ, privacy, partnerships, or early access?"
      showLastUpdated={false}
    >
        <div className="space-y-8 text-[#9CA3AF]">
          <div>
            <p className="mb-3 font-medium text-[#F9FAFB]">Reach us at</p>
            <a
              className="text-lg text-[#F9FAFB] underline decoration-[#00B67A]/50 underline-offset-4 transition hover:text-[#19D39A]"
              href="mailto:nebojsa.stojanovic@loadiq.fit"
            >
              nebojsa.stojanovic@loadiq.fit
            </a>
          </div>

          <div className="border-t border-[#323232] pt-6">
            <p className="mb-3 font-medium text-[#F9FAFB]">Business details</p>
            <p>
              <span className="font-medium text-[#F9FAFB]">Bimotech obrt</span>
              <br />
              OIB: <span className="font-medium text-[#F9FAFB]">96729813000</span>
              <br />
              Zadarska 33, 31000 Osijek, Croatia
            </p>
          </div>

          <div className="border-t border-[#323232] pt-6">
            <p>
              For privacy-related requests, please include enough detail for us
              to identify and respond to your request.
            </p>
          </div>
        </div>
    </LegalPageShell>
  );
}

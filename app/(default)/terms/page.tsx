export const metadata = {
  title: "Terms of Service - LoadIQ",
  description: "Terms of Service for LoadIQ and the current landing page.",
};

import {
  BulletList,
  LegalPageShell,
  LegalSection as Section,
} from "@/components/legal/legal-page";

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Terms of Service"
      title="Terms of Service"
      intro="These Terms of Service govern your access to and use of the LoadIQ website and any related products or services provided by LoadIQ."
      introSecondary="By accessing or using LoadIQ, you agree to these Terms. If you do not agree, do not use the website or services."
    >
        <div className="space-y-8">
          <Section title="1. Operator information">
            <div>
              <p className="font-medium text-[#F9FAFB]">Bimotech obrt</p>
              <p className="pt-2">
                OIB: <span className="font-medium text-[#F9FAFB]">96729813000</span>
                <br />
                Zadarska 33, 31000 Osijek, Croatia
                <br />
                Email:{" "}
                <a
                  className="text-[#F9FAFB] underline decoration-[#00B67A]/50 underline-offset-4 transition hover:text-[#19D39A]"
                  href="mailto:nebojsa.stojanovic@loadiq.fit"
                >
                  nebojsa.stojanovic@loadiq.fit
                </a>
              </p>
            </div>
          </Section>

          <Section title="2. About LoadIQ">
            <p>
              LoadIQ is a fitness and wearable-data interpretation platform.
              The current website may function only as a landing page at this
              stage. Some services, features, integrations, dashboards,
              accounts, reports, or subscriptions described on the website may
              be planned for the future and may not yet be available.
            </p>
            <p>
              We may update, change, limit, suspend, or discontinue any part
              of the website or service at any time.
            </p>
          </Section>

          <Section title="3. Eligibility">
            <p>
              You must be at least 18 years old to use LoadIQ, unless we
              explicitly state otherwise for a specific service.
            </p>
            <p>By using LoadIQ, you represent that:</p>
            <BulletList
              items={[
                "you are legally able to enter into these Terms",
                "the information you provide is accurate",
                "you will use the service only in compliance with applicable law",
              ]}
            />
          </Section>

          <Section title="4. No medical advice">
            <p>
              LoadIQ provides informational, educational, and fitness-related
              interpretations only.
            </p>
            <p>
              LoadIQ is <span className="font-medium text-[#F9FAFB]">not</span>{" "}
              a medical device, healthcare provider, diagnostic tool, or
              emergency service. Nothing on the website or in the service
              should be treated as medical advice, diagnosis, or treatment.
            </p>
            <p>
              You should consult a qualified medical professional before making
              health decisions based on wearable data, training
              recommendations, recovery analysis, weight trends, or
              AI-generated outputs.
            </p>
            <p>
              If you believe you are experiencing a medical emergency, contact
              emergency services or a licensed medical professional
              immediately.
            </p>
          </Section>

          <Section title="5. Current website functionality">
            <p>
              At the current landing-page stage, LoadIQ may provide only
              limited functionality, such as informational content and contact
              by email.
            </p>
            <p>At this stage, there may be:</p>
            <BulletList
              items={[
                "no user account",
                "no dashboard",
                "no paid subscription",
                "no live Garmin integration",
                "no guaranteed access to any future feature",
              ]}
            />
            <p>
              Nothing on the landing page should be interpreted as a binding
              promise that a feature, integration, timeline, or subscription
              plan will become available.
            </p>
          </Section>

          <Section title="6. Future accounts and integrations">
            <p>
              If LoadIQ later introduces user accounts, Garmin connectivity,
              uploads, reports, subscriptions, or other application features,
              additional product-specific terms, notices, consents, or
              policies may apply.
            </p>
            <p>You may be required to:</p>
            <BulletList
              items={[
                "create an account",
                "provide accurate and current information",
                "keep your credentials secure",
                "authorize third-party integrations such as Garmin",
                "review and accept updated legal terms",
              ]}
            />
            <p>
              You are responsible for activity that occurs through your
              account, unless caused by our own misconduct or security
              failure.
            </p>
          </Section>

          <Section title="7. Acceptable use">
            <p>You agree not to:</p>
            <BulletList
              items={[
                "use LoadIQ for unlawful, fraudulent, or abusive purposes",
                "interfere with the operation, security, or availability of the website or future services",
                "attempt unauthorized access to systems, accounts, or data",
                "scrape, copy, reverse engineer, or exploit the service beyond what is permitted by law",
                "upload malicious code, spam, or harmful content",
                "misuse any AI outputs as guaranteed fact, medical guidance, or professional advice",
              ]}
            />
            <p>
              We may suspend or block access if we reasonably believe a user
              has violated these Terms or created security, legal, or
              operational risk.
            </p>
          </Section>

          <Section title="8. User content and submitted information">
            <p>
              If you send us emails, messages, feedback, uploaded content, or
              later submit data through the app, you grant us a limited right
              to use that information as necessary to:
            </p>
            <BulletList
              items={[
                "respond to you",
                "operate the service",
                "provide requested functionality",
                "improve the product",
                "maintain security and reliability",
              ]}
            />
            <p>
              You represent that you have the right to submit any content or
              data you provide and that doing so does not violate the rights of
              any third party.
            </p>
          </Section>

          <Section title="9. Wearable, fitness, and AI-generated outputs">
            <p>
              Future LoadIQ features may generate interpretations, summaries,
              recommendations, predictions, scores, or reports based on
              wearable data, user-entered data, trends, and AI systems.
            </p>
            <p>
              These outputs are inherently probabilistic and may be incomplete,
              inaccurate, delayed, or incorrect.
            </p>
            <p>You agree that:</p>
            <BulletList
              items={[
                "outputs are provided for informational and fitness-planning purposes only",
                "outputs should be evaluated with common sense and personal judgment",
                "outputs are not guaranteed to be correct or suitable for your circumstances",
                "you remain responsible for your training, nutrition, recovery, health, and personal decisions",
              ]}
            />
          </Section>

          <Section title="10. Third-party services">
            <p>
              LoadIQ may rely on third-party providers, including hosting
              providers, email providers, wearable integrations, AI providers,
              authentication providers, payment processors, analytics
              providers, and infrastructure vendors.
            </p>
            <p>
              We are not responsible for the independent acts, outages,
              policies, or failures of third-party services.
            </p>
            <p>
              Your use of third-party services may also be governed by separate
              terms and privacy policies.
            </p>
          </Section>

          <Section title="11. Intellectual property">
            <p>
              Unless otherwise stated, the LoadIQ website, branding, design,
              copy, software, visuals, and related materials are owned by or
              licensed to LoadIQ and are protected by applicable intellectual
              property laws.
            </p>
            <p>
              You may not copy, reproduce, distribute, modify, sell, or
              exploit any part of LoadIQ except as allowed by law or with prior
              written permission.
            </p>
            <p>
              Any trademarks, product names, or third-party brands mentioned
              remain the property of their respective owners.
            </p>
          </Section>

          <Section title="12. Feedback">
            <p>
              If you provide suggestions, ideas, or feedback, we may use them
              without restriction or compensation, unless applicable law
              requires otherwise.
            </p>
          </Section>

          <Section title="13. Disclaimer of warranties">
            <p>
              To the maximum extent permitted by law, LoadIQ is provided on an{" "}
              <span className="font-medium text-[#F9FAFB]">"as is"</span> and{" "}
              <span className="font-medium text-[#F9FAFB]">"as available"</span>{" "}
              basis.
            </p>
            <p>
              We make no warranty that the website or future services will be
              uninterrupted, accurate, complete, secure, error-free, or fit for
              any particular purpose.
            </p>
            <p>This includes, without limitation, any warranty relating to:</p>
            <BulletList
              items={[
                "uptime or availability",
                "data accuracy",
                "AI-generated recommendations",
                "fitness outcomes",
                "recovery predictions",
                "interoperability with Garmin or any other third-party service",
              ]}
            />
          </Section>

          <Section title="14. Limitation of liability">
            <p>
              To the maximum extent permitted by law, LoadIQ and Bimotech obrt
              will not be liable for any indirect, incidental, special,
              consequential, exemplary, or punitive damages, or for any loss of
              data, profits, revenue, goodwill, business opportunity, training
              outcome, or health-related outcome arising from or related to
              your use of the website or services.
            </p>
            <p>
              To the maximum extent permitted by law, our total liability for
              any claim relating to LoadIQ will not exceed the greater of:
            </p>
            <BulletList
              items={[
                "the amount you paid us for the relevant service in the 3 months before the event giving rise to the claim, or",
                "EUR 50, if no paid service existed",
              ]}
            />
            <p>
              Nothing in these Terms excludes liability that cannot legally be
              excluded under applicable law.
            </p>
          </Section>

          <Section title="15. Indemnity">
            <p>
              You agree to indemnify and hold harmless LoadIQ and Bimotech
              obrt from claims, liabilities, damages, and expenses arising out
              of your misuse of the service, your unlawful conduct, or your
              violation of these Terms.
            </p>
          </Section>

          <Section title="16. Privacy">
            <p>
              Your use of LoadIQ is also governed by the LoadIQ Privacy
              Policy.
            </p>
          </Section>

          <Section title="17. Suspension and termination">
            <p>
              We may suspend, limit, or terminate access to all or part of
              LoadIQ at any time, with or without notice, especially where
              reasonably necessary for security, maintenance, legal compliance,
              or misuse prevention.
            </p>
            <p>You may stop using LoadIQ at any time.</p>
            <p>
              If future accounts are introduced, account deletion and data
              handling may be subject to additional procedures described in the
              Privacy Policy or product documentation.
            </p>
          </Section>

          <Section title="18. Governing law">
            <p>
              These Terms are governed by the laws of the Republic of Croatia,
              without regard to conflict of laws principles.
            </p>
          </Section>

          <Section title="19. Disputes">
            <p>
              Any dispute arising out of or relating to these Terms or the use
              of LoadIQ shall be subject to the jurisdiction of the competent
              courts in Croatia, unless mandatory consumer law provides
              otherwise.
            </p>
          </Section>

          <Section title="20. Changes to these Terms">
            <p>
              We may update these Terms from time to time. When we do, we will
              update the "Last updated" date.
            </p>
            <p>
              Continued use of the website or services after an update may
              constitute acceptance of the revised Terms, to the extent
              permitted by law.
            </p>
          </Section>

          <Section id="contact" title="21. Contact">
            <p>For questions about these Terms, contact:</p>
            <div>
              <p className="font-medium text-[#F9FAFB]">Bimotech obrt</p>
              <p className="pt-2">
                Zadarska 33, 31000 Osijek, Croatia
                <br />
                <a
                  className="text-[#F9FAFB] underline decoration-[#00B67A]/50 underline-offset-4 transition hover:text-[#19D39A]"
                  href="mailto:nebojsa.stojanovic@loadiq.fit"
                >
                  nebojsa.stojanovic@loadiq.fit
                </a>
              </p>
            </div>
          </Section>
        </div>
    </LegalPageShell>
  );
}

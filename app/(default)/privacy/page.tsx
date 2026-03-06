export const metadata = {
  title: "Privacy Policy - LoadIQ",
  description: "Privacy Policy for LoadIQ and the current landing page.",
};

import {
  BulletList,
  LegalPageShell,
  LegalSection as Section,
} from "@/components/legal/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPageShell
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      intro="LoadIQ respects your privacy and is committed to protecting personal data."
      introSecondary="This Privacy Policy explains what data we collect, how we use it, when we share it, and what rights users may have when visiting the LoadIQ website or using LoadIQ services."
    >
        <div className="space-y-8">
          <Section title="1. Controller information">
            <div>
              <p className="font-medium text-[#F9FAFB]">Controller / business owner</p>
              <p className="pt-2">
                <span className="font-medium text-[#F9FAFB]">Bimotech obrt</span>
                <br />
                OIB: <span className="font-medium text-[#F9FAFB]">96729813000</span>
                <br />
                Zadarska 33, 31000 Osijek, Croatia
                <br />
                Email:{" "}
                <a
                  className="text-[#F9FAFB] transition hover:text-[#19D39A]"
                  href="mailto:nebojsa.stojanovic@loadiq.fit"
                >
                  nebojsa.stojanovic@loadiq.fit
                </a>
              </p>
            </div>
            <p>
              For any privacy-related request, question, or complaint, you can
              contact us at the email address above.
            </p>
          </Section>

          <Section title="2. Scope of this Privacy Policy">
            <p>This Privacy Policy applies to:</p>
            <BulletList
              items={[
                "the LoadIQ website",
                "communications sent to LoadIQ by email",
                "future LoadIQ app and related services, when launched",
              ]}
            />
            <p>
              At the moment, the current website is a landing page. Some
              features described on the website or planned for the future may
              not yet be live.
            </p>
          </Section>

          <Section title="3. Data we currently collect">
            <p>
              At this time, the LoadIQ landing page does{" "}
              <span className="font-medium text-[#F9FAFB]">
                not
              </span>{" "}
              require account creation and does{" "}
              <span className="font-medium text-[#F9FAFB]">not</span> offer a
              contact form, user dashboard, payment flow, or analytics tools.
            </p>
            <p>We may currently receive personal data only when you:</p>
            <BulletList
              items={[
                "email us directly",
                "click a mailto link and choose to contact us",
                "technically interact with the website through normal server and hosting operations",
              ]}
            />
            <p>Depending on your interaction, this may include:</p>
            <BulletList
              items={[
                "your name",
                "your email address",
                "any information you include in your message",
                "technical data typically processed by hosting infrastructure, such as IP address, browser type, device information, timestamps, and basic request logs",
              ]}
            />
          </Section>

          <Section title="4. Data we may collect when the service launches">
            <p>
              As LoadIQ develops into a full service, we may collect additional
              data needed to provide the product. This may include:
            </p>
            <div>
              <h3 className="mb-2 font-medium text-[#F9FAFB]">
                Account and profile data
              </h3>
              <BulletList
                items={[
                  "name",
                  "email address",
                  "login credentials or authentication identifiers",
                  "account preferences",
                ]}
              />
            </div>
            <div>
              <h3 className="mb-2 font-medium text-[#F9FAFB]">
                Fitness and health-related data provided by integrations or users
              </h3>
              <BulletList
                items={[
                  "wearable data from supported providers such as Garmin",
                  "steps",
                  "resting heart rate",
                  "heart rate variability (HRV)",
                  "sleep duration and sleep quality",
                  "activity and training session data",
                  "recovery-related signals",
                  "estimated calories burned",
                  "body weight entries",
                  "optional nutrition-related inputs",
                  "optional meal photos or progress photos",
                ]}
              />
            </div>
            <div>
              <h3 className="mb-2 font-medium text-[#F9FAFB]">Product usage data</h3>
              <BulletList
                items={[
                  "app activity",
                  "device and browser information",
                  "log data",
                  "diagnostic and performance data",
                  "feature interaction data",
                ]}
              />
            </div>
            <div>
              <h3 className="mb-2 font-medium text-[#F9FAFB]">Billing data</h3>
              <p>
                If paid subscriptions are introduced, payment information may be
                processed by third-party payment processors. LoadIQ would
                generally not store full card details directly.
              </p>
            </div>
          </Section>

          <Section title="5. How we use personal data">
            <p>We may use personal data to:</p>
            <BulletList
              items={[
                "operate, maintain, and improve the website and future services",
                "respond to inquiries and support requests",
                "provide users with requested information",
                "enable account access and authentication",
                "connect wearable integrations and process imported data",
                "generate insights, reports, recommendations, and coaching outputs",
                "monitor reliability, security, and abuse prevention",
                "comply with legal obligations",
                "enforce our terms, policies, and legitimate business interests",
              ]}
            />
            <p>
              If the full LoadIQ product launches, data may also be used to
              generate:
            </p>
            <BulletList
              items={[
                "daily coaching insights",
                "weekly summaries or reports",
                "trend analysis",
                "pattern detection",
                "prediction features",
                "shareable insight cards or similar user-requested outputs",
              ]}
            />
          </Section>

          <Section title="6. Legal bases for processing (GDPR)">
            <p>
              Where the GDPR applies, we rely on one or more of the following
              legal bases:
            </p>
            <BulletList
              items={[
                "Consent – for example, where you voluntarily provide information or authorize an integration",
                "Contract – where processing is necessary to provide the service you requested",
                "Legitimate interests – such as operating the website, improving the product, securing systems, and responding to inquiries",
                "Legal obligation – where we must retain or disclose data under applicable law",
              ]}
            />
            <p>
              If we process health-related or similar sensitive data in the
              future, we will do so only on an appropriate legal basis, which
              may include your explicit consent where required.
            </p>
          </Section>

          <Section title="7. Health and fitness data">
            <p>
              LoadIQ is intended to help users interpret fitness and wearable
              data. Some future features may involve data that can be
              considered health-related or sensitive under applicable law.
            </p>
            <p>
              If such features are launched, LoadIQ will take additional care
              to:
            </p>
            <BulletList
              items={[
                "process only data reasonably necessary for the service",
                "limit access to authorized systems and providers",
                "use appropriate safeguards",
                "provide users with transparency about what is connected, uploaded, or analyzed",
              ]}
            />
            <p>
              LoadIQ is not intended to provide medical diagnosis, treatment, or
              emergency services.
            </p>
          </Section>

          <Section title="8. Sharing of personal data">
            <p>We do not sell personal data.</p>
            <p>
              We may share personal data only when reasonably necessary,
              including with:
            </p>
            <BulletList
              items={[
                "hosting and infrastructure providers",
                "email providers",
                "analytics or error monitoring providers, if later enabled",
                "authentication providers, if later enabled",
                "database, cloud storage, and processing providers",
                "AI service providers used to generate interpretations or insights",
                "payment processors, if subscriptions are introduced",
                "wearable integration providers such as Garmin, where relevant to the service",
                "legal or regulatory authorities, if required by law",
              ]}
            />
            <p>
              All such sharing would be limited to what is reasonably necessary
              for the relevant purpose.
            </p>
          </Section>

          <Section title="9. International data transfers">
            <p>
              Some service providers used by LoadIQ may process data outside
              Croatia or the European Economic Area.
            </p>
            <p>
              Where required, we will take appropriate steps to ensure that
              international transfers are protected using lawful transfer
              mechanisms and reasonable contractual or technical safeguards.
            </p>
          </Section>

          <Section title="10. Data retention">
            <p>
              We keep personal data only for as long as reasonably necessary for
              the purposes described in this Privacy Policy, including to:
            </p>
            <BulletList
              items={[
                "respond to communications",
                "provide services",
                "maintain security and logs",
                "meet legal, tax, accounting, or regulatory obligations",
                "resolve disputes and enforce agreements",
              ]}
            />
            <p>
              Retention periods may vary depending on the type of data and the
              legal or operational need.
            </p>
          </Section>

          <Section title="11. Cookies and similar technologies">
            <p>
              At this time, LoadIQ does{" "}
              <span className="font-medium text-[#F9FAFB]">
                not
              </span>{" "}
              intentionally use analytics cookies, advertising cookies, or
              similar tracking technologies on the landing page, based on the
              current setup.
            </p>
            <p>
              However, basic technical cookies or similar technologies may still
              be used if necessary for hosting, security, or site functionality.
            </p>
            <p>
              If LoadIQ later introduces analytics, advertising, session
              recording, or other non-essential technologies, this Privacy
              Policy and any required consent mechanisms will be updated
              accordingly.
            </p>
          </Section>

          <Section title="12. Data security">
            <p>
              We take reasonable technical and organizational measures to
              protect personal data against unauthorized access, disclosure,
              alteration, or destruction.
            </p>
            <p>
              No internet-based service can guarantee absolute security, but we
              aim to use infrastructure and providers appropriate to the stage
              and nature of the product.
            </p>
          </Section>

          <Section title="13. Your rights">
            <p>
              Depending on your location and applicable law, you may have the
              right to:
            </p>
            <BulletList
              items={[
                "access your personal data",
                "correct inaccurate data",
                "request deletion of your data",
                "restrict certain processing",
                "object to certain processing",
                "request data portability",
                "withdraw consent where processing is based on consent",
                "lodge a complaint with a competent data protection authority",
              ]}
            />
            <p>
              To exercise your rights, contact:{" "}
              <a
                className="text-[#F9FAFB] transition hover:text-[#19D39A]"
                href="mailto:nebojsa.stojanovic@loadiq.fit"
              >
                nebojsa.stojanovic@loadiq.fit
              </a>
            </p>
            <p>
              We may ask for reasonable verification before fulfilling a
              request.
            </p>
          </Section>

          <Section title="14. Children">
            <p>
              LoadIQ is not intended for children under 18, unless explicitly
              stated otherwise in a future version of the service.
            </p>
            <p>
              We do not knowingly collect personal data from children through
              the current landing page.
            </p>
          </Section>

          <Section title="15. Third-party links and integrations">
            <p>
              The website or future service may contain links to third-party
              websites, tools, or integrations. We are not responsible for the
              privacy practices of third parties. Users should review the
              privacy policies of those third parties separately.
            </p>
          </Section>

          <Section title="16. Changes to this Privacy Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in the website, business operations, legal requirements,
              or future product features.
            </p>
            <p>
              When we do, we will update the Last updated date at the top of
              this page.
            </p>
          </Section>

          <Section id="contact" title="17. Contact">
            <p>
              For any privacy-related questions, requests, or complaints,
              contact:
            </p>
            <p>
              <span className="font-medium text-[#F9FAFB]">Bimotech obrt</span>
              <br />
              Zadarska 33, 31000 Osijek, Croatia
              <br />
              <a
                className="text-[#F9FAFB] transition hover:text-[#19D39A]"
                href="mailto:nebojsa.stojanovic@loadiq.fit"
              >
                nebojsa.stojanovic@loadiq.fit
              </a>
            </p>
          </Section>

          <Section title="Practical note for the current landing page">
            <p>As of the current website stage:</p>
            <BulletList
              items={[
                "no account creation is available",
                "no waitlist form is active",
                "no analytics tools are intentionally enabled",
                "no payment processing is active",
                "the main way a user may provide personal data is by sending an email manually",
              ]}
            />
            <p>
              If the product later adds analytics, user accounts, Garmin
              integration, photo upload, nutrition input, AI processing,
              reports, subscriptions, or other service layers, this Privacy
              Policy should be updated before or at launch of those features.
            </p>
          </Section>
        </div>
    </LegalPageShell>
  );
}

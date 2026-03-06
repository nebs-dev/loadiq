import { ReactNode } from "react";

export function LegalPageShell({
  eyebrow,
  title,
  intro,
  introSecondary,
  showLastUpdated = true,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  introSecondary?: ReactNode;
  showLastUpdated?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 md:py-20">
      <div className="rounded-3xl border border-[#323232] bg-[#1F1F1F]/80 p-8 backdrop-blur-xs md:p-12">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#00B67A]">
            {eyebrow}
          </p>
          <h1 className="mb-4 font-nacelle text-4xl font-semibold text-[#F9FAFB] md:text-5xl">
            {title}
          </h1>
          {intro ? <div className="max-w-3xl text-lg text-[#9CA3AF]">{intro}</div> : null}
          {introSecondary ? (
            <div className="max-w-3xl pt-3 text-[#9CA3AF]">{introSecondary}</div>
          ) : null}
          {showLastUpdated ? (
            <p className="mt-4 text-sm text-[#9CA3AF]">
              <span className="font-medium text-[#F9FAFB]">Last updated:</span> 6
              March 2026
            </p>
          ) : null}
        </div>

        {children}
      </div>
    </section>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-[#323232] pt-6">
      <h2 className="mb-3 font-nacelle text-2xl font-semibold text-[#F9FAFB]">
        {title}
      </h2>
      <div className="space-y-4 text-[#9CA3AF]">{children}</div>
    </section>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

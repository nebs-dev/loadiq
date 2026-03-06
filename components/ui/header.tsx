"use client";

import Link from "next/link";
import Logo from "./logo";

export default function Header() {
  return (
    <header className="z-30 mt-2 w-full md:mt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-[#1F1F1F] px-3 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          {/* Site branding */}
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-9 text-sm font-medium">
              <li>
                <Link className="text-gray-200 transition hover:text-white" href="/#product">
                  Product
                </Link>
              </li>
              <li>
                <Link className="text-gray-200 transition hover:text-white" href="/#how-it-works">
                  How It Works
                </Link>
              </li>
              <li>
                <Link className="text-gray-200 transition hover:text-white" href="/#example-insights">
                  Insights
                </Link>
              </li>
              <li>
                <Link className="text-gray-200 transition hover:text-white" href="/privacy">
                  Privacy
                </Link>
              </li>
            </ul>
          </nav>

          {/* Primary CTA */}
          <ul className="flex flex-1 items-center justify-end gap-3">
            <li>
              <a
                href="mailto:nebojsa.stojanovic@loadiq.fit?subject=LoadIQ%20Early%20Access"
                className="btn-sm bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]"
              >
                Request Early Access
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

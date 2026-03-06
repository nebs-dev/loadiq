import Logo from "./logo";
import Image from "next/image";
import FooterIllustration from "@/public/images/footer-illustration.svg";

export default function Footer() {
  return (
    <footer>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Footer illustration */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -translate-x-1/2"
          aria-hidden="true"
        >
          <Image
            className="max-w-none"
            src={FooterIllustration}
            width={1076}
            height={378}
            alt="Footer illustration"
          />
        </div>
        <div className="grid grid-cols-2 justify-between gap-12 py-8 md:grid-cols-4 md:py-12 lg:grid-cols-[repeat(3,minmax(0,160px))_1fr] xl:gap-20">
          {/* 1st block */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-[#F9FAFB]">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-[#9CA3AF] transition hover:text-[#19D39A]"
                  href="/#product"
                >
                  Product
                </a>
              </li>
              <li>
                <a
                  className="text-[#9CA3AF] transition hover:text-[#19D39A]"
                  href="/#how-it-works"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  className="text-[#9CA3AF] transition hover:text-[#19D39A]"
                  href="/#example-insights"
                >
                  Insights
                </a>
              </li>
            </ul>
          </div>
          {/* 2nd block */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-[#F9FAFB]">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-[#9CA3AF] transition hover:text-[#19D39A]"
                  href="/contact"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  className="text-[#9CA3AF] transition hover:text-[#19D39A]"
                  href="/privacy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="text-[#9CA3AF] transition hover:text-[#19D39A]"
                  href="/terms"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  className="text-[#9CA3AF] transition hover:text-[#19D39A]"
                  href="/disclaimer"
                >
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
          {/* 3rd block */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-[#F9FAFB]">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-[#9CA3AF] transition hover:text-[#19D39A]"
                  href="/#example-insights"
                >
                  Example Insights
                </a>
              </li>
              <li>
                <a
                  className="text-[#9CA3AF] transition hover:text-[#19D39A]"
                  href="/#weekly-reports"
                >
                  Weekly Reports
                </a>
              </li>
            </ul>
          </div>
          {/* 4th block */}
          <div className="col-span-2 md:col-span-1 lg:text-right">
            <div className="mb-4">
              <Logo />
            </div>
            <div className="space-y-4 text-sm">
              <div className="text-[#9CA3AF]">
                <p className="font-medium text-[#F9FAFB]">Bimotech obrt</p>
                <p>Zadarska 33, 31000 Osijek, Croatia</p>
                <a
                  className="transition hover:text-[#19D39A]"
                  href="mailto:nebojsa.stojanovic@loadiq.fit"
                >
                  nebojsa.stojanovic@loadiq.fit
                </a>
              </div>
              <div className="space-y-2 text-[#9CA3AF]">
                <p>© 2026 LoadIQ. All rights reserved.</p>
                <p className="max-w-xs lg:ml-auto">
                  LoadIQ provides informational fitness and wearable-data
                  insights only and does not provide medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

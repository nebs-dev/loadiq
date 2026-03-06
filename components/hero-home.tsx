import Image from "next/image";
import HeroImage from "@/public/images/hero_2.png";

export default function HeroHome() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-20">
            <h1
              className="mx-auto max-w-4xl pb-5 font-nacelle text-4xl font-semibold text-[#F9FAFB] md:text-5xl"
              data-aos="fade-up"
            >
              Turn wearable data into{" "}
              <span className="text-[#00B67A]">daily coaching</span>
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-gray-300"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                LoadIQ interprets HRV, sleep, training load, and recovery so
                you know what to do next.
              </p>
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                <div data-aos="fade-up" data-aos-delay={400}>
                  <a
                    className="btn group mb-4 w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                    href="mailto:nebojsa.stojanovic@loadiq.fit?subject=LoadIQ%20Early%20Access"
                  >
                    <span className="relative inline-flex items-center">
                      Request Early Access{" "}
                      <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </a>
                </div>
                <div data-aos="fade-up" data-aos-delay={600}>
                  <a
                    className="btn relative w-full bg-linear-to-b from-[#2A2A2A] to-[#1F1F1F] bg-[length:100%_100%] bg-[bottom] text-gray-100 shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.08)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,--theme(--color-gray-700),--theme(--color-gray-600),--theme(--color-gray-700))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%] hover:text-white sm:ml-4 sm:w-auto"
                    href="#example-insights"
                  >
                    View Example Insights
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay={200}>
            <Image
              className="h-auto w-full rounded-2xl object-cover"
              src={HeroImage}
              width={1536}
              height={1024}
              priority
              alt="LoadIQ product preview"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

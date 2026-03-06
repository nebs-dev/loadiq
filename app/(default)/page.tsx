export const metadata = {
  title: "LoadIQ",
  description:
    "Wearable-based coaching insights for HRV, sleep, training load, and recovery.",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import Cta from "@/components/cta";

export default function Home() {
  return (
    <>
      <PageIllustration />
      <Hero />
      <Workflows />
      <Features />
      <Cta />
    </>
  );
}

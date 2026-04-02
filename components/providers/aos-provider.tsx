"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export function AosProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 600,
      easing: "ease-out-sine",
    });
  }, []);

  return <>{children}</>;
}

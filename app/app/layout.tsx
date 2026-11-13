import type { ReactNode } from "react";
import { currentUser } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export default async function ProductLayout({
  children,
}: {
  children: ReactNode;
}) {
  await currentUser();

  return children;
}

import type { ReactNode } from "react";
import { withAuth } from "@workos-inc/authkit-nextjs";

export const dynamic = "force-dynamic";

export default async function ProductLayout({
  children,
}: {
  children: ReactNode;
}) {
  await withAuth({ ensureSignedIn: true });

  return children;
}

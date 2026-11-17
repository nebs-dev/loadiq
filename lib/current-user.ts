import "server-only";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { e2eEnabled } from "./e2e-mode";
export async function currentUser() {
  if (!e2eEnabled()) {
    // AuthKit's ensureSignedIn creates a PKCE cookie; Server Components cannot
    // write cookies. The existing sign-in Route Handler owns that operation.
    const session = await withAuth();
    if (!session.user) redirect("/signin");
    return session;
  }
  const input = await headers();
  if (!["127.0.0.1:4318", "localhost:4318"].includes(input.get("host") ?? ""))
    redirect("/signin");
  const session = input.get("x-loadiq-e2e-session");
  const name = ["alice", "bob"].find(
    (name) => session === `${process.env.LOADIQ_E2E_SECRET}:${name}`,
  );
  if (!name) redirect("/signin");
  return {
    user: {
      id: `synthetic-${name}`,
      email: `${name}@example.invalid`,
      firstName: name,
      lastName: "Fixture",
    },
  };
}

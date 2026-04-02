import { getSignInUrl } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign In - LoadIQ",
  description: "Sign in to LoadIQ",
};

export default async function SignIn() {
  redirect(await getSignInUrl({ returnTo: "/app" }));
}

import { getSignUpUrl } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign Up - LoadIQ",
  description: "Create your LoadIQ account",
};

export default async function SignUp() {
  redirect(await getSignUpUrl({ returnTo: "/app" }));
}

import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { test, expect } from "@playwright/test";

test("server rendering redirects unauthenticated users without creating PKCE cookies", async () => {
  const calls: unknown[][] = [];
  let user: { id: string; email: string } | null = null;
  const exports: { currentUser?: () => Promise<{ user: typeof user }> } = {};
  const code = ts.transpileModule(readFileSync("lib/current-user.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  runInNewContext(code, {
    exports,
    require: (name: string) => {
      if (name === "server-only") return {};
      if (name === "@workos-inc/authkit-nextjs")
        return {
          withAuth: (...args: unknown[]) => {
            calls.push(args);
            return Promise.resolve({ user });
          },
        };
      if (name === "next/navigation")
        return {
          redirect: (path: string) => {
            throw new Error(`redirect:${path}`);
          },
        };
      if (name === "next/headers") return {};
      if (name === "./e2e-mode") return { e2eEnabled: () => false };
      throw new Error("Unexpected auth dependency");
    },
  });
  const result = await exports.currentUser!().then(
    () => "unexpected-authentication",
    (error: unknown) =>
      error instanceof Error ? error.message : String(error),
  );
  expect(result).toBe("redirect:/signin");
  expect(calls).toEqual([[]]);
  user = { id: "synthetic-workos-owner", email: "owner@example.invalid" };
  expect((await exports.currentUser!()).user).toEqual(user);
  expect(calls).toEqual([[], []]);
});

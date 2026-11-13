import { createRequire } from "node:module";
import { dirname } from "node:path";
import { FlatCompat } from "@eslint/eslintrc";
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  resolvePluginsRelativeTo: dirname(
    createRequire(import.meta.url).resolve("eslint-config-next/package.json"),
  ),
});
export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

if (process.env.CI && process.argv.includes("--baseline"))
  throw new Error("CI may not regenerate formatting debt");
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import * as prettier from "prettier";
const path = "quality/format-baseline.json";
const files = [
  ...new Set(
    execFileSync(
      "git",
      ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
      { encoding: "utf8" },
    ).split("\0"),
  ),
].filter(
  (file) =>
    /\.(?:ts|tsx|js|mjs|json|yml|yaml)$/.test(file) &&
    !/(?:^|\/)(?:node_modules|dist|coverage|samples|uploads|quality|playwright-report|test-results)\//.test(
      file,
    ) &&
    !["pnpm-lock.yaml", "package-lock.json"].includes(file) &&
    existsSync(file),
);
const baseline = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
const changed = new Set(
  execFileSync("git", ["diff", "HEAD", "--name-only"], {
    encoding: "utf8",
  }).split("\n"),
);
const tracked = new Set(
  execFileSync("git", ["ls-files"], { encoding: "utf8" }).split("\n"),
);
const next = {};
let failed = false;
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const hash = createHash("sha256").update(text).digest("hex");
  if (
    await prettier.check(text, {
      ...(await prettier.resolveConfig(file)),
      filepath: file,
    })
  )
    continue;
  if (
    process.argv.includes("--baseline") &&
    tracked.has(file) &&
    !changed.has(file)
  ) {
    next[file] = hash;
    continue;
  }
  if (baseline[file] === hash) {
    next[file] = hash;
    continue;
  }
  console.error(`Formatting required: ${file}`);
  failed = true;
}
if (process.argv.includes("--baseline"))
  writeFileSync(path, JSON.stringify(next, null, 2) + "\n");
console.log(
  `Formatting: ${files.length} files checked, ${Object.keys(next).length} unchanged historical exceptions`,
);
if (failed) process.exitCode = 1;

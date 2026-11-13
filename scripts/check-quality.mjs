import { ESLint } from "eslint";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
const backend =
  JSON.parse(readFileSync("package.json", "utf8")).name === "loadiq-api";
const files = backend
  ? ["src/**/*.ts", "test/**/*.ts"]
  : [
      "app/**/*.{ts,tsx}",
      "components/**/*.{ts,tsx}",
      "lib/**/*.{ts,tsx}",
      "tests/**/*.ts",
      "middleware.ts",
      "instrumentation*.ts",
    ];
const results = await new ESLint({ errorOnUnmatchedPattern: false }).lintFiles(
  files,
);
const counts = {};
if (process.env.CI && process.argv.includes("--baseline"))
  throw new Error("CI may not regenerate lint debt");
for (const result of results)
  for (const message of result.messages) {
    if (message.fatal)
      throw new Error("Fatal ESLint parsing/configuration error");
    const file = result.filePath.slice(process.cwd().length + 1);
    const source = readFileSync(result.filePath, "utf8")
      .split("\n")
      .slice(message.line - 1, message.endLine ?? message.line)
      .map((line) => line.trim())
      .join("\n");
    const sourceHash = createHash("sha256")
      .update(source)
      .digest("hex")
      .slice(0, 16);
    const key = `${file}:${message.ruleId ?? "parse"}:${createHash("sha256").update(message.message).digest("hex").slice(0, 16)}:${sourceHash}:${message.severity}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }
const path = "quality/eslint-baseline.json";
if (process.argv.includes("--baseline")) {
  // Manual debt acknowledgement only; CI never invokes this option.
  writeFileSync(path, JSON.stringify(counts, null, 2) + "\n");
  console.log(
    `Recorded ${Object.values(counts).reduce((a, b) => a + b, 0)} existing lint findings`,
  );
} else {
  const baseline = JSON.parse(readFileSync(path, "utf8"));
  let failures = 0;
  for (const [key, count] of Object.entries(counts))
    if (count > (baseline[key] ?? 0)) {
      console.error(
        `New lint finding: ${key} (${count - (baseline[key] ?? 0)})`,
      );
      failures++;
    }
  if (failures) process.exitCode = 1;
  else
    console.log(
      `Lint gate passed; ${Object.values(counts).reduce((a, b) => a + b, 0)} acknowledged historical findings remain`,
    );
}

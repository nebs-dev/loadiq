import sourceFiles from "./source-files.json";

type UnknownRecord = Record<string, unknown>;
const record = (value: unknown): UnknownRecord =>
  value !== null && typeof value === "object" ? (value as UnknownRecord) : {};
const categories = new Set([
  "Error",
  "TypeError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "URIError",
  "AbortError",
  "PrismaClientKnownRequestError",
  "PrismaClientValidationError",
  "ServiceUnavailableException",
  "BadGatewayException",
]);
const paths = new Set<string>(
  sourceFiles.flatMap((path) => [
    path,
    ...(path.startsWith("src/")
      ? [
          path.replace(/^src\//, "dist/").replace(/\.ts$/, ".js"),
          "dist/" + path.replace(/\.ts$/, ".js"),
        ]
      : []),
    ...(path.startsWith("app/")
      ? [".next/server/" + path.replace(/\.tsx?$/, ".js")]
      : []),
  ]),
);

function technicalFile(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const clean = value.replace(/\\/g, "/").split(/[?#]/, 1)[0];
  // Output only a reviewed repository path, never an absolute prefix or runtime URL.
  for (const path of Array.from(paths)) {
    if (clean === path || clean.endsWith("/" + path)) return path;
    if (path.startsWith("app/") && /\.tsx?$/.test(path)) {
      const marker = "_next/static/chunks/" + path.replace(/\.tsx?$/, "") + "-";
      const index = clean.lastIndexOf("/" + marker);
      const suffix = clean.startsWith(marker)
        ? clean.slice(marker.length)
        : index >= 0
          ? clean.slice(index + marker.length + 1)
          : "";
      if (/^[a-f0-9]{8,64}\.js$/.test(suffix)) return marker + suffix;
    }
  }
  const chunk = clean.match(
    /(?:^|\/)((?:_next\/static|\.next\/server)\/chunks\/[0-9a-f-]{1,80}\.js)$/,
  );
  return chunk?.[1];
}
function position(value: unknown) {
  return typeof value === "number" &&
    Number.isInteger(value) &&
    value > 0 &&
    value <= 10000000
    ? value
    : undefined;
}
function frames(value: unknown) {
  return (Array.isArray(value) ? value : []).slice(-40).flatMap((raw) => {
    const frame = record(raw);
    const filename = technicalFile(frame.filename);
    return filename
      ? [
          {
            filename,
            lineno: position(frame.lineno),
            colno: position(frame.colno),
            in_app: true,
          },
        ]
      : [];
  });
}

// Reconstruct events. Retain only static categories and reviewed code locations.
export function scrubEvent<
  T extends {
    event_id?: string;
    timestamp?: number;
    platform?: string;
    environment?: string;
  },
>(event: T): T {
  const input = record(event);
  const candidate = record(input.tags).operation;
  const operation =
    typeof candidate === "string" &&
    ["garmin_sync", "import_processing", "unhandled", "frontend"].includes(
      candidate,
    )
      ? candidate
      : "unhandled";
  const values = record(input.exception).values;
  const exceptions = (
    Array.isArray(values) && values.length ? values.slice(0, 3) : [{}]
  ).map((raw) => {
    const error = record(raw);
    const type =
      typeof error.type === "string" && categories.has(error.type)
        ? error.type
        : "Error";
    const safeFrames = frames(record(error.stacktrace).frames);
    return {
      type,
      value: "Application operation failed",
      ...(safeFrames.length ? { stacktrace: { frames: safeFrames } } : {}),
    };
  });
  const directFrames = frames(record(input.stacktrace).frames);
  return {
    event_id:
      typeof event.event_id === "string" &&
      /^[a-f0-9]{32}$/.test(event.event_id)
        ? event.event_id
        : undefined,
    timestamp:
      typeof event.timestamp === "number" && Number.isFinite(event.timestamp)
        ? event.timestamp
        : undefined,
    platform: "javascript",
    environment: ["production", "development", "test"].includes(
      event.environment ?? "",
    )
      ? event.environment
      : undefined,
    level: "error",
    message: "LoadIQ application failure (details intentionally withheld)",
    exception: { values: exceptions },
    ...(directFrames.length ? { stacktrace: { frames: directFrames } } : {}),
    fingerprint: ["{{ default }}", operation, exceptions[0].type],
    tags: { operation },
  } as unknown as T;
}

export function euDsn(dsn: string | undefined): string | undefined {
  if (!dsn) return undefined;
  try {
    const url = new URL(dsn);
    if (
      url.protocol === "https:" &&
      /^o[0-9]+\.ingest\.de\.sentry\.io$/.test(url.hostname) &&
      !url.password &&
      !url.search &&
      !url.hash &&
      /^\/[0-9]+$/.test(url.pathname)
    )
      return dsn;
  } catch {
    /* Invalid configuration remains disabled. */
  }
  return undefined;
}

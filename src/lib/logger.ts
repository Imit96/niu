/**
 * Structured logger.
 *
 * In production, outputs JSON to stdout so log aggregators (Datadog, Logtail, etc.)
 * can ingest structured data. In development, uses readable console methods.
 *
 * To add Sentry or another error-tracking service, call it here in the `error` method.
 */

type LogLevel = "info" | "warn" | "error" | "debug";

function log(level: LogLevel, ...args: unknown[]) {
  if (process.env.NODE_ENV === "production") {
    const payload = {
      level,
      ts: new Date().toISOString(),
      msg: args
        .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
        .join(" "),
    };
    // eslint-disable-next-line no-console
    (level === "error" ? console.error : console.log)(JSON.stringify(payload));
  } else {
    // eslint-disable-next-line no-console
    const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
    fn(`[${level.toUpperCase()}]`, ...args);
  }
}

export const logger = {
  info: (...args: unknown[]) => log("info", ...args),
  warn: (...args: unknown[]) => log("warn", ...args),
  error: (...args: unknown[]) => log("error", ...args),
  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") log("debug", ...args);
  },
};

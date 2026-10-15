/**
 * Logging helpers shared by the storefront and admin apps.
 *
 * @remarks
 * Entries are prefixed with an ISO timestamp and the level. `debug` entries
 * are dropped outside development; the other levels always log.
 */

/** Severity levels understood by {@link logger}. */
type LogLevel = "debug" | "info" | "warn" | "error";

/** Structured details attached to a log entry; serialized alongside the message. */
interface LogContext {
  [key: string]: unknown;
}

const isDevelopment = process.env.NODE_ENV === "development";

type ConsoleMethod = (message?: unknown, ...optionalParams: unknown[]) => void;

const consoleMethods: Record<LogLevel, ConsoleMethod> = {
  debug: console.debug.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

/** Formats and emits a log entry through the console method matching its level. */
const logWithLevel = (
  level: LogLevel,
  message: string,
  context?: LogContext,
) => {
  if (!isDevelopment && level === "debug") return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  const log = consoleMethods[level];

  if (context) {
    log(`${prefix} ${message}`, context);
  } else {
    log(`${prefix} ${message}`);
  }
};

/**
 * Level-tagged console logger shared across the applications.
 *
 * @remarks
 * Each method prefixes the message with a timestamp and level name, and
 * forwards optional `context` as a second console argument.
 */
export const logger = {
  /**
   * Logs a debug entry; silently dropped outside development.
   *
   * @param message - Message to log.
   * @param context - Optional structured details appended to the entry.
   */
  debug: (message: string, context?: LogContext) =>
    logWithLevel("debug", message, context),
  /**
   * Logs an informational entry.
   *
   * @param message - Message to log.
   * @param context - Optional structured details appended to the entry.
   */
  info: (message: string, context?: LogContext) =>
    logWithLevel("info", message, context),
  /**
   * Logs a warning entry.
   *
   * @param message - Message to log.
   * @param context - Optional structured details appended to the entry.
   */
  warn: (message: string, context?: LogContext) =>
    logWithLevel("warn", message, context),
  /**
   * Logs an error entry.
   *
   * @param message - Message to log.
   * @param context - Optional structured details appended to the entry.
   */
  error: (message: string, context?: LogContext) =>
    logWithLevel("error", message, context),
};

export default logger;

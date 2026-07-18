/**
 * Logger utility for consistent logging across the application
 * Respects NODE_ENV to avoid logging in production
 */

type LogLevel = "debug" | "info" | "warn" | "error";

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

export const logger = {
  debug: (message: string, context?: LogContext) =>
    logWithLevel("debug", message, context),
  info: (message: string, context?: LogContext) =>
    logWithLevel("info", message, context),
  warn: (message: string, context?: LogContext) =>
    logWithLevel("warn", message, context),
  error: (message: string, context?: LogContext) =>
    logWithLevel("error", message, context),
};

export default logger;

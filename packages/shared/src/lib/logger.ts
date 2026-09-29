/**
 * Logger utility for consistent logging across the application
 * Respects NODE_ENV to avoid logging in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

const isDevelopment = process.env.NODE_ENV === 'development';

const logWithLevel = (level: LogLevel, message: string, context?: LogContext) => {
  if (!isDevelopment && level === 'debug') return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  if (context) {
    console[level as keyof typeof console](`${prefix} ${message}`, context);
  } else {
    console[level as keyof typeof console](`${prefix} ${message}`);
  }
};

export const logger = {
  debug: (message: string, context?: LogContext) => logWithLevel('debug', message, context),
  info: (message: string, context?: LogContext) => logWithLevel('info', message, context),
  warn: (message: string, context?: LogContext) => logWithLevel('warn', message, context),
  error: (message: string, context?: LogContext) => logWithLevel('error', message, context),
};

export default logger;

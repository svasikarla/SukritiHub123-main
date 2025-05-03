/**
 * Application logger utility
 * Provides consistent logging across the application with environment-aware behavior
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  /** Module or component name for log context */
  module: string;
  /** Whether to disable all logs (overrides environment settings) */
  disabled?: boolean;
}

/**
 * Creates a logger instance for a specific module
 * @param options Logger configuration options
 * @returns Logger instance with debug, info, warn, and error methods
 */
export function createLogger(options: LoggerOptions) {
  const { module, disabled = false } = options;
  const isProd = process.env.NODE_ENV === 'production';
  
  /**
   * Formats a log message with timestamp and module name
   */
  const formatMessage = (message: string): string => {
    return `[${module}] ${message}`;
  };

  return {
    /**
     * Log debug message (only in non-production)
     */
    debug: (message: string, ...args: any[]): void => {
      if (disabled || isProd) return;
      console.debug(formatMessage(message), ...args);
    },

    /**
     * Log info message (only in non-production)
     */
    info: (message: string, ...args: any[]): void => {
      if (disabled || isProd) return;
      console.info(formatMessage(message), ...args);
    },

    /**
     * Log warning message
     */
    warn: (message: string, ...args: any[]): void => {
      if (disabled) return;
      console.warn(formatMessage(message), ...args);
    },

    /**
     * Log error message (always logged)
     */
    error: (message: string, ...args: any[]): void => {
      if (disabled) return;
      console.error(formatMessage(message), ...args);
    },
  };
}

// Default application logger
export const appLogger = createLogger({ module: 'App' });

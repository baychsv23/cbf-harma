/**
 * Logging utility for the application
 * Provides structured logging with environment-aware behavior
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
    [key: string]: unknown;
}

class Logger {
    private isProduction = process.env.NODE_ENV === 'production';

    /**
     * Log an error message
     * In production, this should be sent to a logging service (Sentry, LogRocket, etc.)
     */
    error(message: string, error?: unknown, context?: LogContext): void {
        if (this.isProduction) {
            // TODO: Send to logging service
            // Example: Sentry.captureException(error, { extra: { message, ...context } });

            // For now, still log to console in production for visibility
            // Remove this once proper logging service is set up
            console.error('[ERROR]', message, error, context);
        } else {
            console.error('[ERROR]', message, error, context);
        }
    }

    /**
     * Log a warning message
     */
    warn(message: string, context?: LogContext): void {
        if (!this.isProduction) {
            console.warn('[WARN]', message, context);
        }
    }

    /**
     * Log an info message
     */
    info(message: string, context?: LogContext): void {
        if (!this.isProduction) {
            console.info('[INFO]', message, context);
        }
    }

    /**
     * Log a debug message (only in development)
     */
    debug(message: string, context?: LogContext): void {
        if (!this.isProduction) {
            console.debug('[DEBUG]', message, context);
        }
    }
}

// Export singleton instance
export const logger = new Logger();

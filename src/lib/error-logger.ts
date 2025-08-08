export interface ErrorLog {
  id: string;
  timestamp: number;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context?: Record<string, any>;
  userAgent?: string;
  url?: string;
  userId?: string;
}

export interface UnhandledErrorEvent {
  error: Error;
  filename?: string;
  lineno?: number;
  colno?: number;
}

export interface UnhandledRejectionEvent {
  reason: any;
  promise: Promise<any>;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleUnhandledError({
        error: event.error || new Error(event.message),
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleUnhandledRejection({
        reason: event.reason,
        promise: event.promise
      });
    });

    // Console error interception
    this.interceptConsoleErrors();

    this.isInitialized = true;
  }

  private interceptConsoleErrors() {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = (...args: any[]) => {
      originalConsoleError.apply(console, args);
      this.log('error', args.join(' '), {
        source: 'console.error',
        args: args
      });
    };

    console.warn = (...args: any[]) => {
      originalConsoleWarn.apply(console, args);
      this.log('warning', args.join(' '), {
        source: 'console.warn',
        args: args
      });
    };
  }

  private handleUnhandledError(event: UnhandledErrorEvent) {
    this.log('error', `Unhandled Error: ${event.error.message}`, {
      stack: event.error.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      source: 'window.onerror'
    });
  }

  private handleUnhandledRejection(event: UnhandledRejectionEvent) {
    const message = event.reason instanceof Error 
      ? event.reason.message 
      : String(event.reason);

    this.log('error', `Unhandled Promise Rejection: ${message}`, {
      reason: event.reason,
      stack: event.reason instanceof Error ? event.reason.stack : undefined,
      source: 'unhandledrejection'
    });
  }

  public log(level: ErrorLog['level'], message: string, context?: Record<string, any>) {
    const errorLog: ErrorLog = {
      id: `${level}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      level,
      message,
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    };

    this.logs.push(errorLog);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Report to external service
    this.reportToService(errorLog);

    // Log to console with appropriate level
    switch (level) {
      case 'error':
        console.error(`[ErrorLogger] ${message}`, context);
        break;
      case 'warning':
        console.warn(`[ErrorLogger] ${message}`, context);
        break;
      case 'info':
        console.info(`[ErrorLogger] ${message}`, context);
        break;
    }
  }

  private reportToService(errorLog: ErrorLog) {
    // Report to multiple endpoints for redundancy
    this.sendToAPI(errorLog);
    this.sendToAnalytics(errorLog);
    this.storeLocally(errorLog);
  }

  private sendToAPI(errorLog: ErrorLog) {
    if (typeof fetch !== 'undefined') {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog),
        keepalive: true
      }).catch(() => {
        // Store for retry if API fails
        this.storeForRetry(errorLog);
      });
    }
  }

  private sendToAnalytics(errorLog: ErrorLog) {
    // Send to analytics service (Google Analytics, Mixpanel, etc.)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: errorLog.message,
        fatal: errorLog.level === 'error',
        custom_map: {
          error_id: errorLog.id,
          error_context: JSON.stringify(errorLog.context)
        }
      });
    }

    // Send via sendBeacon if available
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      try {
        navigator.sendBeacon('/api/analytics/error', JSON.stringify({
          type: 'error_log',
          data: errorLog
        }));
      } catch (e) {
        // Ignore beacon errors
      }
    }
  }

  private storeLocally(errorLog: ErrorLog) {
    try {
      if (typeof localStorage !== 'undefined') {
        const storedLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
        storedLogs.push(errorLog);
        
        // Keep only last 50 logs locally
        const recentLogs = storedLogs.slice(-50);
        localStorage.setItem('errorLogs', JSON.stringify(recentLogs));
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  private storeForRetry(errorLog: ErrorLog) {
    try {
      if (typeof localStorage !== 'undefined') {
        const retryQueue = JSON.parse(localStorage.getItem('errorRetryQueue') || '[]');
        retryQueue.push(errorLog);
        localStorage.setItem('errorRetryQueue', JSON.stringify(retryQueue));
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  public getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  public getLogsByLevel(level: ErrorLog['level']): ErrorLog[] {
    return this.logs.filter(log => log.level === level);
  }

  public clearLogs() {
    this.logs = [];
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('errorLogs');
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  public retryFailedReports() {
    try {
      if (typeof localStorage !== 'undefined') {
        const retryQueue = JSON.parse(localStorage.getItem('errorRetryQueue') || '[]');
        
        retryQueue.forEach((errorLog: ErrorLog) => {
          this.sendToAPI(errorLog);
        });

        // Clear retry queue after attempting to send
        localStorage.removeItem('errorRetryQueue');
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  public generateReport(): string {
    const errorCount = this.getLogsByLevel('error').length;
    const warningCount = this.getLogsByLevel('warning').length;
    const infoCount = this.getLogsByLevel('info').length;

    let report = '=== Error Log Report ===\n\n';
    report += `Total Logs: ${this.logs.length}\n`;
    report += `Errors: ${errorCount}\n`;
    report += `Warnings: ${warningCount}\n`;
    report += `Info: ${infoCount}\n\n`;

    if (errorCount > 0) {
      report += 'Recent Errors:\n';
      this.getLogsByLevel('error').slice(-5).forEach((log, index) => {
        report += `${index + 1}. ${log.message} (${new Date(log.timestamp).toISOString()})\n`;
      });
      report += '\n';
    }

    if (warningCount > 0) {
      report += 'Recent Warnings:\n';
      this.getLogsByLevel('warning').slice(-3).forEach((log, index) => {
        report += `${index + 1}. ${log.message} (${new Date(log.timestamp).toISOString()})\n`;
      });
    }

    return report;
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

// Convenience functions
export const logError = (message: string, context?: Record<string, any>) => {
  errorLogger.log('error', message, context);
};

export const logWarning = (message: string, context?: Record<string, any>) => {
  errorLogger.log('warning', message, context);
};

export const logInfo = (message: string, context?: Record<string, any>) => {
  errorLogger.log('info', message, context);
};

// React hook for error logging
export function useErrorLogger() {
  return {
    logError,
    logWarning,
    logInfo,
    getLogs: errorLogger.getLogs.bind(errorLogger),
    clearLogs: errorLogger.clearLogs.bind(errorLogger),
    exportLogs: errorLogger.exportLogs.bind(errorLogger),
    generateReport: errorLogger.generateReport.bind(errorLogger)
  };
}
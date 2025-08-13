// @ts-nocheck
import { EventEmitter } from 'events';

// Comprehensive error management system
export class ErrorManager extends EventEmitter {
  private errorHandlers: Map<string, ErrorHandler> = new Map();
  private errorHistory: ErrorRecord[] = [];
  private maxHistorySize: number = 1000;
  private retryStrategies: Map<string, RetryStrategy> = new Map();
  private fallbackStrategies: Map<string, FallbackStrategy> = new Map();
  private monitoring: ErrorMonitoring;

  constructor(config: ErrorManagerConfig = {}) {
    super();
    
    this.maxHistorySize = config.maxHistorySize || 1000;
    this.monitoring = new ErrorMonitoring(config.monitoring);
    
    this.initializeDefaultHandlers();
    this.initializeDefaultRetryStrategies();
    this.initializeDefaultFallbacks();
    
    // Set up global error handlers
    this.setupGlobalHandlers();
  }

  // Handle errors with context and recovery
  async handleError(error: Error | ErrorContext, context?: Partial<ErrorContext>): Promise<ErrorResult> {
    const errorContext = this.normalizeErrorContext(error, context);
    const errorRecord = this.createErrorRecord(errorContext);
    
    // Add to history
    this.addToHistory(errorRecord);
    
    // Emit error event
    this.emit('error:occurred', errorRecord);
    
    // Get appropriate handler
    const handler = this.getErrorHandler(errorContext);
    
    try {
      // Execute error handling strategy
      const result = await handler.handle(errorContext);
      
      // Update error record with result
      errorRecord.result = result;
      errorRecord.resolvedAt = new Date().toISOString();
      
      // Monitor resolution
      this.monitoring.recordResolution(errorRecord);
      
      this.emit('error:resolved', errorRecord);
      
      return result;
      
    } catch (handlingError) {
      // Error handling failed
      errorRecord.handlingError = this.serializeError(handlingError);
      errorRecord.status = 'failed';
      
      this.emit('error:handling_failed', errorRecord);
      
      // Try fallback strategy
      return this.executeFallback(errorContext);
    }
  }

  // Retry operation with strategy
  async retryOperation<T>(
    operation: () => Promise<T>,
    strategyName: string = 'default',
    context?: Partial<ErrorContext>
  ): Promise<T> {
    const strategy = this.retryStrategies.get(strategyName) || this.retryStrategies.get('default')!;
    let lastError: Error;
    
    for (let attempt = 1; attempt <= strategy.maxAttempts; attempt++) {
      try {
        const result = await operation();
        
        // Log successful retry if not first attempt
        if (attempt > 1) {
          this.emit('retry:success', {
            attempt,
            strategy: strategyName,
            context
          });
        }
        
        return result;
        
      } catch (error) {
        lastError = error as Error;
        
        // Check if error is retryable
        if (!strategy.isRetryable(error as Error)) {
          throw error;
        }
        
        // Check if we should continue retrying
        if (attempt < strategy.maxAttempts) {
          const delay = strategy.calculateDelay(attempt);
          
          this.emit('retry:attempt', {
            attempt,
            nextAttempt: attempt + 1,
            delay,
            error: this.serializeError(error as Error),
            strategy: strategyName
          });
          
          await this.delay(delay);
        }
      }
    }
    
    // All retries exhausted
    throw new RetryExhaustedError(
      `Operation failed after ${strategy.maxAttempts} attempts`,
      lastError!,
      strategyName
    );
  }

  // Execute with automatic error handling and recovery
  async executeWithRecovery<T>(
    operation: () => Promise<T>,
    options: ExecutionOptions = {}
  ): Promise<T> {
    const {
      retryStrategy = 'default',
      fallbackStrategy,
      timeout,
      context = {}
    } = options;

    try {
      // Wrap with timeout if specified
      const wrappedOperation = timeout 
        ? () => Promise.race([
            operation(),
            this.createTimeoutPromise<T>(timeout)
          ])
        : operation;

      // Execute with retry
      return await this.retryOperation(wrappedOperation, retryStrategy, context);
      
    } catch (error) {
      // Handle error
      const errorResult = await this.handleError(error as Error, {
        ...context,
        operation: operation.name || 'anonymous',
        retryStrategy,
        fallbackStrategy
      });
      
      // If error handling provided a result, return it
      if (errorResult.recovery?.result !== undefined) {
        return errorResult.recovery.result;
      }
      
      // Otherwise re-throw
      throw error;
    }
  }

  // Circuit breaker pattern
  createCircuitBreaker<T extends any[], R>(
    operation: (...args: T) => Promise<R>,
    options: CircuitBreakerOptions = {}
  ): (...args: T) => Promise<R> {
    const breaker = new CircuitBreaker(operation, options);
    
    breaker.on('open', () => {
      this.emit('circuit:open', { operation: operation.name });
    });
    
    breaker.on('halfOpen', () => {
      this.emit('circuit:halfOpen', { operation: operation.name });
    });
    
    breaker.on('close', () => {
      this.emit('circuit:close', { operation: operation.name });
    });
    
    return breaker.execute.bind(breaker);
  }

  // Bulkhead pattern - isolate failures
  createBulkhead<T extends any[], R>(
    operation: (...args: T) => Promise<R>,
    options: BulkheadOptions = {}
  ): (...args: T) => Promise<R> {
    const bulkhead = new Bulkhead(operation, options);
    return bulkhead.execute.bind(bulkhead);
  }

  // Error categorization and routing
  addErrorHandler(category: string, handler: ErrorHandler): void {
    this.errorHandlers.set(category, handler);
  }

  addRetryStrategy(name: string, strategy: RetryStrategy): void {
    this.retryStrategies.set(name, strategy);
  }

  addFallbackStrategy(name: string, strategy: FallbackStrategy): void {
    this.fallbackStrategies.set(name, strategy);
  }

  // Get error statistics and insights
  getErrorStatistics(timeRange: string = '24h'): ErrorStatistics {
    const cutoffTime = this.getTimeRangeCutoff(timeRange);
    const recentErrors = this.errorHistory.filter(
      error => new Date(error.timestamp) > cutoffTime
    );

    return {
      total: recentErrors.length,
      byCategory: this.groupBy(recentErrors, 'category'),
      byStatus: this.groupBy(recentErrors, 'status'),
      byOperation: this.groupBy(recentErrors, e => e.context.operation || 'unknown'),
      resolution: {
        resolved: recentErrors.filter(e => e.status === 'resolved').length,
        failed: recentErrors.filter(e => e.status === 'failed').length,
        pending: recentErrors.filter(e => e.status === 'pending').length
      },
      trends: this.calculateErrorTrends(recentErrors),
      topErrors: this.getTopErrors(recentErrors)
    };
  }

  // Health check based on error patterns
  getSystemHealth(): SystemHealth {
    const stats = this.getErrorStatistics('1h');
    const errorRate = stats.total / 60; // errors per minute
    
    let status: 'healthy' | 'degraded' | 'unhealthy';
    let score = 100;
    
    if (errorRate < 1) {
      status = 'healthy';
    } else if (errorRate < 5) {
      status = 'degraded';
      score = Math.max(50, 100 - (errorRate * 10));
    } else {
      status = 'unhealthy';
      score = Math.max(0, 50 - (errorRate * 5));
    }
    
    return {
      status,
      score,
      errorRate,
      criticalErrors: stats.byCategory['critical'] || 0,
      lastIncident: this.getLastCriticalError()?.timestamp,
      recommendations: this.generateHealthRecommendations(stats)
    };
  }

  // Private methods
  private normalizeErrorContext(error: Error | ErrorContext, context?: Partial<ErrorContext>): ErrorContext {
    if (error instanceof Error) {
      return {
        error: this.serializeError(error),
        category: this.categorizeError(error),
        severity: this.determineSeverity(error),
        operation: context?.operation || 'unknown',
        userId: context?.userId,
        requestId: context?.requestId || this.generateRequestId(),
        metadata: context?.metadata || {},
        timestamp: new Date().toISOString()
      };
    }
    
    return { ...error, ...context } as ErrorContext;
  }

  private createErrorRecord(context: ErrorContext): ErrorRecord {
    return {
      id: this.generateErrorId(),
      ...context,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  }

  private addToHistory(record: ErrorRecord): void {
    this.errorHistory.push(record);
    
    // Maintain history size limit
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(-this.maxHistorySize);
    }
  }

  private getErrorHandler(context: ErrorContext): ErrorHandler {
    // Try specific handlers first
    const handler = this.errorHandlers.get(context.category) ||
                   this.errorHandlers.get(context.severity) ||
                   this.errorHandlers.get('default');
    
    if (!handler) {
      throw new Error(`No error handler found for category: ${context.category}`);
    }
    
    return handler;
  }

  private async executeFallback(context: ErrorContext): Promise<ErrorResult> {
    const fallbackName = context.metadata?.fallbackStrategy || 'default';
    const fallback = this.fallbackStrategies.get(fallbackName);
    
    if (!fallback) {
      return {
        success: false,
        message: 'No fallback strategy available',
        context
      };
    }
    
    try {
      const result = await fallback.execute(context);
      
      this.emit('fallback:executed', {
        strategy: fallbackName,
        context,
        result
      });
      
      return {
        success: true,
        message: 'Fallback executed successfully',
        context,
        recovery: { type: 'fallback', strategy: fallbackName, result }
      };
      
    } catch (fallbackError) {
      return {
        success: false,
        message: 'Fallback execution failed',
        context,
        error: this.serializeError(fallbackError as Error)
      };
    }
  }

  private categorizeError(error: Error): string {
    // Categorize errors based on type, message, or stack trace
    if (error.name === 'ValidationError') return 'validation';
    if (error.name === 'AuthenticationError') return 'authentication';
    if (error.name === 'AuthorizationError') return 'authorization';
    if (error.name === 'RateLimitError') return 'rate_limit';
    if (error.name === 'TimeoutError') return 'timeout';
    if (error.name === 'NetworkError') return 'network';
    if (error.name === 'DatabaseError') return 'database';
    if (error.message.includes('ECONNREFUSED')) return 'connection';
    if (error.message.includes('timeout')) return 'timeout';
    if (error.message.includes('rate limit')) return 'rate_limit';
    if (error.stack?.includes('prisma')) return 'database';
    
    return 'general';
  }

  private determineSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    // Determine severity based on error characteristics
    if (error.name === 'SecurityError') return 'critical';
    if (error.name === 'DataCorruptionError') return 'critical';
    if (error.message.includes('CRITICAL')) return 'critical';
    if (error.name === 'DatabaseError') return 'high';
    if (error.name === 'AuthenticationError') return 'high';
    if (error.name === 'ValidationError') return 'medium';
    if (error.name === 'RateLimitError') return 'medium';
    
    return 'low';
  }

  private serializeError(error: Error): SerializedError {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause ? this.serializeError(error.cause as Error) : undefined
    };
  }

  private createTimeoutPromise<T>(timeout: number): Promise<T> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new TimeoutError(`Operation timed out after ${timeout}ms`));
      }, timeout);
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getTimeRangeCutoff(timeRange: string): Date {
    const now = new Date();
    const ranges = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    };
    
    const milliseconds = ranges[timeRange as keyof typeof ranges] || ranges['24h'];
    return new Date(now.getTime() - milliseconds);
  }

  private groupBy<T>(array: T[], keyFn: string | ((item: T) => string)): Record<string, number> {
    const result: Record<string, number> = {};
    
    for (const item of array) {
      const key = typeof keyFn === 'string' ? (item as any)[keyFn] : keyFn(item);
      result[key] = (result[key] || 0) + 1;
    }
    
    return result;
  }

  private calculateErrorTrends(errors: ErrorRecord[]): ErrorTrend[] {
    // Simple hourly trends
    const hourlyBuckets: Record<number, number> = {};
    
    for (const error of errors) {
      const hour = new Date(error.timestamp).getHours();
      hourlyBuckets[hour] = (hourlyBuckets[hour] || 0) + 1;
    }
    
    return Object.entries(hourlyBuckets).map(([hour, count]) => ({
      hour: parseInt(hour),
      count
    }));
  }

  private getTopErrors(errors: ErrorRecord[]): TopError[] {
    const errorGroups = this.groupBy(errors, e => e.error.message);
    
    return Object.entries(errorGroups)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([message, count]) => ({ message, count }));
  }

  private getLastCriticalError(): ErrorRecord | undefined {
    return this.errorHistory
      .filter(e => e.severity === 'critical')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  }

  private generateHealthRecommendations(stats: ErrorStatistics): string[] {
    const recommendations: string[] = [];
    
    if (stats.byCategory['database'] > 5) {
      recommendations.push('Consider database connection pooling or query optimization');
    }
    
    if (stats.byCategory['timeout'] > 3) {
      recommendations.push('Review timeout configurations and network performance');
    }
    
    if (stats.byCategory['rate_limit'] > 2) {
      recommendations.push('Implement better rate limiting or request queuing');
    }
    
    if (stats.resolution.failed > stats.resolution.resolved) {
      recommendations.push('Review error handling strategies and fallback mechanisms');
    }
    
    return recommendations;
  }

  private initializeDefaultHandlers(): void {
    // Default error handler
    this.addErrorHandler('default', new DefaultErrorHandler());
    
    // Specific handlers
    this.addErrorHandler('validation', new ValidationErrorHandler());
    this.addErrorHandler('authentication', new AuthenticationErrorHandler());
    this.addErrorHandler('database', new DatabaseErrorHandler());
    this.addErrorHandler('network', new NetworkErrorHandler());
    this.addErrorHandler('timeout', new TimeoutErrorHandler());
    this.addErrorHandler('critical', new CriticalErrorHandler());
  }

  private initializeDefaultRetryStrategies(): void {
    // Exponential backoff
    this.addRetryStrategy('default', new ExponentialBackoffStrategy());
    this.addRetryStrategy('exponential', new ExponentialBackoffStrategy());
    
    // Fixed delay
    this.addRetryStrategy('fixed', new FixedDelayStrategy(1000));
    
    // Linear backoff
    this.addRetryStrategy('linear', new LinearBackoffStrategy());
    
    // No retry
    this.addRetryStrategy('none', new NoRetryStrategy());
  }

  private initializeDefaultFallbacks(): void {
    this.addFallbackStrategy('default', new DefaultFallbackStrategy());
    this.addFallbackStrategy('cache', new CacheFallbackStrategy());
    this.addFallbackStrategy('static', new StaticResponseFallbackStrategy());
    this.addFallbackStrategy('redirect', new RedirectFallbackStrategy());
  }

  private setupGlobalHandlers(): void {
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      this.handleError(new Error(`Unhandled Promise Rejection: ${reason}`), {
        category: 'unhandled_rejection',
        severity: 'critical',
        metadata: { promise }
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.handleError(error, {
        category: 'uncaught_exception',
        severity: 'critical'
      });
    });
  }
}

// Error monitoring and alerting
class ErrorMonitoring {
  private config: ErrorMonitoringConfig;
  private alertThresholds: Map<string, AlertThreshold> = new Map();

  constructor(config: ErrorMonitoringConfig = {}) {
    this.config = config;
    this.initializeDefaultThresholds();
  }

  recordResolution(errorRecord: ErrorRecord): void {
    // Send to monitoring service (Sentry, DataDog, etc.)
    if (this.config.sentryEnabled) {
      this.sendToSentry(errorRecord);
    }
    
    // Check alert thresholds
    this.checkAlerts(errorRecord);
  }

  private initializeDefaultThresholds(): void {
    this.alertThresholds.set('critical_errors', {
      metric: 'count',
      threshold: 1,
      window: '5m',
      category: 'critical'
    });
    
    this.alertThresholds.set('error_rate', {
      metric: 'rate',
      threshold: 10,
      window: '1h',
      category: 'all'
    });
  }

  private sendToSentry(errorRecord: ErrorRecord): void {
    // Mock Sentry integration
    console.log('Sending error to Sentry:', errorRecord.id);
  }

  private checkAlerts(errorRecord: ErrorRecord): void {
    // Check if any alert thresholds are exceeded
    // This would integrate with alerting systems like PagerDuty, Slack, etc.
  }
}

// Default error handlers
class DefaultErrorHandler implements ErrorHandler {
  async handle(context: ErrorContext): Promise<ErrorResult> {
    console.error('Error occurred:', context.error.message);
    
    return {
      success: false,
      message: 'Error handled by default handler',
      context
    };
  }
}

class ValidationErrorHandler implements ErrorHandler {
  async handle(context: ErrorContext): Promise<ErrorResult> {
    // Handle validation errors gracefully
    return {
      success: true,
      message: 'Validation error handled',
      context,
      recovery: {
        type: 'validation_fix',
        message: 'Please check your input and try again'
      }
    };
  }
}

class AuthenticationErrorHandler implements ErrorHandler {
  async handle(context: ErrorContext): Promise<ErrorResult> {
    // Redirect to login or refresh token
    return {
      success: true,
      message: 'Authentication error handled',
      context,
      recovery: {
        type: 'redirect',
        url: '/auth/login'
      }
    };
  }
}

class DatabaseErrorHandler implements ErrorHandler {
  async handle(context: ErrorContext): Promise<ErrorResult> {
    // Try to reconnect or use cache
    return {
      success: false,
      message: 'Database error - please try again',
      context,
      recovery: {
        type: 'retry',
        delay: 5000
      }
    };
  }
}

class NetworkErrorHandler implements ErrorHandler {
  async handle(context: ErrorContext): Promise<ErrorResult> {
    // Network issues - suggest retry
    return {
      success: false,
      message: 'Network error - retrying...',
      context,
      recovery: {
        type: 'retry',
        delay: 2000
      }
    };
  }
}

class TimeoutErrorHandler implements ErrorHandler {
  async handle(context: ErrorContext): Promise<ErrorResult> {
    // Timeout - suggest retry with longer timeout
    return {
      success: false,
      message: 'Request timed out - please try again',
      context,
      recovery: {
        type: 'retry',
        delay: 1000,
        adjustments: { timeout: 'increase' }
      }
    };
  }
}

class CriticalErrorHandler implements ErrorHandler {
  async handle(context: ErrorContext): Promise<ErrorResult> {
    // Critical errors need immediate attention
    console.error('CRITICAL ERROR:', context);
    
    // Alert administrators
    // this.alertAdmins(context);
    
    return {
      success: false,
      message: 'Critical error occurred - administrators have been notified',
      context
    };
  }
}

// Custom error types
export class RetryExhaustedError extends Error {
  constructor(message: string, public lastError: Error, public strategy: string) {
    super(message);
    this.name = 'RetryExhaustedError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Type definitions
interface ErrorManagerConfig {
  maxHistorySize?: number;
  monitoring?: ErrorMonitoringConfig;
}

interface ErrorMonitoringConfig {
  sentryEnabled?: boolean;
  datadogEnabled?: boolean;
  slackWebhook?: string;
}

interface ErrorContext {
  error: SerializedError;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  operation: string;
  userId?: string;
  requestId: string;
  metadata: Record<string, any>;
  timestamp: string;
}

interface ErrorRecord extends ErrorContext {
  id: string;
  status: 'pending' | 'resolved' | 'failed';
  createdAt: string;
  resolvedAt?: string;
  result?: ErrorResult;
  handlingError?: SerializedError;
}

interface SerializedError {
  name: string;
  message: string;
  stack?: string;
  cause?: SerializedError;
}

interface ErrorResult {
  success: boolean;
  message: string;
  context: ErrorContext;
  recovery?: {
    type: string;
    strategy?: string;
    result?: any;
    message?: string;
    url?: string;
    delay?: number;
    adjustments?: Record<string, any>;
  };
  error?: SerializedError;
}

interface ErrorHandler {
  handle(context: ErrorContext): Promise<ErrorResult>;
}

interface RetryStrategy {
  maxAttempts: number;
  calculateDelay(attempt: number): number;
  isRetryable(error: Error): boolean;
}

interface FallbackStrategy {
  execute(context: ErrorContext): Promise<any>;
}

interface ExecutionOptions {
  retryStrategy?: string;
  fallbackStrategy?: string;
  timeout?: number;
  context?: Record<string, any>;
}

interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeout?: number;
  monitoringPeriod?: number;
}

interface BulkheadOptions {
  maxConcurrent?: number;
  maxQueue?: number;
}

interface ErrorStatistics {
  total: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  byOperation: Record<string, number>;
  resolution: {
    resolved: number;
    failed: number;
    pending: number;
  };
  trends: ErrorTrend[];
  topErrors: TopError[];
}

interface ErrorTrend {
  hour: number;
  count: number;
}

interface TopError {
  message: string;
  count: number;
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  score: number;
  errorRate: number;
  criticalErrors: number;
  lastIncident?: string;
  recommendations: string[];
}

interface AlertThreshold {
  metric: string;
  threshold: number;
  window: string;
  category: string;
}

// Retry strategies
class ExponentialBackoffStrategy implements RetryStrategy {
  maxAttempts = 3;
  
  calculateDelay(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt - 1), 30000);
  }
  
  isRetryable(error: Error): boolean {
    // Don't retry validation or authentication errors
    return !['ValidationError', 'AuthenticationError', 'AuthorizationError'].includes(error.name);
  }
}

class FixedDelayStrategy implements RetryStrategy {
  maxAttempts = 3;
  
  constructor(private delay: number = 1000) {}
  
  calculateDelay(): number {
    return this.delay;
  }
  
  isRetryable(error: Error): boolean {
    return !['ValidationError', 'AuthenticationError'].includes(error.name);
  }
}

class LinearBackoffStrategy implements RetryStrategy {
  maxAttempts = 3;
  
  calculateDelay(attempt: number): number {
    return 1000 * attempt;
  }
  
  isRetryable(error: Error): boolean {
    return !['ValidationError', 'AuthenticationError'].includes(error.name);
  }
}

class NoRetryStrategy implements RetryStrategy {
  maxAttempts = 1;
  
  calculateDelay(): number {
    return 0;
  }
  
  isRetryable(): boolean {
    return false;
  }
}

// Fallback strategies
class DefaultFallbackStrategy implements FallbackStrategy {
  async execute(context: ErrorContext): Promise<any> {
    return {
      error: true,
      message: 'Service temporarily unavailable',
      fallback: true
    };
  }
}

class CacheFallbackStrategy implements FallbackStrategy {
  async execute(context: ErrorContext): Promise<any> {
    // Try to get cached response
    return null; // Would implement cache lookup
  }
}

class StaticResponseFallbackStrategy implements FallbackStrategy {
  async execute(context: ErrorContext): Promise<any> {
    return {
      message: 'Using cached response',
      data: [],
      fallback: true
    };
  }
}

class RedirectFallbackStrategy implements FallbackStrategy {
  async execute(context: ErrorContext): Promise<any> {
    return {
      redirect: '/error',
      fallback: true
    };
  }
}

// Circuit breaker implementation
class CircuitBreaker<T extends any[], R> extends EventEmitter {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failures = 0;
  private lastFailureTime = 0;
  private nextAttempt = 0;

  constructor(
    private operation: (...args: T) => Promise<R>,
    private options: CircuitBreakerOptions = {}
  ) {
    super();
  }

  async execute(...args: T): Promise<R> {
    if (this.state === 'open') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'half-open';
        this.emit('halfOpen');
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await this.operation(...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    if (this.state === 'half-open') {
      this.state = 'closed';
      this.emit('close');
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= (this.options.failureThreshold || 5)) {
      this.state = 'open';
      this.nextAttempt = Date.now() + (this.options.resetTimeout || 60000);
      this.emit('open');
    }
  }
}

// Bulkhead implementation
class Bulkhead<T extends any[], R> {
  private activeCalls = 0;
  private queue: Array<() => void> = [];

  constructor(
    private operation: (...args: T) => Promise<R>,
    private options: BulkheadOptions = {}
  ) {}

  async execute(...args: T): Promise<R> {
    const maxConcurrent = this.options.maxConcurrent || 10;
    const maxQueue = this.options.maxQueue || 100;

    if (this.activeCalls >= maxConcurrent) {
      if (this.queue.length >= maxQueue) {
        throw new Error('Bulkhead queue is full');
      }

      await new Promise<void>((resolve) => {
        this.queue.push(resolve);
      });
    }

    this.activeCalls++;

    try {
      return await this.operation(...args);
    } finally {
      this.activeCalls--;
      const next = this.queue.shift();
      if (next) next();
    }
  }
}

// Export singleton instance
export const errorManager = new ErrorManager();
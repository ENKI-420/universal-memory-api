/**
 * Performance monitoring utilities
 */

export class PerformanceMonitor {
  private timers: Map<string, number> = new Map()

  /**
   * Start a performance timer
   */
  start(label: string): void {
    this.timers.set(label, Date.now())
  }

  /**
   * End a performance timer and return duration
   */
  end(label: string): number {
    const startTime = this.timers.get(label)
    if (!startTime) {
      console.warn(`[v0] Performance timer "${label}" was not started`)
      return 0
    }

    const duration = Date.now() - startTime
    this.timers.delete(label)
    return duration
  }

  /**
   * Measure async function execution time
   */
  async measure<T>(label: string, fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    this.start(label)
    try {
      const result = await fn()
      const duration = this.end(label)
      return { result, duration }
    } catch (error) {
      this.end(label)
      throw error
    }
  }

  /**
   * Get memory usage statistics
   */
  getMemoryUsage(): {
    heapUsed: number
    heapTotal: number
    external: number
    rss: number
  } {
    const usage = process.memoryUsage()
    return {
      heapUsed: Math.round((usage.heapUsed / 1024 / 1024) * 100) / 100, // MB
      heapTotal: Math.round((usage.heapTotal / 1024 / 1024) * 100) / 100, // MB
      external: Math.round((usage.external / 1024 / 1024) * 100) / 100, // MB
      rss: Math.round((usage.rss / 1024 / 1024) * 100) / 100, // MB
    }
  }

  /**
   * Get CPU usage (simplified)
   */
  getCpuUsage(): number {
    const usage = process.cpuUsage()
    const total = usage.user + usage.system
    return Math.round((total / 1000000) * 100) / 100 // Convert to seconds
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

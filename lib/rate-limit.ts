import { NextRequest, NextResponse } from "next/server";

export interface RateLimitOptions {
  /**
   * Maximum number of requests allowed within the window.
   * @default 5
   */
  limit?: number;
  /**
   * Time window in milliseconds.
   * @default 60000 (1 minute)
   */
  windowMs?: number;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store to track IP request counts
const rateLimitStore = new Map<string, RateLimitRecord>();

// Automatically clean up expired records every 5 minutes to avoid memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000;
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(ip);
      }
    }
  }, CLEANUP_INTERVAL);

  // Prevent node process from hanging on cleanup timer unref if available
  if (cleanupTimer && typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    (cleanupTimer as any).unref();
  }
}

/**
 * Extracts the client IP address from request headers.
 */
export function getClientIp(request: NextRequest): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    // x-forwarded-for can be a comma-separated list of IPs; first is client IP
    const clientIp = xForwardedFor.split(",")[0].trim();
    if (clientIp) return clientIp;
  }

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp?.trim()) {
    return xRealIp.trim();
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp?.trim()) {
    return cfConnectingIp.trim();
  }

  return "127.0.0.1";
}

/**
 * Helper to check rate limiting for a request.
 *
 * @returns An object containing `isRateLimited` boolean and an optional `response` (HTTP 429) if exceeded.
 */
export function checkRateLimit(
  request: NextRequest,
  options: RateLimitOptions = {}
): {
  isRateLimited: boolean;
  response?: NextResponse;
  remaining: number;
  resetTime: number;
} {
  const limit = options.limit ?? 15;
  const windowMs = options.windowMs ?? 60 * 1000; // 1 minute
  const ip = getClientIp(request);
  const now = Date.now();

  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    // Create new window for IP
    const resetTime = now + windowMs;
    rateLimitStore.set(ip, {
      count: 1,
      resetTime,
    });

    return {
      isRateLimited: false,
      remaining: limit - 1,
      resetTime,
    };
  }

  if (record.count >= limit) {
    // Limit exceeded
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    const resetTimeSec = Math.ceil(record.resetTime / 1000);

    const response = NextResponse.json(
      {
        success: false,
        error: "Too many requests",
        message: `Rate limit exceeded. Maximum ${limit} requests allowed per minute.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": resetTimeSec.toString(),
        },
      }
    );

    return {
      isRateLimited: true,
      response,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment counter
  record.count += 1;
  const remaining = Math.max(0, limit - record.count);

  return {
    isRateLimited: false,
    remaining,
    resetTime: record.resetTime,
  };
}

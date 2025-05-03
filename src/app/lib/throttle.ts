// lib/throttle.ts

const callTimestamps = new Map<string, number>();

type ThrottleOptions = {
  key: string; // e.g., IP address or user ID
  limitMs: number; // e.g., 15_000 for 15 seconds
};

export function isThrottled({ key, limitMs }: ThrottleOptions): {
  throttled: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const lastCall = callTimestamps.get(key) || 0;
  const elapsed = now - lastCall;

  if (elapsed < limitMs) {
    return {
      throttled: true,
      retryAfter: limitMs - elapsed,
    };
  }

  callTimestamps.set(key, now);
  return { throttled: false };
}

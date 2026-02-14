/**
 * Safely converts a bigint or unknown value to a number for UI display and comparisons.
 * Prevents runtime errors from BigInt operations in React components.
 */
export function toNumber(value: bigint | number | unknown): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'bigint') {
    // Convert bigint to number, clamping to safe integer range
    if (value > Number.MAX_SAFE_INTEGER) {
      return Number.MAX_SAFE_INTEGER;
    }
    if (value < Number.MIN_SAFE_INTEGER) {
      return Number.MIN_SAFE_INTEGER;
    }
    return Number(value);
  }
  // Fallback for null, undefined, or other types
  return 0;
}

/**
 * Safely converts a timestamp (bigint nanoseconds) to a JavaScript Date.
 * IC timestamps are in nanoseconds, JS Date expects milliseconds.
 */
export function timestampToDate(timestamp: bigint | number): Date {
  const ms = toNumber(timestamp) / 1_000_000;
  return new Date(ms);
}

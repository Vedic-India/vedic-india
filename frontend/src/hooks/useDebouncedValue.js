import { useEffect, useState } from "react";

/**
 * Debounce a value for UI-driven search inputs.
 *
 * @template T
 * @param {T} value - The value to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {T} The debounced value.
 */
export function useDebouncedValue(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
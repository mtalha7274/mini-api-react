let fallbackCounter = 0;

/**
 * @param {'col' | 'req' | 'hist' | 'env'} prefix
 * @returns {string}
 */
export function generateId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  fallbackCounter += 1;
  return `${prefix}-${Date.now()}-${fallbackCounter}`;
}

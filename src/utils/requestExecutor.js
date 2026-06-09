import { executeHttpRequest } from '../lib/http';

/**
 * Executes an HTTP request and returns a normalized response snapshot.
 *
 * @param {import('../lib/http/types').RequestConfig} config
 * @returns {Promise<import('../lib/http/types').ResponseSnapshot>}
 */
export async function executeRequest(config) {
  return executeHttpRequest(config);
}

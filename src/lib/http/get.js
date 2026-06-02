/**
 * @param {import('./types').BuiltRequest} built
 * @param {AbortSignal} [signal]
 * @returns {Promise<Response>}
 */
export async function executeGet(built, signal) {
  return fetch(built.url, {
    method: 'GET',
    headers: built.headers,
    signal,
  });
}

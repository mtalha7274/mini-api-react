/**
 * @param {import('./types').BuiltRequest} built
 * @param {AbortSignal} [signal]
 * @returns {Promise<Response>}
 */
export async function executePut(built, signal) {
  return fetch(built.url, {
    method: 'PUT',
    headers: built.headers,
    body: built.body,
    signal,
  });
}

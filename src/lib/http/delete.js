/**
 * @param {import('./types').BuiltRequest} built
 * @param {AbortSignal} [signal]
 * @returns {Promise<Response>}
 */
export async function executeDelete(built, signal) {
  return fetch(built.url, {
    method: 'DELETE',
    headers: built.headers,
    signal,
  });
}

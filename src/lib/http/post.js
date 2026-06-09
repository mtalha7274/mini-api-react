/**
 * @param {import('./types').BuiltRequest} built
 * @param {AbortSignal} [signal]
 * @returns {Promise<Response>}
 */
export async function executePost(built, signal) {
  return fetch(built.url, {
    method: 'POST',
    headers: built.headers,
    body: built.body,
    signal,
  });
}

/**
 * @param {import('./types').BuiltRequest} built
 * @param {AbortSignal} [signal]
 * @returns {Promise<Response>}
 */
export async function executePatch(built, signal) {
  return fetch(built.url, {
    method: 'PATCH',
    headers: built.headers,
    body: built.body,
    signal,
  });
}

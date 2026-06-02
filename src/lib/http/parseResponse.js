/**
 * @param {Response} response
 * @param {number} duration
 * @returns {Promise<import('./types').ResponseSnapshot>}
 */
export async function parseFetchResponse(response, duration) {
  const headers = {};
  response.headers.forEach((value, name) => {
    headers[name] = value;
  });

  const contentType = response.headers.get('content-type') || '';
  let body;

  try {
    if (contentType.includes('application/json')) {
      body = await response.json();
    } else {
      const text = await response.text();
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }
  } catch {
    body = null;
  }

  return {
    status: response.status,
    statusText: response.statusText,
    headers,
    body,
    duration,
  };
}

/**
 * @param {Error | unknown} error
 * @param {number} duration
 * @returns {import('./types').ResponseSnapshot}
 */
export function buildErrorSnapshot(error, duration) {
  const message =
    error instanceof Error ? error.message : String(error ?? 'Request failed');

  return {
    status: 0,
    statusText: 'Error',
    headers: {},
    body: { message },
    duration,
  };
}

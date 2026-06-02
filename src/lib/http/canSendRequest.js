const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH']);

function validateJsonBody(body) {
  if (!body.trim()) return true;
  try {
    JSON.parse(body);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {{ method: string, url: string, body?: string }} request
 * @returns {boolean}
 */
export function canSendRequest({ method, url, body = '' }) {
  if (!url.trim()) return false;
  if (METHODS_WITH_BODY.has(method) && body.trim()) {
    return validateJsonBody(body);
  }
  return true;
}

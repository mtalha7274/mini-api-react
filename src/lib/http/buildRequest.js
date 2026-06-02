import { resolveEnvVariables } from '../../utils/envParser';

const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH']);

function looksLikeJson(text) {
  const trimmed = text.trim();
  return trimmed.startsWith('{') || trimmed.startsWith('[');
}

/**
 * @param {import('./types').KeyValueRow[]} rows
 * @param {Record<string, string>} envVariableMap
 * @returns {Record<string, string>}
 */
export function buildHeaders(rows, envVariableMap) {
  const headers = {};
  for (const row of rows) {
    const key = resolveEnvVariables(row.key.trim(), envVariableMap);
    if (!key) continue;
    headers[key] = resolveEnvVariables(row.value, envVariableMap);
  }
  return headers;
}

/**
 * @param {string} url
 * @param {import('./types').KeyValueRow[]} params
 * @param {Record<string, string>} envVariableMap
 * @returns {string}
 */
export function mergeQueryParams(url, params, envVariableMap) {
  const resolvedUrl = resolveEnvVariables(url.trim(), envVariableMap);
  const entries = params
    .filter((row) => row.key.trim())
    .map((row) => ({
      key: resolveEnvVariables(row.key.trim(), envVariableMap),
      value: resolveEnvVariables(row.value, envVariableMap),
    }));

  if (entries.length === 0) {
    return resolvedUrl;
  }

  const search = new URLSearchParams();
  for (const { key, value } of entries) {
    search.append(key, value);
  }

  const separator = resolvedUrl.includes('?') ? '&' : '?';
  return `${resolvedUrl}${separator}${search.toString()}`;
}

/**
 * @param {import('./types').RequestConfig} config
 * @returns {import('./types').BuiltRequest}
 */
export function buildRequest(config) {
  const { method, url, headers, params, body, envVariableMap } = config;
  const resolvedUrl = mergeQueryParams(url, params, envVariableMap);
  const builtHeaders = buildHeaders(headers, envVariableMap);

  let builtBody;
  if (METHODS_WITH_BODY.has(method)) {
    const resolvedBody = resolveEnvVariables(body ?? '', envVariableMap).trim();
    if (resolvedBody) {
      builtBody = resolvedBody;
      const hasContentType = Object.keys(builtHeaders).some(
        (key) => key.toLowerCase() === 'content-type'
      );
      if (!hasContentType && looksLikeJson(resolvedBody)) {
        builtHeaders['Content-Type'] = 'application/json';
      }
    }
  }

  return {
    url: resolvedUrl,
    headers: builtHeaders,
    body: builtBody,
  };
}

import { resolveEnvVariables } from '../../utils/envParser';
import { resolveEffectiveAuth } from '../../utils/auth';

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
 * @param {Record<string, string>} headers
 * @param {import('../../utils/auth').CollectionAuth | undefined | null} collectionAuth
 * @param {import('../../utils/auth').RequestAuth | undefined | null} requestAuth
 * @param {Record<string, string>} envVariableMap
 */
export function mergeAuthHeaders(
  headers,
  collectionAuth,
  requestAuth,
  envVariableMap
) {
  const effective = resolveEffectiveAuth(collectionAuth, requestAuth);
  if (effective.type !== 'bearer') {
    return headers;
  }

  const token = resolveEnvVariables(effective.token, envVariableMap).trim();
  if (!token) {
    return headers;
  }

  const next = { ...headers };
  for (const key of Object.keys(next)) {
    if (key.toLowerCase() === 'authorization') {
      delete next[key];
    }
  }
  next.Authorization = `Bearer ${token}`;
  return next;
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
  const {
    method,
    url,
    headers,
    params,
    body,
    envVariableMap,
    collectionAuth,
    requestAuth,
  } = config;
  const resolvedUrl = mergeQueryParams(url, params, envVariableMap);
  const builtHeaders = mergeAuthHeaders(
    buildHeaders(headers, envVariableMap),
    collectionAuth,
    requestAuth,
    envVariableMap
  );

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

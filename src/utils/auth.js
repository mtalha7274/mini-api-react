/** @typedef {'none' | 'bearer'} AuthType */
/** @typedef {'inherit' | 'override'} AuthMode */

/**
 * @typedef {object} CollectionAuth
 * @property {AuthType} type
 * @property {string} token
 */

/**
 * @typedef {object} RequestAuth
 * @property {AuthMode} mode
 * @property {AuthType} type
 * @property {string} token
 */

export const DEFAULT_COLLECTION_AUTH = { type: 'none', token: '' };

export const DEFAULT_REQUEST_AUTH = {
  mode: 'inherit',
  type: 'none',
  token: '',
};

/**
 * @param {unknown} auth
 * @param {'collection' | 'request'} kind
 * @returns {CollectionAuth | RequestAuth}
 */
export function normalizeAuth(auth, kind) {
  if (!auth || typeof auth !== 'object') {
    return kind === 'collection'
      ? { ...DEFAULT_COLLECTION_AUTH }
      : { ...DEFAULT_REQUEST_AUTH };
  }

  const a = /** @type {Record<string, unknown>} */ (auth);
  const type = a.type === 'bearer' ? 'bearer' : 'none';
  const token = typeof a.token === 'string' ? a.token : '';

  if (kind === 'collection') {
    return { type, token };
  }

  const mode = a.mode === 'override' ? 'override' : 'inherit';
  return { mode, type, token };
}

/**
 * @param {CollectionAuth | undefined | null} collectionAuth
 * @param {RequestAuth | undefined | null} requestAuth
 * @returns {CollectionAuth}
 */
export function resolveEffectiveAuth(collectionAuth, requestAuth) {
  const normalizedRequest = normalizeAuth(requestAuth, 'request');
  if (normalizedRequest.mode === 'override') {
    return { type: normalizedRequest.type, token: normalizedRequest.token };
  }
  return normalizeAuth(collectionAuth, 'collection');
}

/**
 * @param {CollectionAuth} auth
 * @returns {string}
 */
export function formatAuthSummary(auth) {
  const normalized = normalizeAuth(auth, 'collection');
  if (normalized.type === 'none' || !normalized.token.trim()) {
    return 'No authorization';
  }
  return `Bearer token${normalized.token ? `: ${normalized.token}` : ''}`;
}

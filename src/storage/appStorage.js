import {
  createEmptyKeyValue,
  cloneKeyValueRows,
} from '../data/mockData';

const COLLECTIONS_KEY = 'mini-api-collections';
const ENVIRONMENTS_KEY = 'mini-api-environments';

/**
 * @param {unknown} req
 * @returns {object}
 */
export function normalizeRequest(req) {
  if (!req || typeof req !== 'object') {
    return {
      id: '',
      name: '',
      method: 'GET',
      url: '',
      headers: [createEmptyKeyValue()],
      params: [createEmptyKeyValue()],
      body: '',
    };
  }

  const r = /** @type {Record<string, unknown>} */ (req);
  return {
    id: typeof r.id === 'string' ? r.id : '',
    name: typeof r.name === 'string' ? r.name : '',
    method: typeof r.method === 'string' ? r.method : 'GET',
    url: typeof r.url === 'string' ? r.url : '',
    headers: Array.isArray(r.headers)
      ? cloneKeyValueRows(
          r.headers.map((row) => ({
            key: typeof row?.key === 'string' ? row.key : '',
            value: typeof row?.value === 'string' ? row.value : '',
          }))
        )
      : [createEmptyKeyValue()],
    params: Array.isArray(r.params)
      ? cloneKeyValueRows(
          r.params.map((row) => ({
            key: typeof row?.key === 'string' ? row.key : '',
            value: typeof row?.value === 'string' ? row.value : '',
          }))
        )
      : [createEmptyKeyValue()],
    body: typeof r.body === 'string' ? r.body : '',
  };
}

function normalizeEnvironment(env) {
  if (!env || typeof env !== 'object') return null;

  const e = /** @type {Record<string, unknown>} */ (env);
  if (typeof e.id !== 'string' || typeof e.name !== 'string') return null;

  return {
    id: e.id,
    name: e.name,
    variables: Array.isArray(e.variables)
      ? cloneKeyValueRows(
          e.variables.map((row) => ({
            key: typeof row?.key === 'string' ? row.key : '',
            value: typeof row?.value === 'string' ? row.value : '',
          }))
        )
      : [createEmptyKeyValue()],
  };
}

function normalizeCollection(col) {
  if (!col || typeof col !== 'object') return null;

  const c = /** @type {Record<string, unknown>} */ (col);
  if (typeof c.id !== 'string' || typeof c.name !== 'string') return null;

  const environmentId =
    c.environmentId === null || typeof c.environmentId === 'string'
      ? c.environmentId
      : null;

  const requests = Array.isArray(c.requests)
    ? c.requests.map(normalizeRequest).filter((r) => r.id)
    : [];

  return {
    id: c.id,
    name: c.name,
    environmentId,
    requests,
  };
}

/**
 * @returns {{ collections: object[] }}
 */
export function loadCollections() {
  try {
    const raw = localStorage.getItem(COLLECTIONS_KEY);
    if (!raw) return { collections: [] };

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.collections)) {
      return { collections: [] };
    }

    const collections = parsed.collections
      .map(normalizeCollection)
      .filter(Boolean);

    return { collections };
  } catch {
    return { collections: [] };
  }
}

/**
 * @param {object[]} collections
 */
export function saveCollections(collections) {
  try {
    localStorage.setItem(
      COLLECTIONS_KEY,
      JSON.stringify({ collections })
    );
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * @returns {{ environments: object[] }}
 */
export function loadEnvironments() {
  try {
    const raw = localStorage.getItem(ENVIRONMENTS_KEY);
    if (!raw) return { environments: [] };

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.environments)) {
      return { environments: [] };
    }

    const environments = parsed.environments
      .map(normalizeEnvironment)
      .filter(Boolean);

    return { environments };
  } catch {
    return { environments: [] };
  }
}

/**
 * @param {object[]} environments
 */
export function saveEnvironments(environments) {
  try {
    localStorage.setItem(
      ENVIRONMENTS_KEY,
      JSON.stringify({ environments })
    );
  } catch {
    /* ignore */
  }
}

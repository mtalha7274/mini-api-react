import { emptyResponse } from '../data/mockData';

/**
 * @param {Record<string, import('../lib/http/types').ResponseSnapshot>} map
 * @param {string | null | undefined} requestId
 * @returns {import('../lib/http/types').ResponseSnapshot}
 */
export function getResponseForRequest(map, requestId) {
  if (!requestId) return emptyResponse;
  return map[requestId] ?? emptyResponse;
}

/**
 * @param {Record<string, import('../lib/http/types').ResponseSnapshot>} map
 * @param {string} requestId
 * @param {import('../lib/http/types').ResponseSnapshot} snapshot
 * @returns {Record<string, import('../lib/http/types').ResponseSnapshot>}
 */
export function setResponseForRequest(map, requestId, snapshot) {
  return { ...map, [requestId]: snapshot };
}

/**
 * @param {Record<string, import('../lib/http/types').ResponseSnapshot>} map
 * @param {string} requestId
 * @returns {Record<string, import('../lib/http/types').ResponseSnapshot>}
 */
export function removeResponseForRequest(map, requestId) {
  const next = { ...map };
  delete next[requestId];
  return next;
}

/**
 * @param {Record<string, import('../lib/http/types').ResponseSnapshot>} map
 * @param {string[]} requestIds
 * @returns {Record<string, import('../lib/http/types').ResponseSnapshot>}
 */
export function removeResponsesForRequestIds(map, requestIds) {
  if (requestIds.length === 0) return map;
  const next = { ...map };
  for (const id of requestIds) {
    delete next[id];
  }
  return next;
}

import { buildRequest } from './buildRequest';
import { parseFetchResponse, buildErrorSnapshot } from './parseResponse';
import { executeGet } from './get';
import { executePost } from './post';
import { executePut } from './put';
import { executePatch } from './patch';
import { executeDelete } from './delete';

/** @type {Record<string, (built: import('./types').BuiltRequest, signal?: AbortSignal) => Promise<Response>>} */
const METHOD_HANDLERS = {
  GET: executeGet,
  POST: executePost,
  PUT: executePut,
  PATCH: executePatch,
  DELETE: executeDelete,
};

/**
 * @param {import('./types').RequestConfig} config
 * @returns {Promise<import('./types').ResponseSnapshot>}
 */
export async function executeHttpRequest(config) {
  const start = performance.now();

  try {
    const built = buildRequest(config);
    if (!built.url) {
      return buildErrorSnapshot(new Error('URL is required'), 0);
    }

    const handler = METHOD_HANDLERS[config.method] ?? executeGet;
    const response = await handler(built);
    const duration = Math.round(performance.now() - start);
    return parseFetchResponse(response, duration);
  } catch (error) {
    const duration = Math.round(performance.now() - start);
    return buildErrorSnapshot(error, duration);
  }
}

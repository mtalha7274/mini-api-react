/**
 * @typedef {object} KeyValueRow
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef {object} RequestConfig
 * @property {string} method
 * @property {string} url
 * @property {KeyValueRow[]} headers
 * @property {KeyValueRow[]} params
 * @property {string} [body]
 * @property {Record<string, string>} envVariableMap
 * @property {import('../../utils/auth').CollectionAuth} [collectionAuth]
 * @property {import('../../utils/auth').RequestAuth} [requestAuth]
 */

/**
 * @typedef {object} BuiltRequest
 * @property {string} url
 * @property {Record<string, string>} headers
 * @property {string} [body]
 */

/**
 * @typedef {object} ResponseSnapshot
 * @property {number} status
 * @property {string} statusText
 * @property {Record<string, string>} headers
 * @property {unknown} body
 * @property {number} duration
 */

export {};

import {
  bodyRequiresJsonValidation,
  getJsonValidationError,
} from '../../utils/jsonValidation';

/**
 * @param {{ method: string, url: string, body?: string }} request
 * @returns {boolean}
 */
export function canSendRequest({ method, url, body = '' }) {
  if (!url.trim()) return false;
  if (bodyRequiresJsonValidation(method, body)) {
    return getJsonValidationError(body) === null;
  }
  return true;
}

export const METHODS_WITH_JSON_BODY = new Set(['POST', 'PUT', 'PATCH']);

/**
 * @param {string} method
 * @param {string} [body]
 */
export function bodyRequiresJsonValidation(method, body = '') {
  return METHODS_WITH_JSON_BODY.has(method) && body.trim().length > 0;
}

/**
 * @param {string} text
 * @param {number} position
 * @returns {{ line: number, column: number }}
 */
export function positionToLineColumn(text, position) {
  const safePos = Math.max(0, Math.min(position, text.length));
  const before = text.slice(0, safePos);
  const line = before.split('\n').length;
  const lastNewline = before.lastIndexOf('\n');
  const column = safePos - lastNewline;
  return { line, column };
}

/**
 * @param {string} text
 * @param {number} line
 * @param {number} column
 * @returns {number}
 */
export function lineColumnToPosition(text, line, column) {
  const lines = text.split('\n');
  const lineIndex = Math.max(1, Math.min(line, lines.length)) - 1;
  let position = 0;
  for (let i = 0; i < lineIndex; i++) {
    position += lines[i].length + 1;
  }
  return position + Math.max(0, column - 1);
}

/**
 * @param {SyntaxError} err
 * @param {string} text
 * @returns {number}
 */
function extractErrorPosition(err, text) {
  const msg = err.message;

  const lineColumnMatch = msg.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineColumnMatch) {
    return lineColumnToPosition(
      text,
      Number(lineColumnMatch[1]),
      Number(lineColumnMatch[2])
    );
  }

  const positionMatch = msg.match(/position\s+(\d+)/i);
  if (positionMatch) {
    return Math.min(Number(positionMatch[1]), text.length);
  }

  return 0;
}

/**
 * @param {unknown} err
 * @returns {string}
 */
function formatJsonErrorMessage(err) {
  if (!(err instanceof SyntaxError)) {
    return 'Invalid JSON';
  }

  return err.message
    .replace(/^JSON\.parse:\s*/i, '')
    .replace(/^Unexpected token (.+) in JSON at position \d+$/i, 'Unexpected token $1')
    .replace(/^Unexpected token (.+) at position \d+$/i, 'Unexpected token $1')
    .trim();
}

/**
 * @param {string} body
 * @returns {null | { message: string, line: number, column: number, position: number }}
 */
export function getJsonValidationError(body) {
  if (!body.trim()) return null;

  try {
    JSON.parse(body);
    return null;
  } catch (err) {
    const position =
      err instanceof SyntaxError ? extractErrorPosition(err, body) : 0;
    const { line, column } = positionToLineColumn(body, position);

    return {
      message: formatJsonErrorMessage(err),
      line,
      column,
      position,
    };
  }
}

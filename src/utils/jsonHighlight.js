/**
 * @typedef {'plain' | 'punctuation' | 'key' | 'string' | 'number' | 'boolean' | 'null'} JsonTokenType
 * @typedef {{ type: JsonTokenType, text: string }} JsonToken
 */

/**
 * @param {string} text
 * @param {number} start
 */
function peekNonWhitespace(text, start) {
  let i = start;
  while (i < text.length && /\s/.test(text[i])) i += 1;
  return i < text.length ? text[i] : '';
}

/**
 * @param {string} text
 * @param {number} start
 * @returns {{ text: string, next: number }}
 */
function readString(text, start) {
  let value = '"';
  let i = start + 1;
  while (i < text.length) {
    const ch = text[i];
    value += ch;
    if (ch === '\\' && i + 1 < text.length) {
      value += text[i + 1];
      i += 2;
      continue;
    }
    if (ch === '"') {
      i += 1;
      break;
    }
    i += 1;
  }
  return { text: value, next: i };
}

/**
 * @param {string} text
 * @param {number} start
 * @returns {{ text: string, next: number } | null}
 */
function readNumber(text, start) {
  const match = text.slice(start).match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/);
  if (!match) return null;
  return { text: match[0], next: start + match[0].length };
}

/**
 * @param {string} text
 * @param {number} start
 * @param {string} word
 * @returns {boolean}
 */
function startsWithWord(text, start, word) {
  return text.slice(start, start + word.length) === word;
}

/**
 * Best-effort JSON syntax tokens for editable body highlighting.
 * @param {string} text
 * @returns {JsonToken[]}
 */
export function tokenizeJsonText(text) {
  if (!text) return [];

  const tokens = [];
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (/\s/.test(ch)) {
      let ws = '';
      while (i < text.length && /\s/.test(text[i])) {
        ws += text[i];
        i += 1;
      }
      tokens.push({ type: 'plain', text: ws });
      continue;
    }

    if ('{}[]:,'.includes(ch)) {
      tokens.push({ type: 'punctuation', text: ch });
      i += 1;
      continue;
    }

    if (ch === '"') {
      const { text: str, next } = readString(text, i);
      const isKey = peekNonWhitespace(text, next) === ':';
      tokens.push({ type: isKey ? 'key' : 'string', text: str });
      i = next;
      continue;
    }

    const num = readNumber(text, i);
    if (num) {
      tokens.push({ type: 'number', text: num.text });
      i = num.next;
      continue;
    }

    if (startsWithWord(text, i, 'true')) {
      tokens.push({ type: 'boolean', text: 'true' });
      i += 4;
      continue;
    }
    if (startsWithWord(text, i, 'false')) {
      tokens.push({ type: 'boolean', text: 'false' });
      i += 5;
      continue;
    }
    if (startsWithWord(text, i, 'null')) {
      tokens.push({ type: 'null', text: 'null' });
      i += 4;
      continue;
    }

    tokens.push({ type: 'plain', text: ch });
    i += 1;
  }

  return tokens;
}

/**
 * @param {string} body
 * @returns {string | null}
 */
export function formatJsonBody(body) {
  const trimmed = body.trim();
  if (!trimmed) return '';
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return null;
  }
}

const ENV_TOKEN_RE = /\{\{(\w+)\}\}/g;

/**
 * @param {Array<{ key: string, value: string }>} variables
 * @returns {Record<string, string>}
 */
export function variablesArrayToMap(variables) {
  const map = {};
  for (const row of variables ?? []) {
    const key = row.key?.trim();
    if (key) map[key] = row.value ?? '';
  }
  return map;
}

/**
 * @param {string} text
 * @returns {Array<{ type: 'text', value: string } | { type: 'token', name: string, value: string }>}
 */
export function splitEnvTokens(text) {
  if (!text) return [{ type: 'text', value: '' }];

  const parts = [];
  let lastIndex = 0;
  const re = new RegExp(ENV_TOKEN_RE.source, 'g');
  let match = re.exec(text);

  while (match) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    parts.push({
      type: 'token',
      name: match[1],
      value: match[0],
    });
    lastIndex = match.index + match[0].length;
    match = re.exec(text);
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: 'text', value: text }];
}

/**
 * @param {string} text
 * @param {number} index
 * @returns {{ name: string, raw: string, start: number, end: number } | null}
 */
export function findEnvTokenAtIndex(text, index) {
  if (!text || index < 0) return null;

  const re = new RegExp(ENV_TOKEN_RE.source, 'g');
  let match = re.exec(text);

  while (match) {
    const start = match.index;
    const end = start + match[0].length;
    if (index >= start && index < end) {
      return { name: match[1], raw: match[0], start, end };
    }
    match = re.exec(text);
  }

  return null;
}

/**
 * Substitutes {{VAR}} placeholders in a string using environment variables.
 *
 * @param {string} template
 * @param {Record<string, string>} variables
 * @returns {string}
 */
export function resolveEnvVariables(template, variables) {
  if (!template) return '';
  return template.replace(/\{\{(\w+)\}\}/g, (_, name) => variables[name] ?? `{{${name}}}`);
}

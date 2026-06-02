/**
 * Substitutes {{VAR}} placeholders in a string using environment variables.
 * Implementation planned for Phase 3.
 *
 * @param {string} template
 * @param {Record<string, string>} variables
 * @returns {string}
 */
export function resolveEnvVariables(template, variables) {
  if (!template) return '';
  return template.replace(/\{\{(\w+)\}\}/g, (_, name) => variables[name] ?? `{{${name}}}`);
}

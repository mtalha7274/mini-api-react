import { tokenizeJsonText, formatJsonBody } from './jsonHighlight';

test('tokenizeJsonText highlights keys strings and numbers', () => {
  const tokens = tokenizeJsonText('{\n  "name": "Jane",\n  "age": 30\n}');
  const types = tokens.map((t) => t.type);
  expect(types).toContain('key');
  expect(types).toContain('string');
  expect(types).toContain('number');
  expect(types).toContain('punctuation');
});

test('tokenizeJsonText highlights booleans and null', () => {
  const tokens = tokenizeJsonText('{ "ok": true, "data": null }');
  expect(tokens.some((t) => t.type === 'boolean' && t.text === 'true')).toBe(true);
  expect(tokens.some((t) => t.type === 'null')).toBe(true);
});

test('formatJsonBody pretty-prints valid JSON', () => {
  expect(formatJsonBody('{"a":1}')).toBe('{\n  "a": 1\n}');
});

test('formatJsonBody returns null for invalid JSON', () => {
  expect(formatJsonBody('{ bad')).toBeNull();
});

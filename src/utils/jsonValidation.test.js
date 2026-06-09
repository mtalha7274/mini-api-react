import {
  getJsonValidationError,
  positionToLineColumn,
  bodyRequiresJsonValidation,
} from './jsonValidation';

test('bodyRequiresJsonValidation is true for POST with body', () => {
  expect(bodyRequiresJsonValidation('POST', '{ "a": 1 }')).toBe(true);
  expect(bodyRequiresJsonValidation('GET', '{ "a": 1 }')).toBe(false);
  expect(bodyRequiresJsonValidation('POST', '  ')).toBe(false);
});

test('getJsonValidationError returns null for valid JSON', () => {
  expect(getJsonValidationError('{\n  "a": 1\n}')).toBeNull();
});

test('getJsonValidationError returns line and column for invalid JSON', () => {
  const text = '{\n  "a": ,\n}';
  const error = getJsonValidationError(text);
  expect(error).not.toBeNull();
  expect(error.line).toBeGreaterThanOrEqual(1);
  expect(error.column).toBeGreaterThanOrEqual(1);
  expect(error.message).toBeTruthy();
});

test('positionToLineColumn maps index to line/column', () => {
  expect(positionToLineColumn('a\nbc', 3)).toEqual({ line: 2, column: 2 });
});

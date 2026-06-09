import { countLines } from './LineNumberGutter';

test('countLines returns 1 for empty text', () => {
  expect(countLines('')).toBe(1);
});

test('countLines counts newline-separated lines', () => {
  expect(countLines('a\nb\nc')).toBe(3);
});

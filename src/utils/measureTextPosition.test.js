import { measureCaretOffset } from './measureTextPosition';

beforeAll(() => {
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

function createTextarea(value, styles = {}) {
  const el = document.createElement('textarea');
  el.value = value;
  Object.assign(el.style, {
    fontFamily: 'monospace',
    fontSize: '14px',
    lineHeight: '24px',
    padding: '12px',
    ...styles,
  });
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('measureCaretOffset returns larger left for greater column', () => {
  const textarea = createTextarea('abc\ndef');
  const line1col1 = measureCaretOffset(textarea, 2, 1);
  const line1col3 = measureCaretOffset(textarea, 2, 3);
  expect(line1col3.left).toBeGreaterThan(line1col1.left);
});

test('measureCaretOffset returns larger top for later lines', () => {
  const textarea = createTextarea('first\nsecond');
  const line1 = measureCaretOffset(textarea, 1, 1);
  const line2 = measureCaretOffset(textarea, 2, 1);
  expect(line2.top).toBeGreaterThan(line1.top);
});

test('measureCaretOffset includes lineHeight and squiggleTop below line', () => {
  const textarea = createTextarea('{ "a": 1 }');
  const pos = measureCaretOffset(textarea, 1, 3);
  expect(pos.lineHeight).toBeGreaterThan(0);
  expect(pos.squiggleTop).toBeGreaterThan(pos.top);
  expect(pos.charWidth).toBeGreaterThan(0);
});

/**
 * Approximate character index in a text input from a pointer X coordinate.
 * @param {HTMLInputElement} input
 * @param {number} clientX
 * @returns {number}
 */
export function getInputOffsetFromPoint(input, clientX) {
  const text = input.value;
  if (!text) return 0;

  const style = window.getComputedStyle(input);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return text.length;

  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

  const paddingLeft = parseFloat(style.paddingLeft) || 0;
  const rect = input.getBoundingClientRect();
  const targetX = clientX - rect.left - paddingLeft + input.scrollLeft;

  if (targetX <= 0) return 0;

  let width = 0;
  for (let i = 0; i < text.length; i += 1) {
    const charWidth = ctx.measureText(text[i]).width;
    if (width + charWidth / 2 >= targetX) return i;
    width += charWidth;
  }

  return text.length;
}

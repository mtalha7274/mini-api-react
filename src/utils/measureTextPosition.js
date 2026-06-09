/**
 * @param {HTMLTextAreaElement} textarea
 * @returns {CanvasRenderingContext2D | null}
 */
function getMeasureContext(textarea) {
  const style = window.getComputedStyle(textarea);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  return ctx;
}

/**
 * @param {HTMLTextAreaElement} textarea
 * @param {number} line 1-based
 * @param {number} column 1-based
 * @returns {{ top: number, left: number, lineHeight: number, charWidth: number, squiggleTop: number, lineCenter: number }}
 */
export function measureCaretOffset(textarea, line, column) {
  const style = window.getComputedStyle(textarea);
  const paddingLeft = parseFloat(style.paddingLeft) || 0;
  const paddingTop = parseFloat(style.paddingTop) || 0;
  const lineHeight = parseFloat(style.lineHeight) || 24;

  const lines = textarea.value.split('\n');
  const lineIndex = Math.max(0, Math.min(line - 1, lines.length - 1));
  const lineText = lines[lineIndex] ?? '';
  const colIndex = Math.max(0, Math.min(column - 1, lineText.length));
  const prefix = lineText.slice(0, colIndex);

  const ctx = getMeasureContext(textarea);
  const prefixWidth = ctx ? ctx.measureText(prefix).width : colIndex * 8;
  const char =
    colIndex < lineText.length ? lineText[colIndex] : lineText[lineText.length - 1] || ' ';
  const charWidth = ctx ? ctx.measureText(char || ' ').width : 8;

  const top = paddingTop + lineIndex * lineHeight;
  const left = paddingLeft + prefixWidth;
  // Sit just below the text baseline area, fully inside the line box
  const squiggleTop = top + lineHeight - 7;
  const lineCenter = top + lineHeight / 2;

  return {
    top,
    left,
    lineHeight,
    charWidth: Math.max(charWidth, 6),
    squiggleTop,
    lineCenter,
  };
}

import { forwardRef, useMemo } from 'react';

/**
 * @param {string} text
 * @returns {number}
 */
export function countLines(text) {
  if (!text) return 1;
  return text.split('\n').length;
}

/**
 * @param {object} props
 * @param {string} props.text
 * @param {number | null} [props.errorLine] 1-based line to highlight
 * @param {string} [props.className]
 * @param {string} [props.padClassName] padding aligned with editor content
 */
const LineNumberGutter = forwardRef(function LineNumberGutter(
  { text, errorLine = null, className = 'w-9', padClassName = 'py-3 pl-1 pr-2' },
  ref
) {
  const lineCount = useMemo(() => countLines(text), [text]);
  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, i) => i + 1),
    [lineCount]
  );

  return (
    <div
      ref={ref}
      className={`relative shrink-0 overflow-hidden border-r border-gutter-divider bg-surfaceMuted ${className}`}
      aria-hidden
    >
      <div className={padClassName}>
        {lineNumbers.map((line) => {
          const isError = errorLine === line;
          return (
            <div
              key={line}
              className={`relative flex h-6 items-center justify-end gap-1 font-mono text-xs leading-6 tabular-nums ${
                isError ? 'text-danger' : 'text-muted'
              }`}
            >
              {isError && (
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger"
                  aria-hidden
                />
              )}
              <span>{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default LineNumberGutter;

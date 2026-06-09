import { useCallback, useEffect, useRef, useState } from 'react';
import JsonErrorMarker from '../shared/JsonErrorMarker';
import JsonHighlightLayer from '../shared/JsonHighlightLayer';
import LineNumberGutter from '../shared/LineNumberGutter';
import { formatJsonBody } from '../../utils/jsonHighlight';
import { measureCaretOffset } from '../../utils/measureTextPosition';

const EDITOR_PAD = 'p-3 font-mono text-sm leading-6';
const HIGHLIGHT_CLASS = `${EDITOR_PAD} min-h-full whitespace-pre-wrap break-words`;
const TEXTAREA_CLASS = `relative z-20 block h-full min-h-[200px] w-full resize-y border-0 bg-transparent ${EDITOR_PAD} text-transparent caret-foreground selection:bg-accent/25 focus:outline-none`;

/**
 * @param {object} props
 * @param {string} props.body
 * @param {(body: string) => void} props.onChange
 * @param {{ message: string, line: number, column: number } | null} [props.error]
 */
export default function BodyEditor({ body, onChange, error }) {
  const textareaRef = useRef(null);
  const backdropRef = useRef(null);
  const lineGutterRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [scroll, setScroll] = useState({ top: 0, left: 0 });

  const updateMarkerPosition = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || !error) {
      setMarkerPosition(null);
      return;
    }
    setMarkerPosition(
      measureCaretOffset(textarea, error.line, error.column)
    );
  }, [error, body]);

  const handleScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const backdrop = backdropRef.current;
    const lineGutter = lineGutterRef.current;
    if (!textarea) return;
    setScroll({ top: textarea.scrollTop, left: textarea.scrollLeft });
    if (backdrop) {
      backdrop.scrollTop = textarea.scrollTop;
      backdrop.scrollLeft = textarea.scrollLeft;
    }
    if (lineGutter) {
      lineGutter.scrollTop = textarea.scrollTop;
    }
  }, []);

  useEffect(() => {
    updateMarkerPosition();
    const textarea = textareaRef.current;
    if (!textarea) return undefined;

    const observer = new ResizeObserver(updateMarkerPosition);
    observer.observe(textarea);
    return () => observer.disconnect();
  }, [updateMarkerPosition]);

  useEffect(() => {
    if (!error || !textareaRef.current) return;
    const textarea = textareaRef.current;
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 24;
    const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop) || 12;
    const targetTop =
      paddingTop + (error.line - 1) * lineHeight - textarea.clientHeight / 3;
    textarea.scrollTop = Math.max(0, targetTop);
    handleScroll();
  }, [error, handleScroll]);

  const handleFormat = useCallback(() => {
    const formatted = formatJsonBody(body);
    if (formatted !== null) {
      onChange(formatted);
    }
  }, [body, onChange]);

  const canFormat = formatJsonBody(body) !== null;
  const errorDescId = error ? 'body-json-error-desc' : undefined;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          JSON / Text
        </span>
        <button
          type="button"
          onClick={handleFormat}
          disabled={!canFormat}
          className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-accent transition-colors hover:bg-surfaceMuted hover:text-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Format JSON
        </button>
      </div>

      <div className="relative flex min-h-[200px] flex-1 overflow-hidden rounded-lg border border-border bg-surfaceMuted">
        <LineNumberGutter
          ref={lineGutterRef}
          text={body}
          errorLine={error?.line ?? null}
        />

        <div className="relative min-h-0 min-w-0 flex-1">
          <div
            ref={backdropRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 overflow-auto"
          >
            <JsonHighlightLayer
              text={body}
              className={HIGHLIGHT_CLASS}
              placeholder='{ "key": "value" }'
            />
          </div>

          {error && markerPosition && (
            <div className="pointer-events-none absolute inset-x-0 top-0 bottom-1 z-10 overflow-visible">
              <JsonErrorMarker
                position={markerPosition}
                scrollTop={scroll.top}
                scrollLeft={scroll.left}
                message={`Line ${error.line}, column ${error.column}: ${error.message}`}
                describedById={errorDescId}
              />
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            spellCheck={false}
            className={TEXTAREA_CLASS}
            placeholder=""
            aria-label="Request body"
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={errorDescId}
          />
        </div>
      </div>
    </div>
  );
}

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  findEnvTokenAtIndex,
  splitEnvTokens,
} from '../../utils/envParser';
import { getInputOffsetFromPoint } from '../../utils/getInputOffsetFromPoint';

const INPUT_CLASS =
  'relative z-10 box-border h-10 min-h-10 w-full min-w-0 flex-1 rounded-l-none rounded-r-lg border border-border border-l-0 bg-transparent px-3 py-0 font-sans text-sm leading-10 text-transparent caret-foreground shadow-none placeholder:text-muted selection:bg-accent/25 focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring pointer-events-auto';

const BACKDROP_CLASS =
  'pointer-events-none absolute inset-0 z-0 overflow-hidden whitespace-pre px-3 py-0 font-sans text-sm leading-10 text-foreground';

/**
 * @param {object} props
 * @param {string} props.url
 * @param {(url: string) => void} props.onChange
 * @param {Record<string, string>} [props.envVariableMap]
 */
export default function UrlInput({ url, onChange, envVariableMap = {} }) {
  const inputRef = useRef(null);
  const backdropRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  const segments = useMemo(() => splitEnvTokens(url), [url]);

  const syncScroll = useCallback(() => {
    if (inputRef.current && backdropRef.current) {
      backdropRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  }, []);

  const updateTooltipFromPointer = useCallback(
    (clientX, clientY) => {
      const input = inputRef.current;
      if (!input) {
        setTooltip(null);
        return;
      }

      const index = getInputOffsetFromPoint(input, clientX);
      const token = findEnvTokenAtIndex(url, index);

      if (!token) {
        setTooltip(null);
        return;
      }

      const hasKey = Object.prototype.hasOwnProperty.call(
        envVariableMap,
        token.name
      );
      const resolved = hasKey ? envVariableMap[token.name] : undefined;

      setTooltip({
        name: token.name,
        raw: token.raw,
        resolved,
        unset: !hasKey,
        x: clientX,
        y: clientY,
      });
    },
    [url, envVariableMap]
  );

  const handleMouseMove = useCallback(
    (e) => {
      updateTooltipFromPointer(e.clientX, e.clientY);
    },
    [updateTooltipFromPointer]
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <div className="relative min-w-0 flex-1">
      <div
        ref={backdropRef}
        aria-hidden
        className={`${BACKDROP_CLASS} rounded-r-lg border border-transparent border-l-0 bg-input`}
      >
        {url ? (
          segments.map((part, index) =>
            part.type === 'token' ? (
              <span
                key={`${part.name}-${index}`}
                className="font-medium text-accent underline decoration-accent/60 underline-offset-2"
              >
                {part.value}
              </span>
            ) : (
              <span key={`text-${index}`}>{part.value}</span>
            )
          )
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={url}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        placeholder="Enter request URL (supports {{VAR}})"
        className={INPUT_CLASS}
        aria-label="Request URL"
        spellCheck={false}
      />

      {tooltip && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-50 max-w-xs -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs shadow-card"
          style={{ left: tooltip.x, top: tooltip.y - 6 }}
        >
          <span className="font-mono font-medium text-accent">{tooltip.raw}</span>
          <span className="text-muted"> → </span>
          {tooltip.unset ? (
            <span className="text-muted">Not set in environment</span>
          ) : (
            <span className="break-all font-mono text-foreground">
              {tooltip.resolved || '(empty)'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

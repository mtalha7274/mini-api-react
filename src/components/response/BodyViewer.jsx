import { useCallback, useRef } from 'react';
import JsonHighlightLayer from '../shared/JsonHighlightLayer';
import LineNumberGutter from '../shared/LineNumberGutter';

const CONTENT_PAD = 'p-4 font-mono text-sm leading-6';

/**
 * @param {unknown} body
 * @returns {string}
 */
function bodyToDisplayText(body) {
  if (typeof body === 'string') return body;
  if (body === null || body === undefined) return '';
  return JSON.stringify(body, null, 2);
}

/**
 * @param {object} props
 * @param {unknown} props.body
 */
export default function BodyViewer({ body }) {
  const formatted = bodyToDisplayText(body);
  const scrollRef = useRef(null);
  const lineGutterRef = useRef(null);

  const handleScroll = useCallback(() => {
    const content = scrollRef.current;
    const gutter = lineGutterRef.current;
    if (content && gutter) {
      gutter.scrollTop = content.scrollTop;
    }
  }, []);

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <LineNumberGutter
        ref={lineGutterRef}
        text={formatted}
        className="w-9"
        padClassName="py-4 pl-1 pr-2"
      />
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="min-h-0 min-w-0 flex-1 overflow-auto"
      >
        <JsonHighlightLayer text={formatted} className={CONTENT_PAD} />
      </div>
    </div>
  );
}

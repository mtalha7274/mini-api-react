import { ResponseViewer } from '../response';

/**
 * @param {object} props
 * @param {object} props.response
 * @param {number} props.height - Total panel height (header + body)
 * @param {React.RefObject<HTMLElement>} [props.headerRef] - "Response" title bar for min clamp
 */
export default function ResponsePanel({
  response,
  height,
  headerRef,
}) {
  return (
    <section
      style={{ height: `${height}px` }}
      className="flex shrink-0 flex-col overflow-hidden border-t border-border bg-surface"
    >
      <div
        ref={headerRef}
        className="shrink-0 border-b border-border px-3 py-2 sm:px-4"
      >
        <h2 className="text-sm font-semibold text-foreground">Response</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <ResponseViewer response={response} />
      </div>
    </section>
  );
}
